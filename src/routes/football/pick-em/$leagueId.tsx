import {
  createFileRoute,
  Link,
  Outlet,
  useParams,
  ErrorComponent,
  redirect,
} from "@tanstack/react-router";
import { Suspense } from "react";
// import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GetLeagueQueryOptions } from "@/features/leagues/leagues.api";

export const Route = createFileRoute("/football/pick-em/$leagueId")({
  component: LeagueLayoutComponent,
  errorComponent: ErrorComponent,
  pendingComponent: LeagueLayoutPendingComponent,
  pendingMs: 200, // make sure page doesn't completlely block for longer requests
  beforeLoad: async ({ context }) => {
    if (!context.session) {
      throw redirect({ to: "/login" });
    }
  },
  loader: ({ context: { queryClient }, params: { leagueId } }) =>
    queryClient.ensureQueryData(GetLeagueQueryOptions(leagueId)),
});

function LeagueLayoutPendingComponent() {
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

function PendingCard() {
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

function LeagueLayoutComponent() {
  const { leagueId } = useParams({ from: "/football/pick-em/$leagueId" });
  const { data: league } = useSuspenseQuery(GetLeagueQueryOptions(leagueId));

  const tabs = [
    { name: "Standings", to: "/football/pick-em/$leagueId", exact: true },
    { name: "My Picks", to: "/football/pick-em/$leagueId/my-picks" },
    { name: "League Picks", to: "/football/pick-em/$leagueId/league-picks" },
    { name: "Members", to: "/football/pick-em/$leagueId/members" },
    { name: "Settings", to: "/football/pick-em/$leagueId/settings" },
  ];

  return (
    <div className="container py-4 md:py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={league.image ?? undefined} alt={league.name} />
          <AvatarFallback>
            <Trophy className="h-8 w-8" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {league.name}
          </h1>
          {/* TODO: Add back isCommissioner check when API provides it */}
          {/* {league.isCommissioner && <Badge>Commissioner</Badge>} */}
        </div>
      </div>
      <nav className="flex border-b overflow-x-auto">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            to={tab.to}
            params={{ leagueId }}
            className="px-4 py-2 -mb-px border-b-2 border-transparent flex-shrink-0 whitespace-nowrap"
            activeProps={{
              className: "border-primary text-primary",
            }}
            activeOptions={{ exact: tab.exact }}
          >
            {tab.name}
          </Link>
        ))}
      </nav>
      <Suspense fallback={<PendingCard />}>
        <Outlet />
      </Suspense>
    </div>
  );
}
