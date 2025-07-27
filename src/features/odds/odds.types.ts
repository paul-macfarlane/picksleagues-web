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
  spreadHome: string | null;
  spreadAway: string | null;
  moneylineHome: number | null;
  moneylineAway: number | null;
  total: string | null;
};

export type PopulatedOddsResponse = OddsResponse & {
  sportsbook?: SportsbookResponse;
};
