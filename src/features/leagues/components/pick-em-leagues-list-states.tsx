import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { LeagueCardSkeleton } from "./league-card";
import { AlertCircle, CheckSquare } from "lucide-react";

export function PickEmLeaguesListSkeleton() {
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
        <Button size="lg" className="w-full sm:w-auto" disabled>
          Create League
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <LeagueCardSkeleton />
        <LeagueCardSkeleton />
        <LeagueCardSkeleton />
      </div>
    </div>
  );
}

export function PickEmLeaguesListErrorComponent() {
  const router = useRouter();
  const { reset } = useQueryErrorResetBoundary();
  return (
    <div className="container py-4 md:py-8">
      <Card>
        <CardHeader className="flex-row gap-2 items-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <div>
            <CardTitle>Unable to Load Leagues</CardTitle>
            <CardDescription>
              There was an error loading your data. Please try again.
            </CardDescription>
          </div>
        </CardHeader>
        <div className="p-6 pt-0">
          <Button
            onClick={() => {
              reset();
              router.invalidate();
            }}
          >
            Try again
          </Button>
        </div>
      </Card>
    </div>
  );
}
