import { createFileRoute } from "@tanstack/react-router";
import { LeagueSettingsForm } from "@/features/leagues/components/league-settings-form";
import {
  LEAGUE_INCLUDES,
  type PopulatedPickEmLeagueResponse,
} from "@/features/leagues/leagues.types";
import {
  canEditAllSettings,
  canEditSettings,
} from "@/features/leagues/leagues.utils";
import { GetPhaseTemplatesByLeagueTypeQueryOptions } from "@/features/phaseTemplates/phaseTemplates.api";
import { LEAGUE_TYPE_SLUGS } from "@/features/leagueTypes/leagueTypes.types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { GetLeagueQueryOptions } from "@/features/leagues/leagues.api";

const LEAGUE_INCLUDES_FOR_SETTINGS = [
  LEAGUE_INCLUDES.MEMBERS,
  LEAGUE_INCLUDES.IS_IN_SEASON,
  LEAGUE_INCLUDES.LEAGUE_TYPE,
  LEAGUE_INCLUDES.START_PHASE_TEMPLATE,
  LEAGUE_INCLUDES.END_PHASE_TEMPLATE,
];

export const Route = createFileRoute(
  "/_authenticated/football/pick-em/$leagueId/settings",
)({
  component: SettingsComponent,
  loader: async ({ context: { queryClient }, params: { leagueId } }) => {
    const league = await queryClient.ensureQueryData(
      GetLeagueQueryOptions(leagueId, LEAGUE_INCLUDES_FOR_SETTINGS),
    );

    // Only fetch all phase templates if the league is not in season
    // If in season, we'll use the templates set on the league itself
    await queryClient.ensureQueryData(
      GetPhaseTemplatesByLeagueTypeQueryOptions({
        typeIdOrSlug: LEAGUE_TYPE_SLUGS.PICK_EM,
        excludeStarted: !league.isInSeason,
        enabled: !league.isInSeason,
      }),
    );
  },
});

function SettingsComponent() {
  const { session } = Route.useRouteContext();
  const { data: leagueData } = useSuspenseQuery(
    GetLeagueQueryOptions(
      Route.useParams().leagueId,
      LEAGUE_INCLUDES_FOR_SETTINGS,
    ),
  );
  const league = leagueData as PopulatedPickEmLeagueResponse;

  // Only fetch phase templates if not in season
  const { data: phaseTemplates } = useSuspenseQuery(
    GetPhaseTemplatesByLeagueTypeQueryOptions({
      typeIdOrSlug: LEAGUE_TYPE_SLUGS.PICK_EM,
      excludeStarted: !league.isInSeason,
      enabled: !league.isInSeason,
    }),
  );

  const userCanEditSettings = canEditSettings(league, session!.userId);
  const userCanEditAllSettings = canEditAllSettings(league, session!.userId);

  // Determine which phase templates to use
  const availablePhaseTemplates = league.isInSeason
    ? [league.startPhaseTemplate, league.endPhaseTemplate].filter(
        (template): template is NonNullable<typeof template> =>
          Boolean(template),
      )
    : phaseTemplates || [];

  return (
    <LeagueSettingsForm
      league={league as PopulatedPickEmLeagueResponse}
      phaseTemplates={availablePhaseTemplates}
      canEditSettings={userCanEditSettings}
      canEditAllSettings={userCanEditAllSettings}
    />
  );
}
