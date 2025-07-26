import { useState } from "react";
import { PickDisplay } from "./pick-display";
import { WeekSwitcher } from "./week-switcher";
import { Route } from "@/routes/_authenticated/football/pick-em/$leagueId.my-picks";
import { getValidWeek, weeks, currentWeekId } from "../picks.utils";
import { mockApi } from "../picks.api";
import { InteractivePickDisplay } from "./interactive-pick-display";
import type { Game } from "../picks.types";

export function MyPicks() {
  const { week } = Route.useSearch();
  const navigate = Route.useNavigate();
  const selectedWeekId = getValidWeek(week);
  const isCurrentWeek = selectedWeekId === currentWeekId;

  // For demo, assign all games to week 5, and no games to other weeks
  const games: Game[] = selectedWeekId === 5 ? mockApi.games : [];

  // If user has made picks, show read-only
  if (mockApi.hasMadePicksThisWeek) {
    return (
      <div>
        <WeekSwitcher
          weeks={weeks}
          selectedWeekId={selectedWeekId}
          onSelect={(id) => navigate({ search: { week: id } })}
          disableFuture={false}
        />
        <div className="space-y-6">
          {games
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
      </div>
    );
  }

  // Else, allow user to make picks for scheduled games (only for current week)
  const pickableGames = isCurrentWeek
    ? games.filter((g) => g.status === "SCHEDULED")
    : [];
  const [userPicks, setUserPicks] = useState<{ [gameId: number]: string }>({});
  const canSubmit =
    Object.keys(userPicks).length ===
    Math.min(mockApi.requiredPicks, pickableGames.length);

  if (!isCurrentWeek && games.length === 0) {
    return (
      <div>
        <WeekSwitcher
          weeks={weeks}
          selectedWeekId={selectedWeekId}
          onSelect={(id) => navigate({ search: { week: id } })}
          disableFuture={false}
        />
        <div className="text-muted-foreground text-center py-8">
          No games available for this week.
        </div>
      </div>
    );
  }

  if (pickableGames.length === 0) {
    return (
      <div>
        <WeekSwitcher
          weeks={weeks}
          selectedWeekId={selectedWeekId}
          onSelect={(id) => navigate({ search: { week: id } })}
          disableFuture={false}
        />
        <div className="text-muted-foreground text-center py-8">
          No games available to pick this week.
        </div>
      </div>
    );
  }

  return (
    <div>
      <WeekSwitcher
        weeks={weeks}
        selectedWeekId={selectedWeekId}
        onSelect={(id) => navigate({ search: { week: id } })}
        disableFuture={false}
      />
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
    </div>
  );
}
