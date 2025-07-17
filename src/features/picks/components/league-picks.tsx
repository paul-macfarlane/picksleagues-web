import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";

// Mock data
const mockWeek = {
  name: "Week 12",
  isLocked: false,
};
const mockPicks = [
  { member: "Alice", game: "Team A @ Team B", pick: "Team A", status: "WIN" },
  { member: "Bob", game: "Team A @ Team B", pick: "Team B", status: "LOSS" },
  { member: "Alice", game: "Team C @ Team D", pick: "Team D", status: "WIN" },
  { member: "Bob", game: "Team C @ Team D", pick: "Team D", status: "WIN" },
];

export function LeaguePicks() {
  if (!mockWeek.isLocked) {
    return (
      <div className="text-center text-muted-foreground py-12 flex flex-col items-center gap-4">
        <Lock className="h-12 w-12" />
        <h3 className="text-xl font-semibold">Picks are Locked</h3>
        <p>
          Picks for {mockWeek.name} will be revealed after the pick lock time.
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>League Picks for {mockWeek.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Game</TableHead>
              <TableHead>Pick</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPicks.map((pick, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{pick.member}</TableCell>
                <TableCell>{pick.game}</TableCell>
                <TableCell>{pick.pick}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={pick.status === "WIN" ? "default" : "destructive"}
                  >
                    {pick.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
