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

export const Route = createFileRoute(
  "/_authenticated/football/pick-em/$leagueId/settings",
)({
  component: SettingsComponent,
  loader: async ({ context: { queryClient }, params: { leagueId } }) => {
    await queryClient.ensureQueryData(
      GetLeagueQueryOptions(leagueId, [
        LEAGUE_INCLUDES.MEMBERS,
        LEAGUE_INCLUDES.IS_IN_SEASON,
        LEAGUE_INCLUDES.LEAGUE_TYPE,
      ]),
    );
    await queryClient.ensureQueryData(
      GetPhaseTemplatesByLeagueTypeQueryOptions(LEAGUE_TYPE_SLUGS.PICK_EM),
    );
  },
});

function SettingsComponent() {
  const { session } = Route.useRouteContext();
  const { data: leagueData } = useSuspenseQuery(
    GetLeagueQueryOptions(Route.useParams().leagueId, [
      LEAGUE_INCLUDES.MEMBERS,
      LEAGUE_INCLUDES.IS_IN_SEASON,
      LEAGUE_INCLUDES.LEAGUE_TYPE,
    ]),
  );
  const league = leagueData as PopulatedPickEmLeagueResponse;
  const { data: phaseTemplates } = useSuspenseQuery(
    GetPhaseTemplatesByLeagueTypeQueryOptions(LEAGUE_TYPE_SLUGS.PICK_EM),
  );
  const userCanEditSettings = canEditSettings(league, session!.userId);
  const userCanEditAllSettings = canEditAllSettings(league, session!.userId);

  return (
    <LeagueSettingsForm
      league={league as PopulatedPickEmLeagueResponse}
      phaseTemplates={phaseTemplates}
      canEditSettings={userCanEditSettings}
      canEditAllSettings={userCanEditAllSettings}
    />
  );
}
