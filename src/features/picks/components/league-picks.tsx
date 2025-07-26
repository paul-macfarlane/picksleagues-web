import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { PickDisplay } from "./pick-display";
import { WeekSwitcher } from "./week-switcher";
import { Route } from "@/routes/_authenticated/football/pick-em/$leagueId.league-picks";
import { getValidWeek, weeks, currentWeekId } from "../picks.utils";
import { mockMembers } from "../picks.api";
import type { Member } from "../picks.types";

export function LeaguePicks() {
  const { week } = Route.useSearch();
  const navigate = Route.useNavigate();
  const selectedWeekId = getValidWeek(week);

  // For demo, assign all picks to week 5, and no picks to other weeks
  const members: Member[] = selectedWeekId === currentWeekId ? mockMembers : [];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold mb-2">League Picks</h2>
      <WeekSwitcher
        weeks={weeks}
        selectedWeekId={selectedWeekId}
        onSelect={(id) => navigate({ search: { week: id } })}
        disableFuture={false}
      />
      {members.map((member) => (
        <MemberPicksCard key={member.id} member={member} />
      ))}
      {members.length === 0 && (
        <div className="text-muted-foreground text-center py-8">
          No picks for this week.
        </div>
      )}
    </div>
  );
}

function MemberPicksCard({ member }: { member: Member }) {
  const [showPicks, setShowPicks] = useState(false);
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-lg">
            {member.username[0].toUpperCase()}
          </div>
          <div>
            <div className="font-semibold leading-tight">{member.username}</div>
            <div className="text-xs text-muted-foreground leading-tight">
              {member.displayName}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <button
          className="text-sm text-muted-foreground hover:underline mb-3"
          onClick={() => setShowPicks((v) => !v)}
        >
          {showPicks ? "Hide Picks" : "Show Picks"}
        </button>
        {showPicks && member.picks.length > 0 && (
          <div className="space-y-4">
            {member.picks.map((pick) => (
              <PickDisplay
                key={pick.id}
                matchup={pick.matchup}
                home={pick.home}
                away={pick.away}
                pick={pick.pick ?? ""}
                result={pick.result as "WIN" | "LOSS" | "TIE" | null}
                status={pick.status}
                isATS={pick.isATS}
                sportsbook={pick.sportsbook}
              />
            ))}
          </div>
        )}
        {showPicks && member.picks.length === 0 && (
          <div className="text-muted-foreground text-sm py-4 text-center">
            No picks for this week.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
