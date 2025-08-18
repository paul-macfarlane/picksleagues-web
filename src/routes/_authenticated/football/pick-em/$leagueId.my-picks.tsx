import { createFileRoute } from "@tanstack/react-router";
import { MyPicks } from "@/features/picks/components/my-picks";
import { z } from "zod";
import { AppError, NotFoundError } from "@/lib/errors";
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
import {
  PICK_EM_PICK_TYPES,
  type PopulatedPickEmLeagueResponse,
} from "@/features/leagues/leagues.types";
import { GetLeagueQueryOptions } from "@/features/leagues/leagues.api";
import { LEAGUE_PAGE_LAYOUT_LEAGUE_INCLUDES } from "./$leagueId";
import { GetMyStandingsForLeagueAndCurrentSeasonQueryOptions } from "@/features/standings/standings.api";
import { STANDINGS_INCLUDES } from "@/features/standings/standings.types";
import type { PopulatedPickEmStandingsResponse } from "@/features/standings/standings.types";

const searchSchema = z.object({
  phaseId: z.string().uuid("Invalid phase ID format").optional(),
});

const MY_PICKS_PICK_INCLUDES = Object.values(PICK_INCLUDES);
const MY_PICKS_PHASE_INCLUDES_PICKS_NOT_MADE = Object.values(PHASE_INCLUDES);
const MY_PICKS_PHASE_INCLUDES_PICKS_MADE =
  MY_PICKS_PHASE_INCLUDES_PICKS_NOT_MADE.filter(
    (include) => include !== PHASE_INCLUDES.EVENTS_EXCLUDE_STARTED,
  );

export const Route = createFileRoute(
  "/_authenticated/football/pick-em/$leagueId/my-picks",
)({
  validateSearch: (search) => {
    const parsed = searchSchema.safeParse(search);
    if (!parsed.success) {
      throw new AppError("Invalid phase ID format", 400, false, "Bad Url");
    }
    return parsed.data;
  },
  loaderDeps: ({ search: { phaseId } }) => ({ phaseId }),
  loader: async ({ context: { queryClient }, params, deps }) => {
    const { leagueId } = params;
    const { phaseId } = deps;

    await queryClient.ensureQueryData(
      GetLeagueQueryOptions(leagueId, LEAGUE_PAGE_LAYOUT_LEAGUE_INCLUDES),
    );

    await queryClient.ensureQueryData(
      GetMyStandingsForLeagueAndCurrentSeasonQueryOptions<PopulatedPickEmStandingsResponse>(
        leagueId,
        [STANDINGS_INCLUDES.PROFILE],
      ),
    );

    try {
      // If phaseId is specified, fetch that specific phase, otherwise fetch current phase
      if (phaseId) {
        const myPicks = await queryClient.ensureQueryData(
          GetMyPicksForLeagueAndPhaseQueryOptions(
            leagueId,
            phaseId,
            MY_PICKS_PICK_INCLUDES,
          ),
        );

        await queryClient.ensureQueryData(
          GetPhaseForLeagueQueryOptions(
            leagueId,
            phaseId,
            myPicks.length > 0
              ? MY_PICKS_PHASE_INCLUDES_PICKS_MADE
              : MY_PICKS_PHASE_INCLUDES_PICKS_NOT_MADE,
          ),
        );
      } else {
        const myPicks = await queryClient.ensureQueryData(
          GetMyPicksForLeagueAndCurrentPhaseQueryOptions(
            leagueId,
            MY_PICKS_PICK_INCLUDES,
          ),
        );
        // Fetch current phase and user picks
        await queryClient.ensureQueryData(
          GetCurrentPhaseForLeagueQueryOptions(
            leagueId,
            myPicks.length > 0
              ? MY_PICKS_PHASE_INCLUDES_PICKS_MADE
              : MY_PICKS_PHASE_INCLUDES_PICKS_NOT_MADE,
          ),
        );
      }
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundError(
          phaseId
            ? `Phase ${phaseId} not found`
            : "No current phase found for this league",
          "Phase Not Found",
        );
      }
      throw error;
    }

    return { leagueId, phaseId };
  },
  component: MyPicksPage,
});

function MyPicksPage() {
  const { data: leagueData } = useSuspenseQuery(
    GetLeagueQueryOptions(
      Route.useParams().leagueId,
      LEAGUE_PAGE_LAYOUT_LEAGUE_INCLUDES,
    ),
  );
  const league = leagueData as PopulatedPickEmLeagueResponse;
  const { phaseId } = Route.useSearch();

  const { data: userPicks } = useSuspenseQuery(
    phaseId
      ? GetMyPicksForLeagueAndPhaseQueryOptions(
          league.id,
          phaseId,
          MY_PICKS_PICK_INCLUDES,
        )
      : GetMyPicksForLeagueAndCurrentPhaseQueryOptions(
          league.id,
          MY_PICKS_PICK_INCLUDES,
        ),
  );

  // Use the appropriate query based on whether phaseId is specified
  const { data: phase } = useSuspenseQuery(
    phaseId
      ? GetPhaseForLeagueQueryOptions(
          league.id,
          phaseId,
          userPicks.length > 0
            ? MY_PICKS_PHASE_INCLUDES_PICKS_MADE
            : MY_PICKS_PHASE_INCLUDES_PICKS_NOT_MADE,
        )
      : GetCurrentPhaseForLeagueQueryOptions(
          league.id,
          userPicks.length > 0
            ? MY_PICKS_PHASE_INCLUDES_PICKS_MADE
            : MY_PICKS_PHASE_INCLUDES_PICKS_NOT_MADE,
        ),
  );

  const { data: standings } = useSuspenseQuery(
    GetMyStandingsForLeagueAndCurrentSeasonQueryOptions<PopulatedPickEmStandingsResponse>(
      league.id,
      [STANDINGS_INCLUDES.PROFILE],
    ),
  );

  const isATS = league.settings.pickType === PICK_EM_PICK_TYPES.SPREAD;

  return (
    <MyPicks
      phase={phase}
      userPicks={userPicks || []}
      picksPerPhase={league.settings.picksPerPhase}
      standings={standings}
      isATS={isATS}
    />
  );
}
