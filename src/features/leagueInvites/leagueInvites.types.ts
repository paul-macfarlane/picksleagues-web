import { LEAGUE_MEMBER_ROLES } from "../leagueMembers/leagueMembers.types";
import z from "zod";
import type { ProfileResponse } from "../profiles/profiles.types";
import type { PopulatedLeagueResponse } from "@/features/leagues/leagues.types";

// constants

export enum LEAGUE_INVITE_TYPES {
  DIRECT = "direct",
  LINK = "link",
}

export enum LEAGUE_INVITE_STATUSES {
  PENDING = "pending",
  ACCEPTED = "accepted",
  DECLINED = "declined",
}

export const MIN_LEAGUE_INVITE_USES = 1;
export const MAX_LEAGUE_INVITE_USES = 10;

export const MIN_LEAGUE_INVITE_EXPIRATION_DAYS = 1;
export const MAX_LEAGUE_INVITE_EXPIRATION_DAYS = 30;
export const DEFAULT_LEAGUE_INVITE_EXPIRATION_DAYS = 7;

export enum LEAGUE_INVITE_INCLUDES {
  INVITEE = "invitee",
  LEAGUE = "league",
  LEAGUE_TYPE = "league.leagueType",
}

// api types

export type LeagueInviteResponse = {
  id: string;
  token: string;
  leagueId: string;
  inviteeId: string | null;
  role: LEAGUE_MEMBER_ROLES;
  type: LEAGUE_INVITE_TYPES;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
};

export type PopulatedLeagueInviteResponse = LeagueInviteResponse & {
  invitee?: ProfileResponse;
  league?: PopulatedLeagueResponse;
};

// schemas

export const CreateLeagueInviteObjectSchema = z.object({
  leagueId: z.string().trim().uuid(),
  role: z.enum([LEAGUE_MEMBER_ROLES.COMMISSIONER, LEAGUE_MEMBER_ROLES.MEMBER]),
  type: z.enum([LEAGUE_INVITE_TYPES.DIRECT, LEAGUE_INVITE_TYPES.LINK]),
  expiresInDays: z
    .number()
    .int()
    .min(MIN_LEAGUE_INVITE_EXPIRATION_DAYS, {
      message: `Expires in days must be at least ${MIN_LEAGUE_INVITE_EXPIRATION_DAYS}`,
    })
    .max(MAX_LEAGUE_INVITE_EXPIRATION_DAYS, {
      message: `Expires in days must be at most ${MAX_LEAGUE_INVITE_EXPIRATION_DAYS}`,
    }),

  // Direct invite only
  inviteeId: z.string().trim().optional(),
});

export const CreateLeagueInviteSchema =
  CreateLeagueInviteObjectSchema.superRefine((data, ctx) => {
    // if the invite type is direct, then inviteeId is required
    if (data.type === LEAGUE_INVITE_TYPES.DIRECT) {
      if (!data.inviteeId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Invitee ID is required for direct invites`,
          path: ["inviteeId"],
        });
      }
    }
    return true;
  });

export const RespondToLeagueInviteSchema = z.object({
  response: z.enum([
    LEAGUE_INVITE_STATUSES.ACCEPTED,
    LEAGUE_INVITE_STATUSES.DECLINED,
  ]),
});
