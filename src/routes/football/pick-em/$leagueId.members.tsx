import { createFileRoute, redirect, useParams } from "@tanstack/react-router";
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

export const Route = createFileRoute("/football/pick-em/$leagueId/members")({
  component: MembersComponent,
  beforeLoad: async ({ context }) => {
    if (!context.session) {
      throw redirect({ to: "/login" });
    }
  },
  loader: async ({ context: { queryClient }, params: { leagueId } }) => {
    await Promise.all([
      queryClient.ensureQueryData(
        GetLeagueMembersQueryOptions(leagueId, [
          LEAGUE_MEMBER_INCLUDES.PROFILE,
        ]),
      ),

      // TODO - there is an issue where only league commissioners can see invites, so this will return a 403. Need to look into a way to see if we can conditionally prefetch
      queryClient.ensureQueryData(
        GetLeagueInvitesQueryOptions({
          leagueId,
          includes: [LEAGUE_INVITE_INCLUDES.INVITEE],
        }),
      ),
    ]);
  },
  pendingComponent: MembersPageSkeleton,
  errorComponent: () => <RouteErrorBoundary />,
  pendingMs: 300,
});

function MembersComponent() {
  const { leagueId } = useParams({
    from: "/football/pick-em/$leagueId/members",
  });
  const { session } = Route.useRouteContext();
  const { data: members } = useSuspenseQuery(
    GetLeagueMembersQueryOptions(leagueId, [LEAGUE_MEMBER_INCLUDES.PROFILE]),
  );
  const { data: invites } = useSuspenseQuery(
    GetLeagueInvitesQueryOptions({
      leagueId,
      includes: [LEAGUE_INVITE_INCLUDES.INVITEE],
    }),
  );

  const currentUserMemberInfo = members.find(
    (member) => member.userId === session?.userId,
  );
  const isCommissioner =
    currentUserMemberInfo?.role === LEAGUE_MEMBER_ROLES.COMMISSIONER;
  const isOffSeason = true; // TODO: get from league season state

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Members ({members.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <MembersList
            members={members}
            session={session}
            isCommissioner={isCommissioner}
            isOffSeason={isOffSeason}
          />
        </CardContent>
      </Card>

      {isCommissioner && (
        <InviteManagement currentMembers={members} invites={invites} />
      )}
    </div>
  );
}
