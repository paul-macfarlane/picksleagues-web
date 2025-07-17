import { createFileRoute, redirect } from "@tanstack/react-router";
import { MyPicks } from "@/features/picks/components/my-picks";

export const Route = createFileRoute("/football/pick-em/$leagueId/my-picks")({
  component: MyPicks,
  beforeLoad: async ({ context }) => {
    if (!context.session) {
      throw redirect({ to: "/login" });
    }
  },
});
