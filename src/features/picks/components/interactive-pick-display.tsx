import { InteractivePickTeamBox } from "./interactive-pick-team-box";
import type { PopulatedEventResponse } from "../../events/events.type";
import type { PopulatedPickResponse } from "../picks.types";
import type { TeamResponse } from "../../teams/teams.types";

export function InteractivePickDisplay({
  event,
  userPick,
  isATS = false,
  onPick,
}: {
  event: PopulatedEventResponse;
  userPick?: PopulatedPickResponse;
  isATS?: boolean;
  onPick: (teamId: string) => void;
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
    ? "LIVE"
    : event.outcome
      ? "FINAL"
      : "SCHEDULED";

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
          selected={userPick?.teamId === awayTeam.id}
          onClick={() =>
            onPick(userPick?.teamId === awayTeam.id ? "" : awayTeam.id)
          }
          side="left"
          isATS={isATS}
          odds={event.odds?.spreadAway || undefined}
        />
        <InteractivePickTeamBox
          team={homeTeam}
          selected={userPick?.teamId === homeTeam.id}
          onClick={() =>
            onPick(userPick?.teamId === homeTeam.id ? "" : homeTeam.id)
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
