import { API_BASE, authenticatedFetch } from "@/lib/api";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  CreateLeagueSchema,
  LeagueResponse,
  PickEmLeagueResponse,
  PopulatedLeagueResponse,
  UpdateLeagueSchema,
} from "./leagues.types";
import z from "zod";
import { LEAGUE_INCLUDES } from "./leagues.types";
import type { LEAGUE_TYPE_SLUGS } from "../leagueTypes/leagueTypes.types";
import type {
  PHASE_INCLUDES,
  PopulatedPhaseResponse,
} from "../phases/phases.types";

export async function getMyLeagues<T extends PopulatedLeagueResponse>(
  includes: LEAGUE_INCLUDES[] = [],
): Promise<T[]> {
  return await authenticatedFetch<T[]>(
    `${API_BASE}/v1/users/me/leagues${
      includes.length > 0 ? `?include=${includes.join(",")}` : ""
    }`,
  );
}

export const GetMyLeaguesQueryKey = (includes: LEAGUE_INCLUDES[] = []) => [
  "my-leagues",
  ...includes,
];

export const GetMyLeaguesQueryOptions = <T extends PopulatedLeagueResponse>(
  includes: LEAGUE_INCLUDES[] = [],
) =>
  queryOptions({
    queryKey: GetMyLeaguesQueryKey(includes),
    queryFn: () => getMyLeagues<T>(includes),
  });

export async function getMyLeaguesForLeagueType<T extends LeagueResponse>(
  typeIdOrSlug: string,
): Promise<T[]> {
  return await authenticatedFetch<T[]>(
    `${API_BASE}/v1/league-types/${typeIdOrSlug}/my-leagues`,
  );
}

export const GetMyLeaguesForLeagueTypeQueryKey = (typeIdOrSlug: string) => [
  "my-leagues",
  typeIdOrSlug,
];

export const GetMyLeaguesForLeagueTypeQueryOptions = <T extends LeagueResponse>(
  typeIdOrSlug: string,
) =>
  queryOptions({
    queryKey: GetMyLeaguesForLeagueTypeQueryKey(typeIdOrSlug),
    queryFn: () => getMyLeaguesForLeagueType<T>(typeIdOrSlug),
  });

export async function getLeague<T extends PopulatedLeagueResponse>(
  leagueId: string,
  includes: LEAGUE_INCLUDES[] = [],
): Promise<T> {
  return await authenticatedFetch<T>(
    `${API_BASE}/v1/leagues/${leagueId}${
      includes.length > 0 ? `?include=${includes.join(",")}` : ""
    }`,
  );
}

export const GetLeagueQueryKey = (
  leagueId: string,
  includes: LEAGUE_INCLUDES[] = [],
) => ["leagues", leagueId, ...includes];

export const GetLeagueQueryOptions = <T extends PopulatedLeagueResponse>(
  leagueId: string,
  includes: LEAGUE_INCLUDES[] = [],
) =>
  queryOptions({
    queryKey: GetLeagueQueryKey(leagueId, includes),
    queryFn: () => getLeague<T>(leagueId, includes),
  });

export async function createLeague<
  T extends z.infer<typeof CreateLeagueSchema>,
>(
  league: T,
): Promise<
  T extends z.infer<typeof CreateLeagueSchema>
    ? PickEmLeagueResponse
    : LeagueResponse
> {
  return await authenticatedFetch<
    T extends z.infer<typeof CreateLeagueSchema>
      ? PickEmLeagueResponse
      : LeagueResponse
  >(`${API_BASE}/v1/leagues`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(league),
  });
}

export function useCreateLeague<
  T extends z.infer<typeof CreateLeagueSchema>,
>() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLeague<T>,
    onSuccess: (_, { leagueTypeSlug }) => {
      queryClient.invalidateQueries({
        queryKey: GetMyLeaguesForLeagueTypeQueryKey(leagueTypeSlug),
      });
      queryClient.invalidateQueries({
        queryKey: GetMyLeaguesQueryKey(),
      });
    },
  });
}

export async function updateLeague<
  T extends z.infer<typeof UpdateLeagueSchema>,
>(leagueId: string, league: T): Promise<T> {
  return await authenticatedFetch<T>(`${API_BASE}/v1/leagues/${leagueId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(league),
  });
}

export function useUpdateLeague<
  T extends z.infer<typeof UpdateLeagueSchema>,
>() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      leagueId,
      league,
    }: {
      leagueId: string;
      league: T;
      leagueTypeSlug: LEAGUE_TYPE_SLUGS;
    }) => updateLeague(leagueId, league),
    onSuccess: (_, { leagueId, leagueTypeSlug }) => {
      queryClient.invalidateQueries({
        queryKey: GetMyLeaguesForLeagueTypeQueryKey(leagueTypeSlug),
      });
      queryClient.invalidateQueries({
        queryKey: GetLeagueQueryKey(leagueId),
      });
      queryClient.invalidateQueries({
        queryKey: GetMyLeaguesQueryKey(),
      });
    },
  });
}

export async function deleteLeague(leagueId: string): Promise<void> {
  await authenticatedFetch(`${API_BASE}/v1/leagues/${leagueId}`, {
    method: "DELETE",
  });
}

export function useDeleteLeague() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      leagueId,
    }: {
      leagueId: string;
      leagueTypeSlug: LEAGUE_TYPE_SLUGS;
    }) => deleteLeague(leagueId),
    onSuccess: (_, { leagueTypeSlug }) => {
      queryClient.invalidateQueries({
        queryKey: GetMyLeaguesQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: GetMyLeaguesForLeagueTypeQueryKey(leagueTypeSlug),
      });
    },
  });
}

export async function getLeagueCurrentPhase(
  leagueId: string,
  includes: PHASE_INCLUDES[] = [],
): Promise<PopulatedPhaseResponse> {
  return await authenticatedFetch<PopulatedPhaseResponse>(
    `${API_BASE}/v1/leagues/${leagueId}/current-phase${includes.length > 0 ? `?include=${includes.join(",")}` : ""}`,
  );
}

export const GetLeagueCurrentPhaseQueryKey = (
  leagueId: string,
  includes: PHASE_INCLUDES[] = [],
) => ["league-current-phase", leagueId, ...includes];

export const GetLeagueCurrentPhaseQueryOptions = (
  leagueId: string,
  includes: PHASE_INCLUDES[] = [],
) =>
  queryOptions({
    queryKey: GetLeagueCurrentPhaseQueryKey(leagueId, includes),
    queryFn: () => getLeagueCurrentPhase(leagueId, includes),
  });

export async function getLeaguePhase(
  leagueId: string,
  phaseId: string,
  includes: PHASE_INCLUDES[] = [],
): Promise<PopulatedPhaseResponse> {
  return await authenticatedFetch<PopulatedPhaseResponse>(
    `${API_BASE}/v1/leagues/${leagueId}/phases/${phaseId}${includes.length > 0 ? `?include=${includes.join(",")}` : ""}`,
  );
}

export const GetLeaguePhaseQueryKey = (
  leagueId: string,
  phaseId: string,
  includes: PHASE_INCLUDES[] = [],
) => ["league-phase", leagueId, phaseId, ...includes];

export const GetLeaguePhaseQueryOptions = (
  leagueId: string,
  phaseId: string,
  includes: PHASE_INCLUDES[] = [],
) =>
  queryOptions({
    queryKey: GetLeaguePhaseQueryKey(leagueId, phaseId, includes),
    queryFn: () => getLeaguePhase(leagueId, phaseId, includes),
  });
