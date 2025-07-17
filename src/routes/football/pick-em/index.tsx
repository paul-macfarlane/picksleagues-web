import { createFileRoute, redirect } from "@tanstack/react-router";
import { PickEmLeaguesList } from "@/features/leagues/components/pick-em-leagues-list";
import { GetMyLeaguesForLeagueTypeQueryOptions } from "@/features/leagues/leagues.api";
import { LEAGUE_TYPE_SLUGS } from "@/features/leagueTypes/leagueTypes.types";
import {
  PickEmLeaguesListErrorComponent,
  PickEmLeaguesListSkeleton,
} from "@/features/leagues/components/pick-em-leagues-list-states";

export const Route = createFileRoute("/football/pick-em/")({
  component: PickEmLeaguesList,
  beforeLoad: async ({ context }) => {
    if (!context.session) {
      throw redirect({ to: "/login" });
    }
  },
  loader: async ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(
      GetMyLeaguesForLeagueTypeQueryOptions(LEAGUE_TYPE_SLUGS.PICK_EM),
    );
  },
  pendingMs: 300,
  pendingComponent: PickEmLeaguesListSkeleton,
  errorComponent: PickEmLeaguesListErrorComponent,
});
