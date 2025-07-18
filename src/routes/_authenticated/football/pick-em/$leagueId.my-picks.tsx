import { createFileRoute } from "@tanstack/react-router";
import { MyPicks } from "@/features/picks/components/my-picks";

export const Route = createFileRoute(
  "/_authenticated/football/pick-em/$leagueId/my-picks",
)({
  component: MyPicks,
});
