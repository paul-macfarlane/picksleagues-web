import { API_BASE, authenticatedFetch } from "@/lib/api";
import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import type {
  CreateLeagueSchema,
  LeagueResponse,
  PickEmLeagueResponse,
} from "./leagues.types";
import type z from "zod";

export async function getMyLeaguesForLeagueType<T extends LeagueResponse>(
  typeIdOrSlug: string,
) {
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

export const useGetMyLeaguesForLeagueType = <T extends LeagueResponse>(
  typeIdOrSlug: string,
) => {
  return useQuery({
    queryKey: GetMyLeaguesForLeagueTypeQueryKey(typeIdOrSlug),
    queryFn: () => getMyLeaguesForLeagueType<T>(typeIdOrSlug),
  });
};

export async function getLeague(
  leagueId: string,
): Promise<PickEmLeagueResponse> {
  return await authenticatedFetch<PickEmLeagueResponse>(
    `${API_BASE}/v1/leagues/${leagueId}`,
  );
}

export const GetLeagueQueryKey = (leagueId: string) => ["leagues", leagueId];

export const GetLeagueQueryOptions = (leagueId: string) =>
  queryOptions({
    queryKey: GetLeagueQueryKey(leagueId),
    queryFn: () => getLeague(leagueId),
  });

export const useGetLeague = (leagueId: string, enabled: boolean) => {
  return useQuery({
    queryKey: GetLeagueQueryKey(leagueId),
    queryFn: () => getLeague(leagueId),
    enabled: enabled,
  });
};

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

export const useCreateLeague = <
  T extends z.infer<typeof CreateLeagueSchema>,
>() => {
  return useMutation({
    mutationFn: createLeague<T>,
  });
};
