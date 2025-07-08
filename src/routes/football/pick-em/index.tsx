import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckSquare, AlertCircle, Trophy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/football/pick-em/")({
  component: RouteComponent,
});

function LeagueCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <Skeleton className="h-4 w-32 mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-24" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-4 w-36" />
      </CardFooter>
    </Card>
  );
}

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
          <CheckSquare className="h-8 w-8 md:h-10 md:w-10" />
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
              <Trophy className="h-8 w-8" />
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
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{league.name}</CardTitle>
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={league.image ?? undefined}
                        alt={league.name}
                      />
                      <AvatarFallback>
                        <Trophy className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardDescription>
                    {PICK_EM_PICK_TYPE_LABELS[league.settings.pickType]}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {league.settings.picksPerPhase} pick
                    {league.settings.picksPerPhase === 1 ? "" : "s"} per week
                  </p>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    Click to view league details
                  </p>
                </CardFooter>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
