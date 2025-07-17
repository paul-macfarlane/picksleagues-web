import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock data
const mockWeek = {
  name: "Week 12",
  pickLockTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
  isLocked: false,
};

const mockGames = [
  { id: "gm1", home: "Team A", away: "Team B", pick: "Team A", status: null },
  { id: "gm2", home: "Team C", away: "Team D", pick: null, status: null },
  { id: "gm3", home: "Team E", away: "Team F", pick: "Team F", status: "WIN" },
];

export function MyPicks() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>My Picks for {mockWeek.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockGames.map((game) => (
            <Card
              key={game.id}
              className="p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <Button
                  variant={game.pick === game.away ? "default" : "outline"}
                  disabled={mockWeek.isLocked}
                >
                  {game.away}
                </Button>
                <span>@</span>
                <Button
                  variant={game.pick === game.home ? "default" : "outline"}
                  disabled={mockWeek.isLocked}
                >
                  {game.home}
                </Button>
              </div>
              {game.status && (
                <Badge
                  variant={game.status === "WIN" ? "default" : "destructive"}
                >
                  {game.status}
                </Badge>
              )}
            </Card>
          ))}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button disabled={mockWeek.isLocked}>Save Picks</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
