import { createFileRoute } from "@tanstack/react-router";
import { LeaguePicks } from "@/features/picks/components/league-picks";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";

const searchSchema = z.object({
  week: z.coerce.number().optional(),
});

export const Route = createFileRoute(
  "/_authenticated/football/pick-em/$leagueId/league-picks",
)({
  validateSearch: zodValidator(searchSchema),
  component: LeaguePicks,
});
