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
import type { PopulatedPickEmLeagueResponse } from "@/features/leagues/leagues.types";
import { PICK_EM_PICK_TYPES } from "@/features/leagues/leagues.types";
import { GetLeagueQueryOptions } from "@/features/leagues/leagues.api";
import { LEAGUE_PAGE_LAYOUT_LEAGUE_INCLUDES } from "./$leagueId";
import { GetStandingsForLeagueAndCurrentSeasonQueryOptions } from "@/features/standings/standings.api";
import { STANDINGS_INCLUDES } from "@/features/standings/standings.types";
import type { PopulatedPickEmStandingsResponse } from "@/features/standings/standings.types";

const searchSchema = z.object({
  phaseId: z.string().optional(),
});

const LEAGUE_PICKS_PHASE_INCLUDES = [
  PHASE_INCLUDES.EVENTS,
  PHASE_INCLUDES.PREVIOUS_PHASE,
  PHASE_INCLUDES.NEXT_PHASE,
  PHASE_INCLUDES.PHASE_TEMPLATE,
];

const LEAGUE_PICKS_PICK_INCLUDES = Object.values(PICK_INCLUDES);

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
          LEAGUE_PICKS_PHASE_INCLUDES,
        ),
      );
      await queryClient.ensureQueryData(
        GetPicksForLeagueAndPhaseQueryOptions(
          leagueId,
          phaseId,
          LEAGUE_PICKS_PICK_INCLUDES,
        ),
      );
    } else {
      // Fetch current phase and all picks for the league
      await queryClient.ensureQueryData(
        GetCurrentPhaseForLeagueQueryOptions(
          leagueId,
          LEAGUE_PICKS_PHASE_INCLUDES,
        ),
      );
      await queryClient.ensureQueryData(
        GetPicksForLeagueAndCurrentPhaseQueryOptions(
          leagueId,
          LEAGUE_PICKS_PICK_INCLUDES,
        ),
      );
    }

    await queryClient.ensureQueryData(
      GetStandingsForLeagueAndCurrentSeasonQueryOptions<PopulatedPickEmStandingsResponse>(
        leagueId,
        [STANDINGS_INCLUDES.PROFILE],
      ),
    );

    return { leagueId, phaseId };
  },
  component: LeaguePicksPage,
});

function LeaguePicksPage() {
  const { data: leagueData } = useSuspenseQuery(
    GetLeagueQueryOptions(
      Route.useParams().leagueId,
      LEAGUE_PAGE_LAYOUT_LEAGUE_INCLUDES,
    ),
  );
  const league = leagueData as PopulatedPickEmLeagueResponse;

  const { phaseId } = Route.useSearch();

  // Use the appropriate query based on whether phaseId is specified
  const { data: phase } = useSuspenseQuery(
    phaseId
      ? GetPhaseForLeagueQueryOptions(
          league.id,
          phaseId,
          LEAGUE_PICKS_PHASE_INCLUDES,
        )
      : GetCurrentPhaseForLeagueQueryOptions(
          league.id,
          LEAGUE_PICKS_PHASE_INCLUDES,
        ),
  );

  const { data: allPicks } = useSuspenseQuery(
    phaseId
      ? GetPicksForLeagueAndPhaseQueryOptions(
          league.id,
          phaseId,
          LEAGUE_PICKS_PICK_INCLUDES,
        )
      : GetPicksForLeagueAndCurrentPhaseQueryOptions(
          league.id,
          LEAGUE_PICKS_PICK_INCLUDES,
        ),
  );

  const { data: standings } = useSuspenseQuery(
    GetStandingsForLeagueAndCurrentSeasonQueryOptions<PopulatedPickEmStandingsResponse>(
      league.id,
      [STANDINGS_INCLUDES.PROFILE],
    ),
  );

  const isATS = league.settings.pickType === PICK_EM_PICK_TYPES.SPREAD;

  return (
    <LeaguePicks
      phase={phase}
      allPicks={allPicks || []}
      standings={standings || []}
      isATS={isATS}
    />
  );
}
