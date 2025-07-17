import {
  createFileRoute,
  ErrorComponent,
  redirect,
} from "@tanstack/react-router";
import { GetLeagueQueryOptions } from "@/features/leagues/leagues.api";
import { LeagueLayout } from "@/features/leagues/components/league-layout";
import { LeagueLayoutPendingComponent } from "@/features/leagues/components/league-layout-skeleton";

export const Route = createFileRoute("/football/pick-em/$leagueId")({
  component: LeagueLayout,
  errorComponent: ErrorComponent,
  pendingComponent: LeagueLayoutPendingComponent,
  pendingMs: 200, // make sure page doesn't completlely block for longer requests
  beforeLoad: async ({ context }) => {
    if (!context.session) {
      throw redirect({ to: "/login" });
    }
  },
  loader: ({ context: { queryClient }, params: { leagueId } }) =>
    queryClient.ensureQueryData(GetLeagueQueryOptions(leagueId)),
});
