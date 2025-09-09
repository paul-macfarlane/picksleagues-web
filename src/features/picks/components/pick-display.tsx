import type { PopulatedEventResponse } from "../../events/events.type";
import type { PopulatedPickResponse } from "../picks.types";
import type { TeamResponse } from "../../teams/teams.types";
import { LIVE_SCORE_STATUSES } from "../../events/events.type";

export function PickDisplay({
  event,
  userPick,
  isATS = false,
}: {
  event: PopulatedEventResponse;
  userPick?: PopulatedPickResponse;
  isATS?: boolean;
}) {
  // Use actual team data from the event, with fallbacks for missing data
  const homeTeam: TeamResponse = event.homeTeam || {
    id: event.homeTeamId,
    name: "Home Team",
    abbreviation: "HOME",
    imageLight: "/assets/placeholder.svg",
    imageDark: "/assets/placeholder.svg",
    createdAt: new Date(),
    updatedAt: new Date(),
    sportLeagueId: "",
    location: "",
  };

  const awayTeam: TeamResponse = event.awayTeam || {
    id: event.awayTeamId,
    name: "Away Team",
    abbreviation: "AWAY",
    imageLight: "/assets/placeholder.svg",
    imageDark: "/assets/placeholder.svg",
    createdAt: new Date(),
    updatedAt: new Date(),
    sportLeagueId: "",
    location: "",
  };

  // Determine matchup string
  const matchup = `${awayTeam.abbreviation} @ ${homeTeam.abbreviation}`;

  // Determine status
  const status = event.liveScore
    ? event.liveScore.status === LIVE_SCORE_STATUSES.IN_PROGRESS
      ? "LIVE"
      : event.liveScore.status === LIVE_SCORE_STATUSES.FINAL
        ? "FINAL"
        : event.liveScore.status === LIVE_SCORE_STATUSES.NOT_STARTED
          ? new Date(event.startTime).toLocaleString([], {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "PRE-GAME"
    : event.outcome
      ? "FINAL"
      : new Date(event.startTime).toLocaleString([], {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

  // Determine result based on user pick and event outcome
  let result: "WIN" | "LOSS" | "TIE" | null = null;
  if (
    userPick &&
    (event.outcome || event.liveScore?.status === LIVE_SCORE_STATUSES.FINAL)
  ) {
    // Use live score if available and final, otherwise use outcome
    const homeScore =
      event.liveScore?.status === LIVE_SCORE_STATUSES.FINAL
        ? event.liveScore.homeScore
        : event.outcome?.homeScore;
    const awayScore =
      event.liveScore?.status === LIVE_SCORE_STATUSES.FINAL
        ? event.liveScore.awayScore
        : event.outcome?.awayScore;

    if (homeScore !== undefined && awayScore !== undefined) {
      if (isATS && event.odds) {
        // ATS logic: account for spread
        const spread = event.odds.spreadHome ?? 0;
        const adjustedHomeScore = homeScore + spread;

        if (adjustedHomeScore === awayScore) {
          result = "TIE";
        } else if (
          userPick.teamId === event.homeTeamId &&
          adjustedHomeScore > awayScore
        ) {
          result = "WIN";
        } else if (
          userPick.teamId === event.awayTeamId &&
          awayScore > adjustedHomeScore
        ) {
          result = "WIN";
        } else {
          result = "LOSS";
        }
      } else {
        // Straight up logic
        if (homeScore === awayScore) {
          result = "TIE";
        } else if (
          userPick.teamId === event.homeTeamId &&
          homeScore > awayScore
        ) {
          result = "WIN";
        } else if (
          userPick.teamId === event.awayTeamId &&
          awayScore > homeScore
        ) {
          result = "WIN";
        } else {
          result = "LOSS";
        }
      }
    }
  }

  // Badge logic
  const showBadge =
    result === "TIE" ? (
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
          team={awayTeam}
          picked={userPick?.teamId === awayTeam.id}
          result={result}
          score={event.liveScore?.awayScore || event.outcome?.awayScore || null}
          side="left"
          isATS={isATS}
          odds={
            userPick?.teamId === awayTeam.id && userPick?.spread
              ? parseFloat(userPick.spread)
              : event.odds?.spreadAway || undefined
          }
        />
        {/* Home Team */}
        <PickTeamBox
          team={homeTeam}
          picked={userPick?.teamId === homeTeam.id}
          result={result}
          score={event.liveScore?.homeScore || event.outcome?.homeScore || null}
          side="right"
          isATS={isATS}
          odds={
            userPick?.teamId === homeTeam.id && userPick?.spread
              ? parseFloat(userPick.spread)
              : event.odds?.spreadHome || undefined
          }
        />
      </div>
      {isATS && (userPick?.spread || event.odds?.sportsbook) && (
        <div className="text-xs italic text-muted-foreground text-right mt-2">
          {userPick?.spread ? (
            "Odds shown are from when pick was made"
          ) : (
            <>
              Odds presented by{" "}
              <span className="font-semibold">
                {event.odds?.sportsbook?.name}
              </span>
            </>
          )}
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
  odds,
}: {
  team: TeamResponse;
  picked: boolean;
  score: number | null;
  side: "left" | "right";
  isATS?: boolean;
  result?: "WIN" | "LOSS" | "TIE" | null;
  odds?: number;
}) {
  let borderColor = "border-border";
  let backgroundColor = "bg-muted";

  if (picked) {
    if (result === "WIN") {
      borderColor = "border-green-500";
      backgroundColor = "bg-green-500/10";
    } else if (result === "LOSS") {
      borderColor = "border-destructive";
      backgroundColor = "bg-destructive/10";
    } else if (result === "TIE") {
      borderColor = "border-yellow-400";
      backgroundColor = "bg-yellow-400/10";
    } else {
      // Game hasn't completed yet - show primary border for selected pick
      borderColor = "border-primary";
      backgroundColor = "bg-primary/10";
    }
  }

  // Format odds to add + for positive spreads, show "even" for 0, and trim extra 0s
  const formatOdds = (odds: number) => {
    if (isNaN(odds)) return odds;
    if (odds === 0) return "even";
    const trimmedOdds = odds.toString(); // This removes trailing 0s
    return odds > 0 ? `+${trimmedOdds}` : trimmedOdds;
  };

  const displayText =
    isATS && odds
      ? `${team.abbreviation} ${formatOdds(odds)}`
      : team.abbreviation;

  return (
    <div
      className={`flex-1 flex items-center rounded-lg border ${borderColor} ${backgroundColor} px-4 py-3 min-w-0`}
    >
      {/* Away team (left) */}
      {side === "left" && (
        <>
          <span
            className={`hidden md:block text-lg font-bold min-w-[2ch] text-left ${picked ? "text-primary-background" : "text-muted-foreground"}`}
          >
            {score !== null ? score : ""}
          </span>
          <div className="hidden md:flex flex-1 items-center justify-between w-full">
            <span></span>
            <div className="flex items-center gap-2 ml-auto">
              <span
                className={`font-bold text-lg ${picked ? "text-primary-background" : "text-muted-foreground"}`}
              >
                {displayText}
              </span>
              <img
                src={team.imageLight || "/assets/placeholder.svg"}
                alt={team.abbreviation}
                className="w-8 h-8 object-contain"
              />
            </div>
          </div>
          <div className="flex md:hidden flex-1 items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <img
                src={team.imageLight || "/assets/placeholder.svg"}
                alt={team.abbreviation}
                className="w-8 h-8 object-contain"
              />
              <span
                className={`font-bold text-lg ${picked ? "text-primary-background" : "text-muted-foreground"}`}
              >
                {displayText}
              </span>
            </div>
            <span
              className={`text-lg font-bold min-w-[2ch] text-right ml-auto ${picked ? "text-primary-background" : "text-muted-foreground"}`}
            >
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
              src={team.imageLight || "/assets/placeholder.svg"}
              alt={team.abbreviation}
              className="w-8 h-8 object-contain"
            />
            <span
              className={`font-bold text-lg ${picked ? "text-primary-background" : "text-muted-foreground"}`}
            >
              {displayText}
            </span>
          </div>
          <span
            className={`hidden md:block text-lg font-bold min-w-[2ch] text-right ${picked ? "text-primary-background" : "text-muted-foreground"}`}
          >
            {score !== null ? score : ""}
          </span>
          <span
            className={`block md:hidden text-lg font-bold min-w-[2ch] text-right ml-auto ${picked ? "text-primary-background" : "text-muted-foreground"}`}
          >
            {score !== null ? score : ""}
          </span>
        </>
      )}
    </div>
  );
}
