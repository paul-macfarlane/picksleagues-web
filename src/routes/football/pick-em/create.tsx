import { createFileRoute, redirect } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useGetPhaseTemplatesForLeagueType } from "@/features/phaseTemplates/phaseTemplates.api";
import { LEAGUE_TYPE_SLUGS } from "@/features/leagueTypes/leagueTypes.types";
import { CreateLeagueForm } from "@/features/leagues/components/create-league-form";

export const Route = createFileRoute("/football/pick-em/create")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.session) {
      throw redirect({ to: "/login" });
    }
  },
});

function RouteComponent() {
  const {
    data: phaseTemplates,
    isLoading: isLoadingPhaseTemplates,
    error: phaseTemplatesError,
  } = useGetPhaseTemplatesForLeagueType(LEAGUE_TYPE_SLUGS.PICK_EM);

  return (
    <div className="flex justify-center items-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Create Pick'em League</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateLeagueForm
            phaseTemplates={phaseTemplates}
            isLoadingPhaseTemplates={isLoadingPhaseTemplates}
            phaseTemplatesError={phaseTemplatesError}
          />
        </CardContent>
      </Card>
    </div>
  );
}
