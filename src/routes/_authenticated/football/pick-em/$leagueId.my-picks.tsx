import { createFileRoute } from "@tanstack/react-router";
import { MyPicks } from "@/features/picks/components/my-picks";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";

const searchSchema = z.object({
  week: z.coerce.number().optional(),
});

export const Route = createFileRoute(
  "/_authenticated/football/pick-em/$leagueId/my-picks",
)({
  validateSearch: zodValidator(searchSchema),
  component: MyPicks,
});
