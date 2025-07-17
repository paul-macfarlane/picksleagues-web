import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function LeagueLayoutPendingComponent() {
  return (
    <div className="container py-4 md:py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-[250px]" />
        </div>
      </div>
      <div className="flex border-b">
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

export function PendingCard() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-1/4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
