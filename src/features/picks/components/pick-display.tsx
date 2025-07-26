import React from "react";

export type PickTeam = {
  abbr: string;
  logoUrl: string;
  score: number | null;
  odds?: string; // e.g. '+8' or '-8', only for ATS
};

export type PickDisplayProps = {
  matchup: string;
  home: PickTeam;
  away: PickTeam;
  pick: string;
  result: "WIN" | "LOSS" | "TIE" | null;
  status: string;
  badge?: React.ReactNode;
  isATS?: boolean;
  sportsbook?: string;
};

export function PickDisplay({
  matchup,
  home,
  away,
  pick,
  result,
  status,
  badge,
  isATS,
  sportsbook,
}: PickDisplayProps) {
  // Badge logic
  const showBadge =
    badge !== undefined ? (
      badge
    ) : result === "TIE" ? (
      <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-400 text-black">
        Push
      </span>
    ) : result ? (
      <span
        className={`px-2 py-1 rounded-full text-xs font-bold ${result === "WIN" ? "bg-green-600 text-white" : result === "LOSS" ? "bg-red-600 text-white" : ""}`}
      >
        {result === "WIN" ? "Win" : "Loss"}
      </span>
    ) : null;
  return (
    <div className="rounded-xl bg-card p-3 border border-border shadow-sm relative">
      <div className="relative flex items-center justify-between mb-2 min-h-[28px]">
        {/* Badge (left) */}
        <div className="flex items-center min-w-[48px]">{showBadge}</div>
        {/* Centered matchup */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-max font-bold tracking-wide text-center whitespace-nowrap">
          {matchup}
        </div>
        {/* Status (right) */}
        <div className="flex items-center min-w-[48px] justify-end text-xs text-muted-foreground font-semibold uppercase ml-2">
          {status}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-2">
        {/* Away Team */}
        <PickTeamBox
          team={away}
          picked={pick === away.abbr}
          score={away.score}
          side="left"
          isATS={isATS}
          result={result}
        />
        {/* Home Team */}
        <PickTeamBox
          team={home}
          picked={pick === home.abbr}
          score={home.score}
          side="right"
          isATS={isATS}
          result={result}
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

export function PickTeamBox({
  team,
  picked,
  score,
  side,
  isATS,
  result,
}: {
  team: PickTeam;
  picked: boolean;
  score: number | null;
  side: "left" | "right";
  isATS?: boolean;
  result?: "WIN" | "LOSS" | "TIE" | null;
}) {
  let borderColor = "border-border";
  if (picked && result === "WIN") borderColor = "border-green-500";
  if (picked && result === "LOSS") borderColor = "border-red-500";
  if (picked && result === "TIE") borderColor = "border-yellow-400";
  return (
    <div
      className={`flex-1 flex items-center rounded-lg border ${borderColor} bg-muted px-4 py-3 min-w-0`}
    >
      {/* Away team (left) */}
      {side === "left" && (
        <>
          <span className="hidden md:block text-lg font-bold text-white min-w-[2ch] text-left">
            {score !== null ? score : ""}
          </span>
          <div className="hidden md:flex flex-1 items-center justify-between w-full">
            <span></span>
            <div className="flex items-center gap-2 ml-auto">
              <span
                className={`font-bold text-lg ${picked ? "text-white" : "text-muted-foreground"}`}
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
                className={`font-bold text-lg ${picked ? "text-white" : "text-muted-foreground"}`}
              >
                {team.abbr}
                {isATS && team.odds ? ` ${team.odds}` : ""}
              </span>
            </div>
            <span className="text-lg font-bold text-white min-w-[2ch] text-right ml-auto">
              {score !== null ? score : ""}
            </span>
          </div>
        </>
      )}
      {/* Home team (right) */}
      {side === "right" && (
        <>
          <div className="flex-1 flex flex-row items-center justify-start gap-2">
            <img
              src={team.logoUrl}
              alt={team.abbr}
              className="w-8 h-8 object-contain"
            />
            <span
              className={`font-bold text-lg ${picked ? "text-white" : "text-muted-foreground"}`}
            >
              {team.abbr}
              {isATS && team.odds ? ` ${team.odds}` : ""}
            </span>
          </div>
          <span className="hidden md:block text-lg font-bold text-white min-w-[2ch] text-right">
            {score !== null ? score : ""}
          </span>
          <span className="block md:hidden text-lg font-bold text-white min-w-[2ch] text-right ml-auto">
            {score !== null ? score : ""}
          </span>
        </>
      )}
    </div>
  );
}
