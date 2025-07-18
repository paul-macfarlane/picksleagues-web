import { Link, Outlet, useParams } from "@tanstack/react-router";
import { Suspense } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { GetLeagueQueryOptions } from "@/features/leagues/leagues.api";
import { PendingCard } from "@/features/leagues/components/league-layout-skeleton";

export function LeagueLayout() {
  const { leagueId } = useParams({
    from: "/_authenticated/football/pick-em/$leagueId",
  });
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
