import { z } from "zod";
import { API_BASE, authenticatedFetch } from ".";
import { LEAGUE_TYPE_SLUGS } from "./leagueTypes";
import { useMutation, queryOptions } from "@tanstack/react-query";

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

const mockPickEmLeague: PickEmLeagueResponse = {
  id: "123",
  name: "The Mock League",
  image: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  leagueTypeId: "pick_em",
  startPhaseTemplateId: "uuid-start",
  endPhaseTemplateId: "uuid-end",
  visibility: LEAGUE_VISIBILITIES.PRIVATE,
  size: 10,
  settings: {
    picksPerPhase: 5,
    pickType: PICK_EM_PICK_TYPES.STRAIGHT_UP,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export async function getLeague(
  leagueId: string,
): Promise<PickEmLeagueResponse> {
  console.log(`Mocking getLeague for leagueId: ${leagueId}`);
  await new Promise((res) => setTimeout(res, 300));
  return Promise.resolve(mockPickEmLeague);
}

export const leagueQueryOptions = (leagueId: string) =>
  queryOptions({
    queryKey: ["leagues", leagueId],
    queryFn: () => getLeague(leagueId),
  });

export const useCreateLeague = <T extends CreateLeague>() => {
  return useMutation({
    mutationFn: createLeague<T>,
  });
};
