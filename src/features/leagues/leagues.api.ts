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
} from "./leagues.types";
import z from "zod";
import { LEAGUE_INCLUDES } from "./leagues.types";
import type { LEAGUE_TYPE_SLUGS } from "../leagueTypes/leagueTypes.types";

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
