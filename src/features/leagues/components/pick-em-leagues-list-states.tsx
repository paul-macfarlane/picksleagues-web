import { LeagueCardSkeleton } from "./league-card";
import { CheckSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
        <Skeleton className="h-11 w-32" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <LeagueCardSkeleton />
        <LeagueCardSkeleton />
        <LeagueCardSkeleton />
      </div>
    </div>
  );
}
