import { API_BASE, authenticatedFetch } from "@/lib/api";
import {
  STANDINGS_INCLUDES,
  type PopulatedStandingsResponse,
} from "./standings.types";
import { queryOptions } from "@tanstack/react-query";

export async function getStandingsForLeagueAndCurrentSeason<
  T extends PopulatedStandingsResponse,
>(leagueId: string, includes: STANDINGS_INCLUDES[] = []): Promise<T[]> {
  return await authenticatedFetch<T[]>(
    `${API_BASE}/v1/leagues/${leagueId}/standings/current${
      includes.length > 0 ? `?include=${includes.join(",")}` : ""
    }`,
  );
}

export const GetStandingsForLeagueAndCurrentSeasonQueryKey = (
  leagueId: string,
  includes: STANDINGS_INCLUDES[] = [],
) => ["standings", "current", leagueId, ...includes];

export const GetStandingsForLeagueAndCurrentSeasonQueryOptions = <
  T extends PopulatedStandingsResponse,
>(
  leagueId: string,
  includes: STANDINGS_INCLUDES[] = [],
) =>
  queryOptions({
    queryKey: GetStandingsForLeagueAndCurrentSeasonQueryKey(leagueId, includes),
    queryFn: () => getStandingsForLeagueAndCurrentSeason<T>(leagueId, includes),
  });

export async function getMyStandingsForLeagueAndCurrentSeason<
  T extends PopulatedStandingsResponse,
>(leagueId: string, includes: STANDINGS_INCLUDES[] = []): Promise<T> {
  return await authenticatedFetch<T>(
    `${API_BASE}/v1/leagues/${leagueId}/standings/current/me${
      includes.length > 0 ? `?include=${includes.join(",")}` : ""
    }`,
  );
}

export const GetMyStandingsForLeagueAndCurrentSeasonQueryKey = (
  leagueId: string,
  includes: STANDINGS_INCLUDES[] = [],
) => ["standings", "current", "me", leagueId, ...includes];

export const GetMyStandingsForLeagueAndCurrentSeasonQueryOptions = <
  T extends PopulatedStandingsResponse,
>(
  leagueId: string,
  includes: STANDINGS_INCLUDES[] = [],
) =>
  queryOptions({
    queryKey: GetMyStandingsForLeagueAndCurrentSeasonQueryKey(
      leagueId,
      includes,
    ),
    queryFn: () =>
      getMyStandingsForLeagueAndCurrentSeason<T>(leagueId, includes),
  });
