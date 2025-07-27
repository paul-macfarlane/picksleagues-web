import { createFileRoute } from "@tanstack/react-router";
import { LeaguePicks } from "@/features/picks/components/league-picks";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  GetCurrentPhaseForLeagueQueryOptions,
  GetPhaseForLeagueQueryOptions,
} from "@/features/phases/phases.api";
import {
  GetPicksForLeagueAndCurrentPhaseQueryOptions,
  GetPicksForLeagueAndPhaseQueryOptions,
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
  "/_authenticated/football/pick-em/$leagueId/league-picks",
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
        GetPicksForLeagueAndPhaseQueryOptions(
          leagueId,
          phaseId,
          Object.values(PICK_INCLUDES),
        ),
      );
    } else {
      // Fetch current phase and all picks for the league
      await queryClient.ensureQueryData(
        GetCurrentPhaseForLeagueQueryOptions(
          leagueId,
          Object.values(PHASE_INCLUDES),
        ),
      );
      await queryClient.ensureQueryData(
        GetPicksForLeagueAndCurrentPhaseQueryOptions(
          leagueId,
          Object.values(PICK_INCLUDES),
        ),
      );
    }

    return { leagueId, phaseId };
  },
  component: LeaguePicksPage,
});

function LeaguePicksPage() {
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

  const { data: allPicks } = useSuspenseQuery(
    phaseId
      ? GetPicksForLeagueAndPhaseQueryOptions(
          league.id,
          phaseId,
          Object.values(PICK_INCLUDES),
        )
      : GetPicksForLeagueAndCurrentPhaseQueryOptions(
          league.id,
          Object.values(PICK_INCLUDES),
        ),
  );

  const isATS = league.settings.pickType === PICK_EM_PICK_TYPES.SPREAD;

  return <LeaguePicks phase={phase} allPicks={allPicks || []} isATS={isATS} />;
}
