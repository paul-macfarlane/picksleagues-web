import type { PopulatedOddsResponse } from "../odds/odds.types";
import type { TeamResponse } from "../teams/teams.types";

// constants
export enum EVENT_TYPES {
  GAME = "game",
  //   MATCH = "match",
  //   TOURNAMENT = "tournament",
}

export enum LIVE_SCORE_STATUSES {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  FINAL = "final",
}

export enum EVENT_INCLUDES {
  LIVE_SCORES = "liveScores",
  OUTCOMES = "outcomes",
  ODDS = "odds",
  ODDS_SPORTSBOOK = "odds.sportsbook",
  HOME_TEAM = "homeTeam",
  AWAY_TEAM = "awayTeam",
}

// api types

export type LiveScoreResponse = {
  createdAt: Date;
  updatedAt: Date;
  status: LIVE_SCORE_STATUSES;
  eventId: string;
  homeScore: number;
  awayScore: number;
  period: number;
  clock: string;
};

export type OutcomeResponse = {
  createdAt: Date;
  updatedAt: Date;
  eventId: string;
  homeScore: number;
  awayScore: number;
};

export type EventResponse = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  type: EVENT_TYPES;
  phaseId: string;
  startTime: Date;
  homeTeamId: string;
  awayTeamId: string;
};

export type PopulatedEventResponse = EventResponse & {
  liveScore?: LiveScoreResponse;
  outcome?: OutcomeResponse;
  odds?: PopulatedOddsResponse;
  homeTeam?: TeamResponse;
  awayTeam?: TeamResponse;
};
