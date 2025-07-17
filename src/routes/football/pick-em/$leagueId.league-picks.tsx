import { createFileRoute, redirect } from "@tanstack/react-router";
import { LeaguePicks } from "@/features/picks/components/league-picks";

export const Route = createFileRoute(
  "/football/pick-em/$leagueId/league-picks",
)({
  component: LeaguePicks,
  beforeLoad: async ({ context }) => {
    if (!context.session) {
      throw redirect({ to: "/login" });
    }
  },
});
