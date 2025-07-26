import { InteractivePickTeamBox } from "./interactive-pick-team-box";
import type { PickTeam } from "../picks.types";

export function InteractivePickDisplay({
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
    <div className="rounded-xl bg-card p-3 border border-border shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold tracking-wide">{matchup}</span>
        <span className="text-xs text-muted-foreground font-semibold uppercase">
          {status}
        </span>
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
