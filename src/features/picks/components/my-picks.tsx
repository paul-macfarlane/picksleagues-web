import { useState } from "react";
import { PickDisplay } from "./pick-display";
import type { PickTeam } from "./pick-display";

// Mock API response
const mockApi = {
  hasMadePicksThisWeek: false, // toggle to true to test read-only
  requiredPicks: 3,
  games: [
    // 1) Scheduled, not yet started (ATS)
    {
      id: 1,
      home: {
        abbr: "PIT",
        logoUrl: "/assets/pit.svg",
        score: null,
        odds: "-8",
      },
      away: {
        abbr: "ARI",
        logoUrl: "/assets/ari.svg",
        score: null,
        odds: "+8",
      },
      pick: null,
      result: null,
      status: "SCHEDULED",
      isATS: true,
      sportsbook: "FAKE ESPN BET",
    },
    // 2) Scheduled, not yet started (ATS)
    {
      id: 2,
      home: {
        abbr: "MIA",
        logoUrl: "/assets/mia.svg",
        score: null,
        odds: "-3",
      },
      away: {
        abbr: "HOU",
        logoUrl: "/assets/hou.svg",
        score: null,
        odds: "+3",
      },
      pick: null,
      result: null,
      status: "SCHEDULED",
      isATS: true,
      sportsbook: "FAKE ESPN BET",
    },
    // 3) Scheduled, not yet started (straight up)
    {
      id: 3,
      home: { abbr: "GB", logoUrl: "/assets/gb.svg", score: null },
      away: { abbr: "MIN", logoUrl: "/assets/min.svg", score: null },
      pick: null,
      result: null,
      status: "SCHEDULED",
      isATS: false,
      sportsbook: undefined,
    },
    // 4) In progress (should not be pickable)
    {
      id: 4,
      home: { abbr: "DAL", logoUrl: "/assets/dal.svg", score: 7 },
      away: { abbr: "NYG", logoUrl: "/assets/nyg.svg", score: 21 },
      pick: null,
      result: null,
      status: "IN_PROGRESS",
      isATS: false,
      sportsbook: undefined,
    },
    // 5) Completed (should not be pickable)
    {
      id: 5,
      home: { abbr: "SEA", logoUrl: "/assets/sea.svg", score: 10 },
      away: { abbr: "SF", logoUrl: "/assets/sf.svg", score: 17 },
      pick: "SEA",
      result: "LOSS",
      status: "FINAL",
      isATS: false,
      sportsbook: undefined,
    },
  ],
};

export function MyPicks() {
  // If user has made picks, show read-only
  if (mockApi.hasMadePicksThisWeek) {
    return (
      <div className="space-y-6">
        {mockApi.games
          .filter((g) => g.pick)
          .map((game) => (
            <PickDisplay
              key={game.id}
              matchup={`${game.away.abbr} @ ${game.home.abbr}`}
              home={game.home}
              away={game.away}
              pick={game.pick || ""}
              result={game.result as "WIN" | "LOSS" | "TIE" | null}
              status={game.status}
              isATS={game.isATS}
              sportsbook={game.sportsbook}
            />
          ))}
      </div>
    );
  }

  // Else, allow user to make picks for scheduled games
  const pickableGames = mockApi.games.filter((g) => g.status === "SCHEDULED");
  const [userPicks, setUserPicks] = useState<{ [gameId: number]: string }>({});
  const canSubmit =
    Object.keys(userPicks).length ===
    Math.min(mockApi.requiredPicks, pickableGames.length);

  if (pickableGames.length === 0) {
    return (
      <div className="text-muted-foreground text-center py-8">
        No games available to pick this week.
      </div>
    );
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        // Submit picks logic here
        alert(`Submitted picks: ${JSON.stringify(userPicks, null, 2)}`);
      }}
    >
      {pickableGames.map((game) => (
        <InteractivePickDisplay
          key={game.id}
          matchup={`${game.away.abbr} @ ${game.home.abbr}`}
          home={game.home}
          away={game.away}
          pick={
            typeof userPicks[game.id] === "string" ? userPicks[game.id] : ""
          }
          status={game.status}
          isATS={game.isATS}
          sportsbook={game.sportsbook}
          onPick={(abbr) =>
            setUserPicks((prev) => ({
              ...prev,
              [game.id]: typeof abbr === "string" ? abbr : "",
            }))
          }
        />
      ))}
      <div className="flex justify-center">
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white font-bold disabled:opacity-50"
          disabled={!canSubmit}
        >
          Submit Picks
        </button>
      </div>
    </form>
  );
}

function InteractivePickDisplay({
  matchup,
  home,
  away,
  pick,
  status,
  isATS,
  sportsbook,
  onPick,
}: {
  matchup: string;
  home: PickTeam;
  away: PickTeam;
  pick: string;
  status: string;
  isATS?: boolean;
  sportsbook?: string;
  onPick: (abbr: string) => void;
}) {
  return (
    <div className="rounded-xl bg-card p-3 border border-border shadow-sm relative">
      <div className="relative flex items-center justify-between mb-2 min-h-[28px]">
        <div className="flex items-center min-w-[48px]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-max font-bold tracking-wide text-center whitespace-nowrap">
          {matchup}
        </div>
        <div className="flex items-center min-w-[48px] justify-end text-xs text-muted-foreground font-semibold uppercase ml-2">
          {status}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-2">
        <InteractivePickTeamBox
          team={away}
          selected={pick === away.abbr}
          onClick={() => onPick(pick === away.abbr ? "" : away.abbr)}
          side="left"
          isATS={isATS}
        />
        <InteractivePickTeamBox
          team={home}
          selected={pick === home.abbr}
          onClick={() => onPick(pick === home.abbr ? "" : home.abbr)}
          side="right"
          isATS={isATS}
        />
      </div>
      {isATS && sportsbook && (
        <div className="text-xs italic text-muted-foreground text-right mt-2">
          Odds presented by <span className="font-semibold">{sportsbook}</span>
        </div>
      )}
    </div>
  );
}

function InteractivePickTeamBox({
  team,
  selected,
  onClick,
  side,
  isATS,
}: {
  team: PickTeam;
  selected: boolean;
  onClick: () => void;
  side: "left" | "right";
  isATS?: boolean;
}) {
  const borderColor = selected ? "border-blue-500" : "border-border";
  return (
    <button
      type="button"
      className={`flex-1 flex items-center rounded-lg border ${borderColor} bg-muted px-4 py-3 min-w-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400`}
      onClick={onClick}
      tabIndex={0}
    >
      {side === "left" && (
        <>
          <div className="hidden md:block text-lg font-bold text-white min-w-[2ch] text-left" />
          <div className="hidden md:flex flex-1 items-center justify-between w-full">
            <span />
            <div className="flex items-center gap-2 ml-auto">
              <span
                className={`font-bold text-lg ${selected ? "text-blue-500" : "text-muted-foreground"}`}
              >
                {team.abbr}
                {isATS && team.odds ? ` ${team.odds}` : ""}
              </span>
              <img
                src={team.logoUrl}
                alt={team.abbr}
                className="w-8 h-8 object-contain"
              />
            </div>
          </div>
          <div className="flex md:hidden flex-1 items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <img
                src={team.logoUrl}
                alt={team.abbr}
                className="w-8 h-8 object-contain"
              />
              <span
                className={`font-bold text-lg ${selected ? "text-blue-500" : "text-muted-foreground"}`}
              >
                {team.abbr}
                {isATS && team.odds ? ` ${team.odds}` : ""}
              </span>
            </div>
          </div>
        </>
      )}
      {side === "right" && (
        <>
          <div className="flex-1 flex flex-row items-center justify-start gap-2">
            <img
              src={team.logoUrl}
              alt={team.abbr}
              className="w-8 h-8 object-contain"
            />
            <span
              className={`font-bold text-lg ${selected ? "text-blue-500" : "text-muted-foreground"}`}
            >
              {team.abbr}
              {isATS && team.odds ? ` ${team.odds}` : ""}
            </span>
          </div>
        </>
      )}
    </button>
  );
}
