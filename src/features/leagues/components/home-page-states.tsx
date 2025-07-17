import { LeagueCardSkeleton } from "./league-card";
import { football } from "@lucide/lab";
import { Icon } from "lucide-react";

export function HomePageSkeleton() {
  return (
    <div className="container py-4 md:py-8 space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Home</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening in your leagues.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
          Open Invites
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <LeagueCardSkeleton />
          <LeagueCardSkeleton />
          <LeagueCardSkeleton />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
          My Leagues
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon iconNode={football} className="w-6 h-6 text-primary" />
              <h3 className="text-lg md:text-xl font-semibold">
                Football Pick'em
              </h3>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <LeagueCardSkeleton />
            <LeagueCardSkeleton />
            <LeagueCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
