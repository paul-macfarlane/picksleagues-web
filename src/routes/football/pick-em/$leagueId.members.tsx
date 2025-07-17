import { createFileRoute, redirect, useParams } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LEAGUE_MEMBER_ROLES } from "@/features/leagueMembers/leagueMembers.types";
import { GetLeagueMembersQueryOptions } from "@/features/leagueMembers/leagueMembers.api";
import { MembersList } from "@/features/leagueMembers/components/members-list";
import { InviteManagement } from "@/features/leagueInvites/components/invite-management";

export const Route = createFileRoute("/football/pick-em/$leagueId/members")({
  component: MembersComponent,
  beforeLoad: async ({ context }) => {
    if (!context.session) {
      throw redirect({ to: "/login" });
    }
  },
  loader: ({ context: { queryClient }, params: { leagueId } }) => {
    queryClient.ensureQueryData(GetLeagueMembersQueryOptions(leagueId));
  },
});

function MembersComponent() {
  const { leagueId } = useParams({
    from: "/football/pick-em/$leagueId/members",
  });
  const { session } = Route.useRouteContext();
  const { data: members } = useSuspenseQuery(
    GetLeagueMembersQueryOptions(leagueId),
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

      {isCommissioner && <InviteManagement currentMembers={members} />}
    </div>
  );
}
