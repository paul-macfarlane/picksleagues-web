import { createFileRoute } from "@tanstack/react-router";
import { GetLeagueQueryOptions } from "@/features/leagues/leagues.api";
import { LeagueLayout } from "@/features/leagues/components/league-layout";
import { LeagueLayoutPendingComponent } from "@/features/leagues/components/league-layout-skeleton";
import { RouteErrorBoundary } from "@/components/route-error-boundary";
import { LEAGUE_INCLUDES } from "@/features/leagues/leagues.types";
import { z } from "zod";
import { AppError, NotFoundError } from "@/lib/errors";

export const LEAGUE_PAGE_LAYOUT_LEAGUE_INCLUDES = [
  LEAGUE_INCLUDES.MEMBERS,
  LEAGUE_INCLUDES.IS_IN_SEASON,
  LEAGUE_INCLUDES.LEAGUE_TYPE,
];

export const Route = createFileRoute(
  "/_authenticated/football/pick-em/$leagueId",
)({
  component: LeagueLayout,
  errorComponent: RouteErrorBoundary,
  pendingComponent: LeagueLayoutPendingComponent,
  pendingMs: 300,
  params: {
    parse: (params: Record<string, string>) => {
      const parsed = z
        .object({
          leagueId: z.string().uuid("Invalid league ID format"),
        })
        .safeParse(params);

      if (!parsed.success) {
        throw new AppError("Invalid league ID format", 400, false, "Bad Url");
      }

      return parsed.data;
    },
  },
  loader: async ({ context: { queryClient }, params: { leagueId } }) => {
    try {
      return await queryClient.ensureQueryData(
        GetLeagueQueryOptions(leagueId, LEAGUE_PAGE_LAYOUT_LEAGUE_INCLUDES),
      );
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundError("League not found");
      }
      throw error;
    }
  },
});
