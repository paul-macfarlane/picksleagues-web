import { InteractivePickTeamBox } from "./interactive-pick-team-box";
import type { PopulatedEventResponse } from "../../events/events.type";
import type { TeamResponse } from "../../teams/teams.types";
import { LIVE_SCORE_STATUSES } from "../../events/events.type";

export function InteractivePickDisplay({
  event,
  isATS = false,
  onPick,
  selectedTeamId,
}: {
  event: PopulatedEventResponse;
  isATS?: boolean;
  onPick: (teamId: string) => void;
  selectedTeamId?: string;
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

  return (
    <div className="rounded-xl bg-card p-3 border border-border shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold tracking-wide">{matchup}</span>
        <span className="text-xs text-muted-foreground font-semibold uppercase">
          {status}
        </span>
      </div>
      <div className="flex flex-col md:flex-row gap-2">
        <InteractivePickTeamBox
          team={awayTeam}
          selected={selectedTeamId === awayTeam.id}
          onClick={() =>
            onPick(selectedTeamId === awayTeam.id ? "" : awayTeam.id)
          }
          side="left"
          isATS={isATS}
          odds={event.odds?.spreadAway || undefined}
        />
        <InteractivePickTeamBox
          team={homeTeam}
          selected={selectedTeamId === homeTeam.id}
          onClick={() =>
            onPick(selectedTeamId === homeTeam.id ? "" : homeTeam.id)
          }
          side="right"
          isATS={isATS}
          odds={event.odds?.spreadHome || undefined}
        />
      </div>
      {isATS && event.odds?.sportsbook && (
        <div className="text-xs italic text-muted-foreground text-right mt-2">
          Odds presented by{" "}
          <span className="font-semibold">{event.odds.sportsbook.name}</span>
        </div>
      )}
    </div>
  );
}
