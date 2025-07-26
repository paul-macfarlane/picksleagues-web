// Mock team info
const teamInfo: Record<string, { abbr: string; logoUrl: string }> = {
  PHI: { abbr: "PHI", logoUrl: "/assets/phi.svg" },
  NO: { abbr: "NO", logoUrl: "/assets/no.svg" },
  IND: { abbr: "IND", logoUrl: "/assets/ind.svg" },
  CIN: { abbr: "CIN", logoUrl: "/assets/cin.svg" },
  HOU: { abbr: "HOU", logoUrl: "/assets/hou.svg" },
  MIA: { abbr: "MIA", logoUrl: "/assets/mia.svg" },
};

// Mock games with detailed info
const mockGames = [
  {
    id: "gm1",
    home: "NO",
    homeScore: 0,
    away: "PHI",
    awayScore: 16,
    pick: "PHI",
    pickPoints: 16,
    pickResult: "WIN", // 'WIN' | 'LOSS' | null
    status: "FINAL",
  },
  {
    id: "gm2",
    home: "CIN",
    homeScore: 27,
    away: "IND",
    awayScore: 4,
    pick: "CIN",
    pickPoints: 27,
    pickResult: "WIN",
    status: "FINAL",
  },
  {
    id: "gm3",
    home: "MIA",
    homeScore: 15,
    away: "HOU",
    awayScore: 12,
    pick: "HOU",
    pickPoints: 12,
    pickResult: "LOSS",
    status: "FINAL",
  },
];

export function MyPicks() {
  return (
    <div className="space-y-6">
      {/* Picks List */}
      <div className="space-y-6">
        {mockGames.map((game) => (
          <div
            key={game.id}
            className="rounded-xl bg-card p-4 border border-border shadow-sm"
          >
            {/* Win/Loss Badge and Matchup */}
            <div className="flex items-center justify-between mb-2">
              <div>
                {game.pickResult === "WIN" && (
                  <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-green-600 text-white">
                    Win
                  </span>
                )}
                {game.pickResult === "LOSS" && (
                  <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-red-600 text-white">
                    Loss
                  </span>
                )}
              </div>
              <div className="font-bold tracking-wide text-center flex-1">
                {teamInfo[game.away].abbr} @ {teamInfo[game.home].abbr}
              </div>
              <div className="text-xs text-muted-foreground font-semibold uppercase">
                {game.status}
              </div>
            </div>
            {/* Team Pick Boxes */}
            <div className="flex flex-col md:flex-row gap-2 mt-2">
              {/* Away Team (left/top) */}
              <TeamPickBox
                team={teamInfo[game.away]}
                score={game.awayScore}
                picked={game.pick === game.away}
                pickResult={
                  game.pick === game.away
                    ? (game.pickResult as "WIN" | "LOSS" | null)
                    : null
                }
                side="left"
              />
              {/* Home Team (right/bottom) */}
              <TeamPickBox
                team={teamInfo[game.home]}
                score={game.homeScore}
                picked={game.pick === game.home}
                pickResult={
                  game.pick === game.home
                    ? (game.pickResult as "WIN" | "LOSS" | null)
                    : null
                }
                side="right"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Team Pick Box Component
function TeamPickBox({
  team,
  score,
  picked,
  pickResult,
  side,
}: {
  team: { abbr: string; logoUrl: string };
  score: number;
  picked: boolean;
  pickResult: "WIN" | "LOSS" | null;
  side: "left" | "right";
}) {
  let borderColor = "border-border";
  if (picked && pickResult === "WIN") borderColor = "border-green-500";
  if (picked && pickResult === "LOSS") borderColor = "border-red-500";

  return (
    <div
      className={`flex-1 flex items-center rounded-lg border ${borderColor} bg-muted px-4 py-3 min-w-0`}
    >
      {/* Away team (left) */}
      {side === "left" && (
        <>
          {/* Desktop: score left, abbr+logo right */}
          <span className="hidden md:block text-lg font-bold text-white min-w-[2ch] text-left">
            {score}
          </span>
          <div className="hidden md:flex flex-1 items-center justify-between w-full">
            <span></span> {/* Spacer for justify-between */}
            <div className="flex items-center gap-2 ml-auto">
              <span
                className={`font-bold text-lg ${picked ? "text-white" : "text-muted-foreground"}`}
              >
                {team.abbr}
              </span>
              <img
                src={team.logoUrl}
                alt={team.abbr}
                className="w-8 h-8 object-contain"
              />
            </div>
          </div>
          {/* Mobile: logo, abbr, score */}
          <div className="flex md:hidden flex-1 items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <img
                src={team.logoUrl}
                alt={team.abbr}
                className="w-8 h-8 object-contain"
              />
              <span
                className={`font-bold text-lg ${picked ? "text-white" : "text-muted-foreground"}`}
              >
                {team.abbr}
              </span>
            </div>
            <span className="text-lg font-bold text-white min-w-[2ch] text-right ml-auto">
              {score}
            </span>
          </div>
        </>
      )}
      {/* Home team (right) */}
      {side === "right" && (
        <>
          <div className="flex-1 flex flex-row items-center justify-start gap-2">
            {/* Team logo first, then abbreviation */}
            <img
              src={team.logoUrl}
              alt={team.abbr}
              className="w-8 h-8 object-contain"
            />
            <span
              className={`font-bold text-lg ${picked ? "text-white" : "text-muted-foreground"}`}
            >
              {team.abbr}
            </span>
          </div>
          {/* Desktop: score right */}
          <span className="hidden md:block text-lg font-bold text-white min-w-[2ch] text-right">
            {score}
          </span>
          {/* Mobile: score right */}
          <span className="block md:hidden text-lg font-bold text-white min-w-[2ch] text-right ml-auto">
            {score}
          </span>
        </>
      )}
    </div>
  );
}
