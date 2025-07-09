import { z } from "zod";
import { API_BASE, authenticatedFetch } from ".";
import { LEAGUE_TYPE_SLUGS } from "./leagueTypes";
import { useMutation, queryOptions } from "@tanstack/react-query";
import type { ProfileResponse } from "./profile";

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

export const pickEmLeagueSettingsSchema = z.object({
  picksPerPhase: z
    .number()
    .int()
    .min(MIN_PICKS_PER_PHASE, {
      message: `Picks per week must be at least ${MIN_PICKS_PER_PHASE}`,
    })
    .max(MAX_PICKS_PER_PHASE, {
      message: `Picks per week must be at most ${MAX_PICKS_PER_PHASE}`,
    }),
  pickType: z.enum([PICK_EM_PICK_TYPES.STRAIGHT_UP, PICK_EM_PICK_TYPES.SPREAD]),
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

export const createLeagueSchema = z.object({
  name: z
    .string()
    .min(MIN_LEAGUE_NAME_LENGTH, {
      message: `Name must be at least ${MIN_LEAGUE_NAME_LENGTH} characters`,
    })
    .max(MAX_LEAGUE_NAME_LENGTH, {
      message: `Name must be at most ${MAX_LEAGUE_NAME_LENGTH} characters`,
    })
    .trim(),
  image: z.union([z.string().url().optional(), z.literal(""), z.null()]),
  // .transform((val) => val?.trim() ?? null), // transform breaks form types, so turning off (backend handles it)
  leagueTypeSlug: z.enum([LEAGUE_TYPE_SLUGS.PICK_EM]),
  startPhaseTemplateId: z.string().min(1).uuid(),
  endPhaseTemplateId: z.string().min(1).uuid(),
  visibility: z.enum([LEAGUE_VISIBILITIES.PRIVATE]),
  size: z
    .number()
    .int()
    .min(MIN_LEAGUE_SIZE, {
      message: `Size must be at least ${MIN_LEAGUE_SIZE}`,
    })
    .max(MAX_LEAGUE_SIZE, {
      message: `Size must be at most ${MAX_LEAGUE_SIZE}`,
    }),
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

export type LeagueMemberResponse = {
  createdAt: Date;
  updatedAt: Date;
  leagueId: string;
  userId: string;
  role: LEAGUE_MEMBER_ROLES;
};

export type LeagueMemberWithProfileResponse = LeagueMemberResponse & {
  profile: ProfileResponse;
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
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(league),
  });
}

export async function getLeague(
  leagueId: string,
): Promise<PickEmLeagueResponse> {
  return await authenticatedFetch<PickEmLeagueResponse>(
    `${API_BASE}/v1/leagues/${leagueId}`,
  );
}

export async function getLeagueMembers(
  leagueId: string,
): Promise<LeagueMemberWithProfileResponse[]> {
  return await authenticatedFetch<LeagueMemberWithProfileResponse[]>(
    `${API_BASE}/v1/leagues/${leagueId}/members`,
  );
}

export const leagueQueryOptions = (leagueId: string) =>
  queryOptions({
    queryKey: ["leagues", leagueId],
    queryFn: () => getLeague(leagueId),
  });

export const leagueMembersQueryOptions = (leagueId: string) =>
  queryOptions({
    queryKey: ["leagues", leagueId, "members"],
    queryFn: () => getLeagueMembers(leagueId),
  });

export const useCreateLeague = <T extends CreateLeague>() => {
  return useMutation({
    mutationFn: createLeague<T>,
  });
};
