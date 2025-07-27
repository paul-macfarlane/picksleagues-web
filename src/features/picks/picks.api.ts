import type {
  PICK_INCLUDES,
  PopulatedPickResponse,
  SubmitPicksSchema,
} from "./picks.types";
import { authenticatedFetch, API_BASE } from "@/lib/api";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { z } from "zod";

export async function getMyPicksForLeagueAndPhase(
  leagueId: string,
  phaseId: string,
  includes: PICK_INCLUDES[] = [],
) {
  return await authenticatedFetch<PopulatedPickResponse[]>(
    `${API_BASE}/v1/leagues/${leagueId}/phases/${phaseId}/my-picks${includes.length > 0 ? `?include=${includes.join(",")}` : ""}`,
  );
}

export const GetMyPicksForLeagueAndPhaseQueryKey = (
  leagueId: string,
  phaseId: string,
  includes: PICK_INCLUDES[] = [],
) => ["my-picks", leagueId, phaseId, ...includes];

export const GetMyPicksForLeagueAndPhaseQueryOptions = (
  leagueId: string,
  phaseId: string,
  includes: PICK_INCLUDES[] = [],
) =>
  queryOptions({
    queryKey: GetMyPicksForLeagueAndPhaseQueryKey(leagueId, phaseId, includes),
    queryFn: () => getMyPicksForLeagueAndPhase(leagueId, phaseId, includes),
  });

export async function getMyPicksForLeagueAndCurrentPhase(
  leagueId: string,
  includes: PICK_INCLUDES[] = [],
) {
  return await authenticatedFetch<PopulatedPickResponse[]>(
    `${API_BASE}/v1/leagues/${leagueId}/current-phase/my-picks${includes.length > 0 ? `?include=${includes.join(",")}` : ""}`,
  );
}

export const GetMyPicksForLeagueAndCurrentPhaseQueryKey = (
  leagueId: string,
  includes: PICK_INCLUDES[] = [],
) => ["my-picks", leagueId, "current-phase", ...includes];

export const GetMyPicksForLeagueAndCurrentPhaseQueryOptions = (
  leagueId: string,
  includes: PICK_INCLUDES[] = [],
) =>
  queryOptions({
    queryKey: GetMyPicksForLeagueAndCurrentPhaseQueryKey(leagueId, includes),
    queryFn: () => getMyPicksForLeagueAndCurrentPhase(leagueId, includes),
  });

export async function getPicksForLeagueAndPhase(
  leagueId: string,
  phaseId: string,
  includes: PICK_INCLUDES[] = [],
) {
  return await authenticatedFetch<PopulatedPickResponse[]>(
    `${API_BASE}/v1/leagues/${leagueId}/phases/${phaseId}/picks${includes.length > 0 ? `?include=${includes.join(",")}` : ""}`,
  );
}

export const GetPicksForLeagueAndPhaseQueryKey = (
  leagueId: string,
  phaseId: string,
  includes: PICK_INCLUDES[] = [],
) => ["picks", leagueId, phaseId, ...includes];

export const GetPicksForLeagueAndPhaseQueryOptions = (
  leagueId: string,
  phaseId: string,
  includes: PICK_INCLUDES[] = [],
) =>
  queryOptions({
    queryKey: GetPicksForLeagueAndPhaseQueryKey(leagueId, phaseId, includes),
    queryFn: () => getPicksForLeagueAndPhase(leagueId, phaseId, includes),
  });

export async function getPicksForLeagueAndCurrentPhase(
  leagueId: string,
  includes: PICK_INCLUDES[] = [],
) {
  return await authenticatedFetch<PopulatedPickResponse[]>(
    `${API_BASE}/v1/leagues/${leagueId}/current-phase/picks${includes.length > 0 ? `?include=${includes.join(",")}` : ""}`,
  );
}

export const GetPicksForLeagueAndCurrentPhaseQueryKey = (
  leagueId: string,
  includes: PICK_INCLUDES[] = [],
) => ["picks", leagueId, "current-phase", ...includes];

export const GetPicksForLeagueAndCurrentPhaseQueryOptions = (
  leagueId: string,
  includes: PICK_INCLUDES[] = [],
) =>
  queryOptions({
    queryKey: GetPicksForLeagueAndCurrentPhaseQueryKey(leagueId, includes),
    queryFn: () => getPicksForLeagueAndCurrentPhase(leagueId, includes),
  });

export async function submitPicksForCurrentPhase(
  leagueId: string,
  picks: z.infer<typeof SubmitPicksSchema>,
) {
  return await authenticatedFetch(
    `${API_BASE}/v1/leagues/${leagueId}/current-phase/picks`,
    {
      method: "POST",
      body: JSON.stringify(picks),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}

export const useSubmitPicksMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      leagueId,
      picks,
    }: {
      leagueId: string;
      phaseId: string;
      picks: z.infer<typeof SubmitPicksSchema>;
    }) => submitPicksForCurrentPhase(leagueId, picks),
    onSuccess: (_, { leagueId, phaseId }) => {
      // Invalidate both current phase and specific phase queries
      queryClient.invalidateQueries({
        queryKey: GetMyPicksForLeagueAndCurrentPhaseQueryKey(leagueId),
      });
      queryClient.invalidateQueries({
        queryKey: GetPicksForLeagueAndCurrentPhaseQueryKey(leagueId),
      });
      // Also invalidate the specific phase query using the provided phaseId
      queryClient.invalidateQueries({
        queryKey: GetMyPicksForLeagueAndPhaseQueryKey(leagueId, phaseId),
      });
      queryClient.invalidateQueries({
        queryKey: GetPicksForLeagueAndPhaseQueryKey(leagueId, phaseId),
      });
    },
  });
};
