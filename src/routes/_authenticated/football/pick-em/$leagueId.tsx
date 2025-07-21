import { createFileRoute } from "@tanstack/react-router";
import { GetLeagueQueryOptions } from "@/features/leagues/leagues.api";
import { LeagueLayout } from "@/features/leagues/components/league-layout";
import { LeagueLayoutPendingComponent } from "@/features/leagues/components/league-layout-skeleton";
import { RouteErrorBoundary } from "@/components/route-error-boundary";
import { LEAGUE_INCLUDES } from "@/features/leagues/leagues.types";

export const Route = createFileRoute(
  "/_authenticated/football/pick-em/$leagueId",
)({
  component: LeagueLayout,
  errorComponent: RouteErrorBoundary,
  pendingComponent: LeagueLayoutPendingComponent,
  pendingMs: 300,
  loader: ({ context: { queryClient }, params: { leagueId } }) =>
    queryClient.ensureQueryData(
      GetLeagueQueryOptions(leagueId, [
        LEAGUE_INCLUDES.MEMBERS,
        LEAGUE_INCLUDES.IS_IN_SEASON,
        LEAGUE_INCLUDES.LEAGUE_TYPE,
      ]),
    ),
});
