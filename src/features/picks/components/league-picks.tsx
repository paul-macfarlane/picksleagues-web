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
      {
        id: 1,
        matchup: "IND @ CIN",
        home: {
          abbr: "CIN",
          logoUrl: "/assets/cin.svg",
          score: 27,
        },
        away: {
          abbr: "IND",
          logoUrl: "/assets/ind.svg",
          score: 4,
        },
        pick: "CIN",
        result: "WIN",
        status: "Final",
      },
      {
        id: 2,
        matchup: "PHI @ NO",
        home: {
          abbr: "NO",
          logoUrl: "/assets/no.svg",
          score: 0,
        },
        away: {
          abbr: "PHI",
          logoUrl: "/assets/phi.svg",
          score: 16,
        },
        pick: "PHI",
        result: "WIN",
        status: "Final",
      },
      {
        id: 3,
        matchup: "HOU @ MIA",
        home: {
          abbr: "MIA",
          logoUrl: "/assets/mia.svg",
          score: 15,
        },
        away: {
          abbr: "HOU",
          logoUrl: "/assets/hou.svg",
          score: 12,
        },
        pick: "HOU",
        result: "LOSS",
        status: "Final",
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
                result={pick.result as "WIN" | "LOSS" | null}
                status={pick.status}
                badge={
                  pick.result ? (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${pick.result === "WIN" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
                    >
                      {pick.result === "WIN" ? "Win" : "Loss"}
                    </span>
                  ) : null
                }
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
