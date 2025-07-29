import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef, SortingState, Column } from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";
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

type StandingData = {
  rank: number;
  profile: NonNullable<PopulatedPickEmStandingsResponse["profile"]>;
  points: number;
  wins: number;
  losses: number;
  pushes: number;
};

// Helper function to create sortable headers
const createSortableHeader = (label: string) => {
  return ({ column }: { column: Column<StandingData> }) => {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold"
      >
        {label}
        {column.getIsSorted() === "asc" ? (
          <ChevronUp className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <ChevronDown className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </Button>
    );
  };
};

const columns: ColumnDef<StandingData>[] = [
  {
    accessorKey: "rank",
    header: createSortableHeader("Rank"),
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.getValue("rank")}</div>
    ),
  },
  {
    accessorKey: "profile",
    header: "Player",
    cell: ({ row }) => {
      const profile = row.getValue("profile") as NonNullable<
        PopulatedPickEmStandingsResponse["profile"]
      >;
      return <UserDisplay profile={profile} />;
    },
    enableSorting: false, // Disable sorting for profile column as it's a complex object
  },
  {
    accessorKey: "points",
    header: createSortableHeader("Points"),
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.getValue("points")}</div>
    ),
  },
  {
    accessorKey: "wins",
    header: createSortableHeader("Wins"),
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.getValue("wins")}</div>
    ),
  },
  {
    accessorKey: "losses",
    header: createSortableHeader("Losses"),
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.getValue("losses")}</div>
    ),
  },
  {
    accessorKey: "pushes",
    header: createSortableHeader("Pushes"),
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.getValue("pushes")}</div>
    ),
  },
];

export function StandingsTable() {
  const { leagueId } = useParams({
    from: "/_authenticated/football/pick-em/$leagueId/",
  });
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const {
    data: standings,
    isLoading,
    error,
  } = useQuery(
    GetStandingsForLeagueAndCurrentSeasonQueryOptions<PopulatedPickEmStandingsResponse>(
      leagueId,
      [STANDINGS_INCLUDES.PROFILE],
    ),
  );

  // Transform data for the table
  const tableData: StandingData[] = React.useMemo(() => {
    return (
      standings?.map((standing, index) => {
        const metadata = standing.metadata as {
          wins: number;
          losses: number;
          pushes: number;
        };
        return {
          rank: index + 1,
          profile: standing.profile!,
          points: standing.points,
          wins: metadata.wins,
          losses: metadata.losses,
          pushes: metadata.pushes,
        };
      }) || []
    );
  }, [standings]);

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Standings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
