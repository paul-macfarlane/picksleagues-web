import { createFileRoute, redirect } from "@tanstack/react-router";
import { StandingsTable } from "@/features/leagues/components/standings-table";

export const Route = createFileRoute("/football/pick-em/$leagueId/")({
  component: StandingsTable,
  beforeLoad: async ({ context }) => {
    if (!context.session) {
      throw redirect({ to: "/login" });
    }
  },
});
