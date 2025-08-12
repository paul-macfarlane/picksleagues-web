import { createFileRoute } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GetPhaseTemplatesByLeagueTypeQueryOptions } from "@/features/phaseTemplates/phaseTemplates.api";
import { LEAGUE_TYPE_SLUGS } from "@/features/leagueTypes/leagueTypes.types";
import { CreateLeagueForm } from "@/features/leagues/components/create-league-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CreateLeaguePageSkeleton } from "@/features/leagues/components/create-league-page-states";
import { RouteErrorBoundary } from "@/components/route-error-boundary";

export const Route = createFileRoute("/_authenticated/football/pick-em/create")(
  {
    component: RouteComponent,
    loader: async ({ context: { queryClient } }) => {
      await queryClient.ensureQueryData(
        GetPhaseTemplatesByLeagueTypeQueryOptions({
          typeIdOrSlug: LEAGUE_TYPE_SLUGS.PICK_EM,
          excludeStarted: true,
        }),
      );
    },
    pendingComponent: CreateLeaguePageSkeleton,
    errorComponent: () => <RouteErrorBoundary />,
    pendingMs: 300,
  },
);

function RouteComponent() {
  const { data: phaseTemplates } = useSuspenseQuery(
    GetPhaseTemplatesByLeagueTypeQueryOptions({
      typeIdOrSlug: LEAGUE_TYPE_SLUGS.PICK_EM,
      excludeStarted: true,
    }),
  );

  return (
    <div className="flex justify-center items-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Create Pick'em League</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateLeagueForm phaseTemplates={phaseTemplates} />
        </CardContent>
      </Card>
    </div>
  );
}
