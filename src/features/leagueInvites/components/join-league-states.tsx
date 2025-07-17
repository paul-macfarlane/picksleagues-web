import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeagueCardSkeleton as BaseLeagueCardSkeleton } from "@/features/leagues/components/league-card";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

export function JoinLeagueSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <BaseLeagueCardSkeleton />
      </div>
    </div>
  );
}

export function JoinLeagueErrorState() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Error</CardTitle>
      </CardHeader>
      <CardContent>
        <p>There was an error loading the invite. It may be invalid.</p>
      </CardContent>
    </Card>
  );
}

export function JoinLeagueErrorComponent() {
  const router = useRouter();
  const { reset } = useQueryErrorResetBoundary();
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <JoinLeagueErrorState />
      <Button
        onClick={() => {
          reset();
          router.invalidate();
        }}
        className="mt-4"
      >
        Try again
      </Button>
    </div>
  );
}
