import type { ProfileResponse } from "../profiles/profiles.types";

export enum STANDINGS_INCLUDES {
  PROFILE = "profile",
}

// api types

export type StandingsResponse = {
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  leagueId: string;
  seasonId: string;
  points: number;
  rank: number;
  metadata: unknown;
};

type PickEmStandingsMetadata = {
  wins: number;
  losses: number;
  pushes: number;
};

export type PickEmStandingsResponse = StandingsResponse & {
  metadata: PickEmStandingsMetadata;
};

export type PopulatedStandingsResponse = StandingsResponse & {
  profile?: ProfileResponse;
};

export type PopulatedPickEmStandingsResponse = PickEmStandingsResponse & {
  profile?: ProfileResponse;
};
