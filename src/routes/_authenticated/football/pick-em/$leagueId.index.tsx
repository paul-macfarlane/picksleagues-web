import { createFileRoute } from "@tanstack/react-router";
import { StandingsTable } from "@/features/leagues/components/standings-table";

export const Route = createFileRoute(
  "/_authenticated/football/pick-em/$leagueId/",
)({
  component: StandingsTable,
});
