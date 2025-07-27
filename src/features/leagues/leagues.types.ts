import z from "zod";
import {
  LEAGUE_TYPE_SLUGS,
  type LeagueTypeResponse,
} from "../leagueTypes/leagueTypes.types";
import type { LeagueMemberResponse } from "../leagueMembers/leagueMembers.types";

// constants

export enum LEAGUE_INCLUDES {
  IS_IN_SEASON = "is_in_season",
  LEAGUE_TYPE = "league_type",
  MEMBERS = "members",
}

export const MIN_PICKS_PER_PHASE = 1;
export const MAX_PICKS_PER_PHASE = 16;

export enum PICK_EM_PICK_TYPES {
  SPREAD = "spread",
  STRAIGHT_UP = "straight-up",
}

export const PICK_EM_PICK_TYPE_LABELS = {
  [PICK_EM_PICK_TYPES.STRAIGHT_UP]: "Straight Up",
  [PICK_EM_PICK_TYPES.SPREAD]: "Against the Spread",
};

export const MIN_LEAGUE_NAME_LENGTH = 3;
export const MAX_LEAGUE_NAME_LENGTH = 50;

export const MIN_LEAGUE_SIZE = 2;
export const DEFAULT_LEAGUE_SIZE = 10;
export const MAX_LEAGUE_SIZE = 20;

export enum LEAGUE_VISIBILITIES {
  //   PUBLIC = "public", public will be supported later
  PRIVATE = "private",
}

// api types

export type LeagueResponse = {
  id: string;
  name: string;
  image: string | null;
  leagueTypeId: string;
  startPhaseTemplateId: string;
  endPhaseTemplateId: string;
  visibility: LEAGUE_VISIBILITIES;
  size: number;
  settings: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type PickEmLeagueResponse = LeagueResponse & {
  settings: z.infer<typeof PickEmLeagueSettingsSchema>;
};

export type PopulatedLeagueResponse = LeagueResponse & {
  isInSeason?: boolean;
  leagueType?: LeagueTypeResponse;
  members?: LeagueMemberResponse[];
};

export type PopulatedPickEmLeagueResponse = PickEmLeagueResponse & {
  isInSeason?: boolean;
  leagueType?: LeagueTypeResponse;
  members?: LeagueMemberResponse[];
};

// schemas

export const PickEmLeagueSettingsSchema = z.object({
  picksPerPhase: z
    .number({
      required_error: "Required",
      invalid_type_error: "Required", // better aligns with when field is empty
    })
    .int({
      message: "Must be an integer",
    })
    .min(MIN_PICKS_PER_PHASE, {
      message: `Must be at least ${MIN_PICKS_PER_PHASE}`,
    })
    .max(MAX_PICKS_PER_PHASE, {
      message: `Must be at most ${MAX_PICKS_PER_PHASE}`,
    }),
  pickType: z.enum([PICK_EM_PICK_TYPES.STRAIGHT_UP, PICK_EM_PICK_TYPES.SPREAD]),
});

export const CreateLeagueSchema = z.object({
  name: z
    .string()
    .min(MIN_LEAGUE_NAME_LENGTH, {
      message: `Must be at least ${MIN_LEAGUE_NAME_LENGTH} characters`,
    })
    .max(MAX_LEAGUE_NAME_LENGTH, {
      message: `Must be at most ${MAX_LEAGUE_NAME_LENGTH} characters`,
    })
    .trim(),
  image: z.union([z.string().trim().url().optional(), z.literal(""), z.null()]),
  // .transform((val) => val?.trim() ?? null), // transform breaks form types, so turning off (backend handles it)
  leagueTypeSlug: z.enum([LEAGUE_TYPE_SLUGS.PICK_EM]),
  startPhaseTemplateId: z.string().trim().uuid(),
  endPhaseTemplateId: z.string().trim().uuid(),
  visibility: z.enum([LEAGUE_VISIBILITIES.PRIVATE]),
  size: z
    .number({
      required_error: "Required",
      invalid_type_error: "Required", // better aligns with when field is empty
    })
    .int({
      message: "Must be an integer",
    })
    .min(MIN_LEAGUE_SIZE, {
      message: `Must be at least ${MIN_LEAGUE_SIZE}`,
    })
    .max(MAX_LEAGUE_SIZE, {
      message: `Must be at most ${MAX_LEAGUE_SIZE}`,
    }),
});

export const CreatePickEmLeagueSchema = CreateLeagueSchema.extend({
  settings: PickEmLeagueSettingsSchema,
});

export const UpdateLeagueSchema = CreateLeagueSchema.pick({
  name: true,
  image: true,
  startPhaseTemplateId: true,
  endPhaseTemplateId: true,
  visibility: true,
  size: true,
}).partial();

export const UpdatePickEmLeagueSchema = UpdateLeagueSchema.extend({
  settings: PickEmLeagueSettingsSchema,
});
