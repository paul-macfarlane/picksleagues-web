import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { PickDisplay } from "./pick-display";

// Mock data
const mockMembers = [
  {
    id: 1,
    username: "pmac1234",
    displayName: "pauly mac",
    avatarUrl: "",
    weekRank: 2,
    seasonRank: 5,
    weekPoints: 2,
    seasonPoints: 7,
    picks: [
      // 1) Scheduled, not yet started (ATS)
      {
        id: 1,
        matchup: "ARI @ PIT",
        home: {
          abbr: "PIT",
          logoUrl: "/assets/pit.svg",
          score: null,
          odds: "-8",
        },
        away: {
          abbr: "ARI",
          logoUrl: "/assets/ari.svg",
          score: null,
          odds: "+8",
        },
        pick: "ARI",
        result: null,
        status: "SCHEDULED",
        isATS: true,
        sportsbook: "FAKE ESPN BET",
      },
      // 2) In progress (ATS)
      {
        id: 2,
        matchup: "ARI @ PIT",
        home: {
          abbr: "PIT",
          logoUrl: "/assets/pit.svg",
          score: 30,
          odds: "-8",
        },
        away: { abbr: "ARI", logoUrl: "/assets/ari.svg", score: 3, odds: "+8" },
        pick: "ARI",
        result: null,
        status: "IN_PROGRESS",
        isATS: true,
        sportsbook: "FAKE ESPN BET",
      },
      // 3) Completed, picked correctly (ATS)
      {
        id: 3,
        matchup: "HOU @ MIA",
        home: {
          abbr: "MIA",
          logoUrl: "/assets/mia.svg",
          score: 15,
          odds: "-3",
        },
        away: {
          abbr: "HOU",
          logoUrl: "/assets/hou.svg",
          score: 20,
          odds: "+3",
        },
        pick: "HOU",
        result: "WIN",
        status: "FINAL",
        isATS: true,
        sportsbook: "FAKE ESPN BET",
      },
      // 4) Completed, picked incorrectly (ATS)
      {
        id: 4,
        matchup: "ARI @ PIT",
        home: {
          abbr: "PIT",
          logoUrl: "/assets/pit.svg",
          score: 30,
          odds: "-8",
        },
        away: { abbr: "ARI", logoUrl: "/assets/ari.svg", score: 3, odds: "+8" },
        pick: "ARI",
        result: "LOSS",
        status: "FINAL",
        isATS: true,
        sportsbook: "FAKE ESPN BET",
      },
      // 5) Completed, tied (straight up)
      {
        id: 5,
        matchup: "GB @ MIN",
        home: { abbr: "GB", logoUrl: "/assets/gb.svg", score: 20 },
        away: { abbr: "MIN", logoUrl: "/assets/min.svg", score: 20 },
        pick: "GB",
        result: "TIE",
        status: "FINAL",
        isATS: false,
        sportsbook: undefined,
      },
    ],
  },
  {
    id: 2,
    username: "testuser15",
    displayName: "Test15 User15",
    avatarUrl: "",
    weekRank: 1,
    seasonRank: 3,
    weekPoints: 3,
    seasonPoints: 9,
    picks: [],
  },
];

export function LeaguePicks() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold mb-2">League Picks</h2>
      {mockMembers.map((member) => (
        <MemberPicksCard key={member.id} member={member} />
      ))}
    </div>
  );
}

function MemberPicksCard({ member }: { member: (typeof mockMembers)[0] }) {
  const [showPicks, setShowPicks] = useState(true);
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
                pick={pick.pick}
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
