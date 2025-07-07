import { z } from "zod";
import { API_BASE, authenticatedFetch } from ".";
import { LEAGUE_TYPE_SLUGS } from "./leagueTypes";

export const pickEmLeagueSettingsSchema = z.object({
  picksPerPhase: z.number().min(1).max(16),
});

export type PickEmLeagueSettings = z.infer<typeof pickEmLeagueSettingsSchema>;

export const MIN_LEAGUE_NAME_LENGTH = 3;
export const MAX_LEAGUE_NAME_LENGTH = 50;

export const MIN_LEAGUE_SIZE = 2;
export const MAX_LEAGUE_SIZE = 20;

export enum LEAGUE_VISIBILITIES {
  //   PUBLIC = "public", public will be supported later
  PRIVATE = "private",
}

export enum LEAGUE_TYPES {
  PICK_EM = "pick_em",
}

// todo add better error messages here
export const createLeagueSchema = z.object({
  name: z.string().min(MIN_LEAGUE_NAME_LENGTH).max(MAX_LEAGUE_NAME_LENGTH),
  image: z.union([z.string().url().optional(), z.literal(""), z.null()]),
  leagueTypeSlug: z.enum([LEAGUE_TYPE_SLUGS.PICK_EM]),
  startPhaseTemplateId: z.string().min(1).uuid(),
  endPhaseTemplateId: z.string().min(1).uuid(),
  visibility: z.enum([LEAGUE_VISIBILITIES.PRIVATE]),
  size: z.number().min(MIN_LEAGUE_SIZE).max(MAX_LEAGUE_SIZE),
});

export type CreateLeague = z.infer<typeof createLeagueSchema>;

export const createPickEmLeagueSchema = createLeagueSchema.extend({
  settings: pickEmLeagueSettingsSchema,
});

export type CreatePickEmLeague = z.infer<typeof createPickEmLeagueSchema>;

export enum LEAGUE_MEMBER_ROLES {
  COMMISSIONER = "commissioner",
  MEMBER = "member",
}

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
  settings: PickEmLeagueSettings;
};

export async function createLeague<T extends CreateLeague>(
  league: T,
): Promise<
  T extends CreatePickEmLeague ? PickEmLeagueResponse : LeagueResponse
> {
  return await authenticatedFetch<
    T extends CreatePickEmLeague ? PickEmLeagueResponse : LeagueResponse
  >(`${API_BASE}/v1/leagues`, {
    method: "POST",
    body: JSON.stringify(league),
  });
}
