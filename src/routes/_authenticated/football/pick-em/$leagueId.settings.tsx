import { createFileRoute } from "@tanstack/react-router";
import { LeagueSettingsForm } from "@/features/leagues/components/league-settings-form";
import { Route as LeagueLayoutRoute } from "./$leagueId";
import { type PopulatedPickEmLeagueResponse } from "@/features/leagues/leagues.types";
import {
  canEditSettings,
  canEditAllSettings,
} from "@/features/leagues/leagues.utils";

export const Route = createFileRoute(
  "/_authenticated/football/pick-em/$leagueId/settings",
)({
  component: SettingsComponent,
});

function SettingsComponent() {
  const { session } = Route.useRouteContext();
  const league = LeagueLayoutRoute.useLoaderData();

  return (
    <LeagueSettingsForm
      league={league as PopulatedPickEmLeagueResponse}
      canEdit={canEditSettings(league, session!.userId) !== undefined}
      canEditAllSettings={canEditAllSettings(league, session!.userId)}
    />
  );
}
