import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LEAGUE_TYPE_SLUGS,
  myLeaguesForLeagueTypeQueryOptions,
} from "@/api/leagueTypes";
import { useQuery } from "@tanstack/react-query";
import {
  PICK_EM_PICK_TYPE_LABELS,
  type PickEmLeagueResponse,
} from "@/api/leagues";
import { CheckSquare, AlertCircle, Trophy } from "lucide-react";
import {
  LeagueCard,
  LeagueCardSkeleton,
} from "@/components/league/league-card";

export const Route = createFileRoute("/football/pick-em/")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.session) {
      throw redirect({ to: "/login" });
    }
  },
});

function RouteComponent() {
  const {
    data: leagues,
    isLoading: leaguesIsLoading,
    error: leaguesError,
  } = useQuery(
    myLeaguesForLeagueTypeQueryOptions<PickEmLeagueResponse>(
      LEAGUE_TYPE_SLUGS.PICK_EM,
    ),
  );

  return (
    <div className="container py-4 md:py-8 space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-8 w-8 md:h-10 md:w-10 text-primary" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Pick'em Leagues
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Manage your pick'em leagues or create a new one
            </p>
          </div>
        </div>
        <Link to="/football/pick-em/create">
          <Button size="lg" className="w-full sm:w-auto">
            Create League
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {leaguesIsLoading ? (
          <>
            <LeagueCardSkeleton />
            <LeagueCardSkeleton />
            <LeagueCardSkeleton />
          </>
        ) : leaguesError ? (
          <Card className="col-span-full">
            <CardHeader className="flex-row gap-2 items-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <div>
                <CardTitle>Unable to Load Leagues</CardTitle>
                <CardDescription>
                  {leaguesError instanceof Error
                    ? leaguesError.message
                    : "Please try again later"}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        ) : leagues?.length === 0 ? (
          <Card className="col-span-full">
            <CardHeader className="flex-row gap-2 items-center">
              <Trophy className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Welcome to Pick'em Leagues!</CardTitle>
                <CardDescription>
                  Create your first league to get started with making picks
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        ) : (
          leagues?.map((league) => (
            <Link
              key={league.id}
              to="/football/pick-em/$leagueId"
              params={{ leagueId: league.id }}
              className="transition-transform hover:scale-[1.02]"
            >
              <LeagueCard
                name={league.name}
                imageUrl={league.image}
                description={PICK_EM_PICK_TYPE_LABELS[league.settings.pickType]}
                content={
                  <p className="text-sm text-muted-foreground">
                    {league.settings.picksPerPhase} pick
                    {league.settings.picksPerPhase === 1 ? "" : "s"} per week
                  </p>
                }
              />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
