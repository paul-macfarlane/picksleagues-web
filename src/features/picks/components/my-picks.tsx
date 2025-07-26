import { PickDisplay } from "./pick-display";
// Mock team info
const mockGames = [
  {
    id: "gm1",
    home: { abbr: "NO", logoUrl: "/assets/no.svg", score: 0 },
    away: { abbr: "PHI", logoUrl: "/assets/phi.svg", score: 16 },
    pick: "PHI",
    pickResult: "WIN",
    status: "FINAL",
  },
  {
    id: "gm2",
    home: { abbr: "CIN", logoUrl: "/assets/cin.svg", score: 27 },
    away: { abbr: "IND", logoUrl: "/assets/ind.svg", score: 4 },
    pick: "CIN",
    pickResult: "WIN",
    status: "FINAL",
  },
  {
    id: "gm3",
    home: { abbr: "MIA", logoUrl: "/assets/mia.svg", score: 15 },
    away: { abbr: "HOU", logoUrl: "/assets/hou.svg", score: 12 },
    pick: "HOU",
    pickResult: "LOSS",
    status: "FINAL",
  },
];

export function MyPicks() {
  return (
    <div className="space-y-6">
      {mockGames.map((game) => (
        <PickDisplay
          key={game.id}
          matchup={`${game.away.abbr} @ ${game.home.abbr}`}
          home={game.home}
          away={game.away}
          pick={game.pick}
          result={game.pickResult as "WIN" | "LOSS" | null}
          status={game.status}
        />
      ))}
    </div>
  );
}
