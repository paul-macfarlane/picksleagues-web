import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserDisplay } from "@/components/ui/user-display";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { GetStandingsForLeagueAndCurrentSeasonQueryOptions } from "@/features/standings/standings.api";
import { STANDINGS_INCLUDES } from "@/features/standings/standings.types";
import type { PopulatedPickEmStandingsResponse } from "@/features/standings/standings.types";

export function StandingsTable() {
  const { leagueId } = useParams({
    from: "/_authenticated/football/pick-em/$leagueId/",
  });

  const {
    data: standings,
    isLoading,
    error,
  } = useQuery(
    GetStandingsForLeagueAndCurrentSeasonQueryOptions(leagueId, [
      STANDINGS_INCLUDES.PROFILE,
    ]),
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Standings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className="text-right">Points</TableHead>
                <TableHead className="text-right">Wins</TableHead>
                <TableHead className="text-right">Losses</TableHead>
                <TableHead className="text-right">Pushes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-8 ml-auto" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-6 ml-auto" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-6 ml-auto" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-6 ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Standings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Error loading standings. Please try again.
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform data for the table
  const tableData =
    standings?.map((standing, index) => {
      const pickEmStanding = standing as PopulatedPickEmStandingsResponse;
      const metadata = pickEmStanding.metadata as {
        wins: number;
        losses: number;
        pushes: number;
      };
      return {
        rank: index + 1,
        profile: pickEmStanding.profile!,
        points: pickEmStanding.points,
        wins: metadata.wins,
        losses: metadata.losses,
        pushes: metadata.pushes,
      };
    }) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Standings</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Rank</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-right">Points</TableHead>
              <TableHead className="text-right">Wins</TableHead>
              <TableHead className="text-right">Losses</TableHead>
              <TableHead className="text-right">Pushes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((standing, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{standing.rank}</TableCell>
                <TableCell>
                  <UserDisplay profile={standing.profile} />
                </TableCell>
                <TableCell className="text-right font-medium">
                  {standing.points}
                </TableCell>
                <TableCell className="text-right">{standing.wins}</TableCell>
                <TableCell className="text-right">{standing.losses}</TableCell>
                <TableCell className="text-right">{standing.pushes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
