// constants

import { z } from "zod";
import type { ProfileResponse } from "../profiles/profiles.types";

export enum LEAGUE_MEMBER_ROLES {
  COMMISSIONER = "commissioner",
  MEMBER = "member",
}

export enum LEAGUE_MEMBER_INCLUDES {
  PROFILE = "profile",
}

// api types

export type LeagueMemberResponse = {
  createdAt: Date;
  updatedAt: Date;
  leagueId: string;
  userId: string;
  role: LEAGUE_MEMBER_ROLES;
};

export type PopulatedLeagueMemberResponse = LeagueMemberResponse & {
  profile?: ProfileResponse;
};

// schemas

export const UpdateLeagueMemberSchema = z.object({
  role: z.enum([LEAGUE_MEMBER_ROLES.COMMISSIONER, LEAGUE_MEMBER_ROLES.MEMBER]),
});
