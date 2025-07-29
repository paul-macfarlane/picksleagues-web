import { createFileRoute } from "@tanstack/react-router";
import { GetStandingsForLeagueAndCurrentSeasonQueryOptions } from "@/features/standings/standings.api";
import { STANDINGS_INCLUDES } from "@/features/standings/standings.types";
import { StandingsTable } from "@/features/leagues/components/standings-table";

export const Route = createFileRoute(
  "/_authenticated/football/pick-em/$leagueId/",
)({
  component: StandingsTable,
  loader: ({ context: { queryClient }, params: { leagueId } }) =>
    queryClient.ensureQueryData(
      GetStandingsForLeagueAndCurrentSeasonQueryOptions(leagueId, [
        STANDINGS_INCLUDES.PROFILE,
      ]),
    ),
});
