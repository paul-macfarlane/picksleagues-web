import type { PickTeam } from "../picks.types";

export function InteractivePickTeamBox({
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
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 flex items-center rounded-lg border bg-muted px-4 py-3 min-w-0 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-blue-500 ${
        selected
          ? "border-blue-500 ring-2 ring-blue-500 bg-blue-900/50"
          : "border-border hover:border-blue-400"
      }`}
      tabIndex={0}
    >
      {/* Away team (left) */}
      {side === "left" && (
        <>
          <span className="hidden md:block text-lg font-bold text-white min-w-[2ch] text-left"></span>
          <div className="hidden md:flex flex-1 items-center justify-between w-full">
            <span></span>
            <div className="flex items-center gap-2 ml-auto">
              <span
                className={`font-bold text-lg ${
                  selected ? "text-white" : "text-muted-foreground"
                }`}
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
                className={`font-bold text-lg ${
                  selected ? "text-white" : "text-muted-foreground"
                }`}
              >
                {team.abbr}
                {isATS && team.odds ? ` ${team.odds}` : ""}
              </span>
            </div>
            <span className="text-lg font-bold text-white min-w-[2ch] text-right ml-auto"></span>
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
              className={`font-bold text-lg ${
                selected ? "text-white" : "text-muted-foreground"
              }`}
            >
              {team.abbr}
              {isATS && team.odds ? ` ${team.odds}` : ""}
            </span>
          </div>
          <span className="hidden md:block text-lg font-bold text-white min-w-[2ch] text-right"></span>
          <span className="block md:hidden text-lg font-bold text-white min-w-[2ch] text-right ml-auto"></span>
        </>
      )}
    </button>
  );
}
