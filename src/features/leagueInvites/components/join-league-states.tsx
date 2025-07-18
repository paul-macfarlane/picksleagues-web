import { LeagueCardSkeleton as BaseLeagueCardSkeleton } from "@/features/leagues/components/league-card";

export function JoinLeagueSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <BaseLeagueCardSkeleton />
      </div>
    </div>
  );
}
