import type { TeamResponse } from "../../teams/teams.types";

export function InteractivePickTeamBox({
  team,
  selected,
  onClick,
  side,
  isATS,
  odds,
}: {
  team: TeamResponse;
  selected: boolean;
  onClick: () => void;
  side: "left" | "right";
  isATS?: boolean;
  odds?: string;
}) {
  // Format odds to add + for positive spreads and trim extra 0s
  const formatOdds = (odds: string) => {
    const num = parseFloat(odds);
    if (isNaN(num)) return odds;
    const trimmedOdds = num.toString(); // This removes trailing 0s
    return num > 0 ? `+${trimmedOdds}` : trimmedOdds;
  };

  const displayText =
    isATS && odds
      ? `${team.abbreviation} ${formatOdds(odds)}`
      : team.abbreviation;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 flex items-center rounded-lg border bg-muted px-4 py-3 min-w-0 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary ${
        selected
          ? "border-primary ring-2 ring-primary bg-primary/10"
          : "border-border hover:border-primary/60"
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
                className={`font-bold text-lg ${
                  selected ? "text-white" : "text-muted-foreground"
                }`}
              >
                {displayText}
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
              src={team.imageLight || "/assets/placeholder.svg"}
              alt={team.abbreviation}
              className="w-8 h-8 object-contain"
            />
            <span
              className={`font-bold text-lg ${
                selected ? "text-white" : "text-muted-foreground"
              }`}
            >
              {displayText}
            </span>
          </div>
          <span className="hidden md:block text-lg font-bold text-white min-w-[2ch] text-right"></span>
          <span className="block md:hidden text-lg font-bold text-white min-w-[2ch] text-right ml-auto"></span>
        </>
      )}
    </button>
  );
}
