import { createFileRoute, ErrorComponent } from "@tanstack/react-router";
import { GetLeagueQueryOptions } from "@/features/leagues/leagues.api";
import { LeagueLayout } from "@/features/leagues/components/league-layout";
import { LeagueLayoutPendingComponent } from "@/features/leagues/components/league-layout-skeleton";

export const Route = createFileRoute(
  "/_authenticated/football/pick-em/$leagueId",
)({
  component: LeagueLayout,
  errorComponent: ErrorComponent,
  pendingComponent: LeagueLayoutPendingComponent,
  pendingMs: 300,
  loader: ({ context: { queryClient }, params: { leagueId } }) =>
    queryClient.ensureQueryData(GetLeagueQueryOptions(leagueId)),
});
