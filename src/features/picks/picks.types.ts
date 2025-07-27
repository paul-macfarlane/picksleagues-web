import type { PopulatedEventResponse } from "../events/events.type";
import type { ProfileResponse } from "../profiles/profiles.types";
import type { TeamResponse } from "../teams/teams.types";

// constants

export enum PICK_INCLUDES {
  PROFILE = "profile",
  TEAM = "team",
  EVENT = "event",
  EVENT_HOME_TEAM = "event.homeTeam",
  EVENT_AWAY_TEAM = "event.awayTeam",
  EVENT_LIVE_SCORE = "event.liveScore",
  EVENT_OUTCOME = "event.outcome",
  EVENT_ODDS = "event.odds",
  EVENT_ODDS_SPORTSBOOK = "event.odds.sportsbook",
}

// api types
export type PickResponse = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  leagueId: string;
  userId: string;
  eventId: string;
  teamId: string;
  spread: string | null;
};

export type PopulatedPickResponse = PickResponse & {
  profile?: ProfileResponse;
  team?: TeamResponse;
  event?: PopulatedEventResponse;
};
