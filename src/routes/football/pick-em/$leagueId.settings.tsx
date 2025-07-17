import { createFileRoute, redirect } from "@tanstack/react-router";
import { LeagueSettingsForm } from "@/features/leagues/components/league-settings-form";

export const Route = createFileRoute("/football/pick-em/$leagueId/settings")({
  component: SettingsComponent,
  beforeLoad: async ({ context }) => {
    if (!context.session) {
      throw redirect({ to: "/login" });
    }
  },
});

function SettingsComponent() {
  // TODO: Refactor to get isCommissioner and seasonState from API
  const isCommissioner = false;
  const isOffSeason = false;

  return (
    <LeagueSettingsForm
      isCommissioner={isCommissioner}
      isOffSeason={isOffSeason}
    />
  );
}
