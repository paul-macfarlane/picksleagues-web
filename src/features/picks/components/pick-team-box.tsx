import type { PickTeam } from "../picks.types";

export function PickTeamBox({
  team,
  picked,
  result,
  score,
  side,
  isATS,
}: {
  team: PickTeam;
  picked: boolean;
  result: "WIN" | "LOSS" | "TIE" | null;
  score: number | null;
  side: "left" | "right";
  isATS?: boolean;
}) {
  let borderColor = "border-border";
  if (picked) {
    if (result === "WIN") {
      borderColor = "border-green-500";
    } else if (result === "LOSS") {
      borderColor = "border-red-500";
    } else if (result === "TIE") {
      borderColor = "border-yellow-400";
    }
  }

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
                className={`font-bold text-lg ${
                  picked ? "text-white" : "text-muted-foreground"
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
                  picked ? "text-white" : "text-muted-foreground"
                }`}
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
              className={`font-bold text-lg ${
                picked ? "text-white" : "text-muted-foreground"
              }`}
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
