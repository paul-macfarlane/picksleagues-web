import { authenticatedFetch, API_BASE } from "@/lib/api";
import { PHASE_INCLUDES, type PopulatedPhaseResponse } from "./phases.types";
import { queryOptions } from "@tanstack/react-query";

export async function getCurrentPhaseForLeague(
  leagueId: string,
  includes: PHASE_INCLUDES[] = [],
) {
  return await authenticatedFetch<PopulatedPhaseResponse>(
    `${API_BASE}/v1/leagues/${leagueId}/current-phase${includes.length > 0 ? `?include=${includes.join(",")}` : ""}`,
  );
}

export const GetCurrentPhaseForLeagueQueryKey = (
  leagueId: string,
  includes: PHASE_INCLUDES[] = [],
) => ["current-phase", leagueId, ...includes];

export const GetCurrentPhaseForLeagueQueryOptions = (
  leagueId: string,
  includes: PHASE_INCLUDES[] = [],
) =>
  queryOptions({
    queryKey: GetCurrentPhaseForLeagueQueryKey(leagueId, includes),
    queryFn: () => getCurrentPhaseForLeague(leagueId, includes),
  });

export async function getPhaseForLeague(
  leagueId: string,
  phaseId: string,
  includes: PHASE_INCLUDES[] = [],
) {
  return await authenticatedFetch<PopulatedPhaseResponse>(
    `${API_BASE}/v1/leagues/${leagueId}/phases/${phaseId}${includes.length > 0 ? `?include=${includes.join(",")}` : ""}`,
  );
}

export const GetPhaseForLeagueQueryKey = (
  leagueId: string,
  phaseId: string,
  includes: PHASE_INCLUDES[] = [],
) => ["phase", leagueId, phaseId, ...includes];

export const GetPhaseForLeagueQueryOptions = (
  leagueId: string,
  phaseId: string,
  includes: PHASE_INCLUDES[] = [],
) =>
  queryOptions({
    queryKey: GetPhaseForLeagueQueryKey(leagueId, phaseId, includes),
    queryFn: () => getPhaseForLeague(leagueId, phaseId, includes),
  });
