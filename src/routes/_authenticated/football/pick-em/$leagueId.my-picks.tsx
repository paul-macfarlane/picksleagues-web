import { createFileRoute } from "@tanstack/react-router";
import { MyPicks } from "@/features/picks/components/my-picks";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  GetCurrentPhaseForLeagueQueryOptions,
  GetPhaseForLeagueQueryOptions,
} from "@/features/phases/phases.api";
import {
  GetMyPicksForLeagueAndCurrentPhaseQueryOptions,
  GetMyPicksForLeagueAndPhaseQueryOptions,
} from "@/features/picks/picks.api";
import { PHASE_INCLUDES } from "@/features/phases/phases.types";
import { PICK_INCLUDES } from "@/features/picks/picks.types";
import { Route as LeagueLayoutRoute } from "./$leagueId";
import type { PopulatedPickEmLeagueResponse } from "@/features/leagues/leagues.types";
import { PICK_EM_PICK_TYPES } from "@/features/leagues/leagues.types";

const searchSchema = z.object({
  phaseId: z.string().optional(),
});

export const Route = createFileRoute(
  "/_authenticated/football/pick-em/$leagueId/my-picks",
)({
  validateSearch: zodValidator(searchSchema),
  loaderDeps: ({ search: { phaseId } }) => ({ phaseId }),
  loader: async ({ context: { queryClient }, params, deps }) => {
    const { leagueId } = params;
    const { phaseId } = deps;

    // If phaseId is specified, fetch that specific phase, otherwise fetch current phase
    if (phaseId) {
      await queryClient.ensureQueryData(
        GetPhaseForLeagueQueryOptions(
          leagueId,
          phaseId,
          Object.values(PHASE_INCLUDES),
        ),
      );
      await queryClient.ensureQueryData(
        GetMyPicksForLeagueAndPhaseQueryOptions(
          leagueId,
          phaseId,
          Object.values(PICK_INCLUDES),
        ),
      );
    } else {
      // Fetch current phase and user picks
      await queryClient.ensureQueryData(
        GetCurrentPhaseForLeagueQueryOptions(
          leagueId,
          Object.values(PHASE_INCLUDES),
        ),
      );
      await queryClient.ensureQueryData(
        GetMyPicksForLeagueAndCurrentPhaseQueryOptions(
          leagueId,
          Object.values(PICK_INCLUDES),
        ),
      );
    }

    return { leagueId, phaseId };
  },
  component: MyPicksPage,
});

function MyPicksPage() {
  const league =
    LeagueLayoutRoute.useLoaderData() as PopulatedPickEmLeagueResponse;
  const { phaseId } = Route.useSearch();

  // Use the appropriate query based on whether phaseId is specified
  const { data: phase } = useSuspenseQuery(
    phaseId
      ? GetPhaseForLeagueQueryOptions(
          league.id,
          phaseId,
          Object.values(PHASE_INCLUDES),
        )
      : GetCurrentPhaseForLeagueQueryOptions(
          league.id,
          Object.values(PHASE_INCLUDES),
        ),
  );

  const { data: userPicks } = useSuspenseQuery(
    phaseId
      ? GetMyPicksForLeagueAndPhaseQueryOptions(
          league.id,
          phaseId,
          Object.values(PICK_INCLUDES),
        )
      : GetMyPicksForLeagueAndCurrentPhaseQueryOptions(
          league.id,
          Object.values(PICK_INCLUDES),
        ),
  );

  const isATS = league.settings.pickType === PICK_EM_PICK_TYPES.SPREAD;

  return (
    <MyPicks
      phase={phase}
      userPicks={userPicks || []}
      picksPerPhase={league.settings.picksPerPhase}
      isATS={isATS}
    />
  );
}
