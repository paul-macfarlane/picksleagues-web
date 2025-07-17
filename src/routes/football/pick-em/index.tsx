import { createFileRoute, redirect } from "@tanstack/react-router";
import { PickEmLeaguesList } from "@/features/leagues/components/pick-em-leagues-list";

export const Route = createFileRoute("/football/pick-em/")({
  component: PickEmLeaguesList,
  beforeLoad: async ({ context }) => {
    if (!context.session) {
      throw redirect({ to: "/login" });
    }
  },
});
