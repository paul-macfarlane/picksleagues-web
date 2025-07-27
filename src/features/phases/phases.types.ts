import type { PopulatedEventResponse } from "../events/events.type";

// constants

export enum PHASE_INCLUDES {
  PREVIOUS_PHASE = "previousPhase",
  NEXT_PHASE = "nextPhase",
  EVENTS = "events",
  EVENTS_LIVE_SCORES = "events.liveScores",
  EVENTS_OUTCOMES = "events.outcomes",
  EVENTS_ODDS = "events.odds",
  EVENTS_ODDS_SPORTSBOOK = "events.odds.sportsbook",
  EVENTS_HOME_TEAM = "events.homeTeam",
  EVENTS_AWAY_TEAM = "events.awayTeam",
}

// api types

export type PhaseResponse = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  startDate: Date;
  endDate: Date;
  seasonId: string;
  sequence: number;
  phaseTemplateId: string;
};

export type PopulatedPhaseResponse = PhaseResponse & {
  previousPhase?: PhaseResponse;
  nextPhase?: PhaseResponse;
  events?: PopulatedEventResponse[];
};
