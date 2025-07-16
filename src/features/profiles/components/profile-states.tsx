import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "@tanstack/react-router";

export function ProfileLoadingSkeleton() {
  return <Skeleton className="h-120 w-full max-w-md mx-auto mt-8" />;
}

export function ProfileErrorState() {
  const { navigate } = useRouter();
  return (
    <div className="flex justify-center items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Unexpected Error</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-6 py-8">
            <span className="text-destructive text-center">
              An unexpected error occurred. Please try again later.
            </span>
            <Button variant="outline" onClick={() => navigate({ to: "/" })}>
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
