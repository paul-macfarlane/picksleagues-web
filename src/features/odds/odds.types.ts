import type { SportsbookResponse } from "../sportsBooks/sportsBooks.types";

// constants

export enum ODDS_INCLUDES {
  SPORTSBOOK = "sportsbook",
}

// api types

export type OddsResponse = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  metadata: unknown;
  eventId: string;
  sportsbookId: string;
  spreadHome: number | null;
  spreadAway: number | null;
  moneylineHome: number | null;
  moneylineAway: number | null;
  total: number | null;
};

export type PopulatedOddsResponse = OddsResponse & {
  sportsbook?: SportsbookResponse;
};
