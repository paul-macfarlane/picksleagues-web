import { Link, Outlet, useParams } from "@tanstack/react-router";
import { Suspense } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { GetLeagueQueryOptions } from "@/features/leagues/leagues.api";
import { PendingCard } from "@/features/leagues/components/league-layout-skeleton";
import { LEAGUE_INCLUDES } from "../leagues.types";
import { LEAGUE_MEMBER_ROLES } from "@/features/leagueMembers/leagueMembers.types";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";

export function LeagueLayout() {
  const { leagueId } = useParams({
    from: "/_authenticated/football/pick-em/$leagueId",
  });
  const { data: session } = authClient.useSession();
  const { data: league } = useSuspenseQuery(
    GetLeagueQueryOptions(leagueId, [
      LEAGUE_INCLUDES.LEAGUE_TYPE,
      LEAGUE_INCLUDES.MEMBERS,
      LEAGUE_INCLUDES.IS_IN_SEASON,
    ]),
  );

  const isCommissioner = league.members?.some(
    (member) =>
      member.userId === session!.user.id &&
      member.role === LEAGUE_MEMBER_ROLES.COMMISSIONER,
  );

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
          {isCommissioner && <Badge>Commissioner</Badge>}
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
