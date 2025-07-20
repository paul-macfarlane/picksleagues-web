import { createFileRoute, useParams } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  LEAGUE_MEMBER_INCLUDES,
  LEAGUE_MEMBER_ROLES,
} from "@/features/leagueMembers/leagueMembers.types";
import { GetLeagueMembersQueryOptions } from "@/features/leagueMembers/leagueMembers.api";
import { MembersList } from "@/features/leagueMembers/components/members-list";
import { InviteManagement } from "@/features/leagueInvites/components/invite-management";
import { GetLeagueInvitesQueryOptions } from "@/features/leagueInvites/leagueInvites.api";
import { MembersPageSkeleton } from "@/features/leagueMembers/components/members-page-states";
import { RouteErrorBoundary } from "@/components/route-error-boundary";
import { LEAGUE_INVITE_INCLUDES } from "@/features/leagueInvites/leagueInvites.types";
import { Suspense } from "react";
import { InviteManagementSkeleton } from "@/features/leagueInvites/components/invite-management-skeleton";
import type { PopulatedLeagueMemberResponse } from "@/features/leagueMembers/leagueMembers.types";
import type { LeagueResponse } from "@/features/leagues/leagues.types";
import { GetLeagueQueryOptions } from "@/features/leagues/leagues.api";

function canManageMembers(
  userId: string,
  members: PopulatedLeagueMemberResponse[],
) {
  const currentUserMemberInfo = members.find(
    (member) => member.userId === userId,
  );
  return currentUserMemberInfo?.role === LEAGUE_MEMBER_ROLES.COMMISSIONER;
}

function canManageInvites(
  userId: string,
  league: LeagueResponse,
  members: PopulatedLeagueMemberResponse[],
) {
  const currentUserMemberInfo = members.find(
    (member) => member.userId === userId,
  );
  return (
    currentUserMemberInfo?.role === LEAGUE_MEMBER_ROLES.COMMISSIONER &&
    members.length < league.size
  );
}

export const Route = createFileRoute(
  "/_authenticated/football/pick-em/$leagueId/members",
)({
  component: MembersComponent,
  loader: async ({
    context: { queryClient, session },
    params: { leagueId },
  }) => {
    // todo - this is fine, but may be a better way to get the league that was already fetched in the layout
    const league = await queryClient.ensureQueryData(
      GetLeagueQueryOptions(leagueId),
    );

    const members = await queryClient.ensureQueryData(
      GetLeagueMembersQueryOptions(leagueId, [LEAGUE_MEMBER_INCLUDES.PROFILE]),
    );

    if (canManageInvites(session!.userId, league, members)) {
      await queryClient.ensureQueryData(
        GetLeagueInvitesQueryOptions({
          leagueId,
          includes: [LEAGUE_INVITE_INCLUDES.INVITEE],
        }),
      );
    }
  },
  pendingComponent: MembersPageSkeleton,
  errorComponent: () => <RouteErrorBoundary />,
  pendingMs: 300,
});

function CommissionerInviteManagement({
  leagueId,
  currentMembers,
}: {
  leagueId: string;
  currentMembers: PopulatedLeagueMemberResponse[];
}) {
  const { data: invites } = useSuspenseQuery(
    GetLeagueInvitesQueryOptions({
      leagueId,
      includes: [LEAGUE_INVITE_INCLUDES.INVITEE],
    }),
  );
  return <InviteManagement currentMembers={currentMembers} invites={invites} />;
}

function MembersComponent() {
  const { leagueId } = useParams({
    from: "/_authenticated/football/pick-em/$leagueId/members",
  });
  const { session } = Route.useRouteContext();
  const { data: league } = useSuspenseQuery(GetLeagueQueryOptions(leagueId));
  const { data: members } = useSuspenseQuery(
    GetLeagueMembersQueryOptions(leagueId, [LEAGUE_MEMBER_INCLUDES.PROFILE]),
  );

  // todo - this works, but might be a better way to avoid re-doing work done in the loader
  const userCanManageInvites = canManageInvites(
    session!.userId,
    league,
    members,
  );
  const userCanManageMembers = canManageMembers(session!.userId, members);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Members ({members.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <MembersList
            members={members}
            canManageMembers={userCanManageMembers}
            userId={session!.userId}
          />
        </CardContent>
      </Card>

      {userCanManageInvites && (
        <Suspense fallback={<InviteManagementSkeleton />}>
          <CommissionerInviteManagement
            leagueId={leagueId}
            currentMembers={members}
          />
        </Suspense>
      )}
    </div>
  );
}
