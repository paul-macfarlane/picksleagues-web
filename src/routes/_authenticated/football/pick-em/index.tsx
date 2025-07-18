import { createFileRoute } from "@tanstack/react-router";
import { PickEmLeaguesList } from "@/features/leagues/components/pick-em-leagues-list";
import { GetMyLeaguesForLeagueTypeQueryOptions } from "@/features/leagues/leagues.api";
import { LEAGUE_TYPE_SLUGS } from "@/features/leagueTypes/leagueTypes.types";
import { PickEmLeaguesListSkeleton } from "@/features/leagues/components/pick-em-leagues-list-states";
import { RouteErrorBoundary } from "@/components/route-error-boundary";

export const Route = createFileRoute("/_authenticated/football/pick-em/")({
  component: PickEmLeaguesList,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(
      GetMyLeaguesForLeagueTypeQueryOptions(LEAGUE_TYPE_SLUGS.PICK_EM),
    );
  },
  pendingComponent: PickEmLeaguesListSkeleton,
  errorComponent: () => <RouteErrorBoundary />,
  pendingMs: 300,
});
