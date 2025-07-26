export type PickTeam = {
  abbr: string;
  logoUrl: string;
  score: number | null;
  odds?: string; // e.g. '+8' or '-8', only for ATS
};

export type Week = { id: number; label: string; isFuture?: boolean };

export type Game = {
  id: number;
  matchup: string;
  home: PickTeam;
  away: PickTeam;
  pick: string | null;
  result: "WIN" | "LOSS" | "TIE" | null;
  status: string;
  isATS: boolean;
  sportsbook?: string;
};

export type UserPick = { [gameId: number]: string };

export type Member = {
  id: string;
  username: string;
  displayName: string;
  picks: Game[];
};

export type PickDisplayProps = {
  matchup: string;
  home: PickTeam;
  away: PickTeam;
  pick: string;
  result: "WIN" | "LOSS" | "TIE" | null;
  status: string;
  badge?: React.ReactNode;
  isATS?: boolean;
  sportsbook?: string;
};
