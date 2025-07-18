import { createFileRoute } from "@tanstack/react-router";
import { LeaguePicks } from "@/features/picks/components/league-picks";

export const Route = createFileRoute(
  "/_authenticated/football/pick-em/$leagueId/league-picks",
)({
  component: LeaguePicks,
});
