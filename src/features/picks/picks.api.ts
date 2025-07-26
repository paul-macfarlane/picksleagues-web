import type { Game, Member } from "./picks.types";

export const mockApi = {
  hasMadePicksThisWeek: false, // toggle to true to test read-only
  requiredPicks: 3,
  games: [
    // 1) Scheduled, not yet started (ATS)
    {
      id: 1,
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
      pick: null,
      result: null,
      status: "SCHEDULED",
      isATS: true,
      sportsbook: "FAKE ESPN BET",
    },
    // 2) Scheduled, not yet started (ATS)
    {
      id: 2,
      home: {
        abbr: "MIA",
        logoUrl: "/assets/mia.svg",
        score: null,
        odds: "-3",
      },
      away: {
        abbr: "HOU",
        logoUrl: "/assets/hou.svg",
        score: null,
        odds: "+3",
      },
      pick: null,
      result: null,
      status: "SCHEDULED",
      isATS: true,
      sportsbook: "FAKE ESPN BET",
    },
    // 3) Scheduled, not yet started (straight up)
    {
      id: 3,
      home: { abbr: "GB", logoUrl: "/assets/gb.svg", score: null },
      away: { abbr: "MIN", logoUrl: "/assets/min.svg", score: null },
      pick: null,
      result: null,
      status: "SCHEDULED",
      isATS: false,
      sportsbook: undefined,
    },
    // 4) In progress (should not be pickable)
    {
      id: 4,
      home: { abbr: "DAL", logoUrl: "/assets/dal.svg", score: 7 },
      away: { abbr: "NYG", logoUrl: "/assets/nyg.svg", score: 21 },
      pick: null,
      result: null,
      status: "IN_PROGRESS",
      isATS: false,
      sportsbook: undefined,
    },
    // 5) Completed (should not be pickable)
    {
      id: 5,
      home: { abbr: "SEA", logoUrl: "/assets/sea.svg", score: 10 },
      away: { abbr: "SF", logoUrl: "/assets/sf.svg", score: 17 },
      pick: "SEA",
      result: "LOSS",
      status: "FINAL",
      isATS: false,
      sportsbook: undefined,
    },
  ] as Game[],
};

export const mockMembers: Member[] = [
  {
    id: "1",
    username: "testuser1",
    displayName: "Test User 1",
    picks: [
      {
        id: 1,
        matchup: "ARI @ PIT",
        home: {
          abbr: "PIT",
          logoUrl: "/assets/pit.svg",
          score: 24,
          odds: "-8",
        },
        away: {
          abbr: "ARI",
          logoUrl: "/assets/ari.svg",
          score: 10,
          odds: "+8",
        },
        pick: "PIT",
        result: "WIN",
        status: "FINAL",
        isATS: true,
        sportsbook: "FAKE ESPN BET",
      },
      {
        id: 2,
        matchup: "HOU @ MIA",
        home: {
          abbr: "MIA",
          logoUrl: "/assets/mia.svg",
          score: 30,
          odds: "-3",
        },
        away: {
          abbr: "HOU",
          logoUrl: "/assets/hou.svg",
          score: 15,
          odds: "+3",
        },
        pick: "MIA",
        result: "WIN",
        status: "FINAL",
        isATS: true,
        sportsbook: "FAKE ESPN BET",
      },
    ],
  },
  {
    id: "2",
    username: "anotheruser",
    displayName: "Another User",
    picks: [],
  },
];
