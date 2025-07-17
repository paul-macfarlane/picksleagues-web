import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Mock standings data
const mockStandings = [
  { rank: 1, team: "Team Alpha", wins: 10, losses: 4, pushes: 1, points: 10.5 },
  { rank: 2, team: "Team Bravo", wins: 9, losses: 5, pushes: 1, points: 9.5 },
  { rank: 3, team: "Team Charlie", wins: 8, losses: 6, pushes: 1, points: 8.5 },
  { rank: 4, team: "Team Delta", wins: 7, losses: 7, pushes: 1, points: 7.5 },
];

export function StandingsTable() {
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
              <TableHead>Team</TableHead>
              <TableHead className="text-right">Wins</TableHead>
              <TableHead className="text-right">Losses</TableHead>
              <TableHead className="text-right">Pushes</TableHead>
              <TableHead className="text-right">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockStandings.map((standing) => (
              <TableRow key={standing.team}>
                <TableCell>{standing.rank}</TableCell>
                <TableCell className="font-medium">{standing.team}</TableCell>
                <TableCell className="text-right">{standing.wins}</TableCell>
                <TableCell className="text-right">{standing.losses}</TableCell>
                <TableCell className="text-right">{standing.pushes}</TableCell>
                <TableCell className="text-right">{standing.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
