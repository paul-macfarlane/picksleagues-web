import { PickDisplay } from "./pick-display";
// Mock team info
const mockGames = [
  // 1) Scheduled, not yet started (ATS)
  {
    id: 1,
    home: { abbr: "PIT", logoUrl: "/assets/pit.svg", score: null, odds: "-8" },
    away: { abbr: "ARI", logoUrl: "/assets/ari.svg", score: null, odds: "+8" },
    pick: "ARI",
    pickResult: null,
    result: null,
    status: "SCHEDULED",
    isATS: true,
    sportsbook: "FAKE ESPN BET",
  },
  // 2) In progress (ATS)
  {
    id: 2,
    home: { abbr: "PIT", logoUrl: "/assets/pit.svg", score: 30, odds: "-8" },
    away: { abbr: "ARI", logoUrl: "/assets/ari.svg", score: 3, odds: "+8" },
    pick: "ARI",
    pickResult: null,
    result: null,
    status: "IN_PROGRESS",
    isATS: true,
    sportsbook: "FAKE ESPN BET",
  },
  // 3) Completed, picked correctly (ATS)
  {
    id: 3,
    home: { abbr: "MIA", logoUrl: "/assets/mia.svg", score: 15, odds: "-3" },
    away: { abbr: "HOU", logoUrl: "/assets/hou.svg", score: 20, odds: "+3" },
    pick: "HOU",
    pickResult: "WIN",
    result: "WIN",
    status: "FINAL",
    isATS: true,
    sportsbook: "FAKE ESPN BET",
  },
  // 4) Completed, picked incorrectly (ATS)
  {
    id: 4,
    home: { abbr: "PIT", logoUrl: "/assets/pit.svg", score: 30, odds: "-8" },
    away: { abbr: "ARI", logoUrl: "/assets/ari.svg", score: 3, odds: "+8" },
    pick: "ARI",
    pickResult: "LOSS",
    result: "LOSS",
    status: "FINAL",
    isATS: true,
    sportsbook: "FAKE ESPN BET",
  },
  // 5) Completed, tied (straight up)
  {
    id: 5,
    home: { abbr: "GB", logoUrl: "/assets/gb.svg", score: 20 },
    away: { abbr: "MIN", logoUrl: "/assets/min.svg", score: 20 },
    pick: "GB",
    pickResult: "TIE",
    result: "TIE",
    status: "FINAL",
    isATS: false,
    sportsbook: undefined,
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
          result={game.result as "WIN" | "LOSS" | "TIE" | null}
          status={game.status}
          isATS={game.isATS}
          sportsbook={game.sportsbook}
        />
      ))}
    </div>
  );
}
