import { createFileRoute, redirect } from "@tanstack/react-router";
import { LeagueSettingsForm } from "@/features/leagues/components/league-settings-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { GetLeagueMembersQueryOptions } from "@/features/leagueMembers/leagueMembers.api";
import { LEAGUE_MEMBER_ROLES } from "@/features/leagueMembers/leagueMembers.types";
import { Route as LeagueLayoutRoute } from "./$leagueId";

export const Route = createFileRoute("/football/pick-em/$leagueId/settings")({
  component: SettingsComponent,
  beforeLoad: async ({ context }) => {
    if (!context.session) {
      throw redirect({ to: "/login" });
    }
  },
  loader: async ({ context: { queryClient }, params: { leagueId } }) => {
    await queryClient.ensureQueryData(GetLeagueMembersQueryOptions(leagueId));
  },
});

function SettingsComponent() {
  const { leagueId } = Route.useParams();
  const { session } = Route.useRouteContext();
  const league = LeagueLayoutRoute.useLoaderData();
  const { data: members } = useSuspenseQuery(
    GetLeagueMembersQueryOptions(leagueId),
  );

  // todo could add an endpoint to get a user's role in a league, as opposed to fetching all members
  const currentUserMemberInfo = members.find(
    (member) => member.userId === session?.userId,
  );
  const isCommissioner =
    currentUserMemberInfo?.role === LEAGUE_MEMBER_ROLES.COMMISSIONER;
  const isOffSeason = true; // TODO: get from league season state

  return (
    <LeagueSettingsForm
      league={league}
      isCommissioner={isCommissioner}
      isOffSeason={isOffSeason}
    />
  );
}
