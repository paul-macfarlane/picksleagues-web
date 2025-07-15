// constants

export enum LEAGUE_TYPE_NAMES {
  PICK_EM = "Pick'Em",
}

export enum LEAGUE_TYPE_SLUGS {
  PICK_EM = "pick-em",
}

// api types

export type LeagueTypeResponse = {
  id: string;
  name: LEAGUE_TYPE_NAMES;
  slug: LEAGUE_TYPE_SLUGS;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  sportLeagueId: string;
};

// schemas
