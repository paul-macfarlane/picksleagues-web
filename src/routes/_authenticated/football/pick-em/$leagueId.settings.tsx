import { createFileRoute } from "@tanstack/react-router";
import { LeagueSettingsForm } from "@/features/leagues/components/league-settings-form";
import { Route as LeagueLayoutRoute } from "./$leagueId";
import { type PopulatedPickEmLeagueResponse } from "@/features/leagues/leagues.types";
import {
  canEditAllSettings,
  canEditSettings,
} from "@/features/leagues/leagues.utils";
import { GetPhaseTemplatesByLeagueTypeQueryOptions } from "@/features/phaseTemplates/phaseTemplates.api";
import { LEAGUE_TYPE_SLUGS } from "@/features/leagueTypes/leagueTypes.types";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute(
  "/_authenticated/football/pick-em/$leagueId/settings",
)({
  component: SettingsComponent,
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(
      GetPhaseTemplatesByLeagueTypeQueryOptions(LEAGUE_TYPE_SLUGS.PICK_EM),
    );
  },
});

function SettingsComponent() {
  const { session } = Route.useRouteContext();
  const league = LeagueLayoutRoute.useLoaderData();
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
