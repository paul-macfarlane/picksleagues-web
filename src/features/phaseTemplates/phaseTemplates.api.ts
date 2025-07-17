import { API_BASE, authenticatedFetch } from "@/lib/api";
import type { PhaseTemplateResponse } from "./phaseTemplates.types";
import { queryOptions, useQuery } from "@tanstack/react-query";

export async function getPhaseTemplatesForLeagueType(typeIdOrSlug: string) {
  return await authenticatedFetch<PhaseTemplateResponse[]>(
    `${API_BASE}/v1/league-types/${typeIdOrSlug}/phase-templates`,
  );
}

export const GetPhaseTemplatesByLeagueTypeQueryKey = (typeIdOrSlug: string) => [
  "phase-templates",
  typeIdOrSlug,
];

export const GetPhaseTemplatesByLeagueTypeQueryOptions = (
  typeIdOrSlug: string,
) =>
  queryOptions({
    queryKey: GetPhaseTemplatesByLeagueTypeQueryKey(typeIdOrSlug),
    queryFn: () => getPhaseTemplatesForLeagueType(typeIdOrSlug),
  });

export const useGetPhaseTemplatesForLeagueType = (typeIdOrSlug: string) => {
  return useQuery({
    queryKey: GetPhaseTemplatesByLeagueTypeQueryKey(typeIdOrSlug),
    queryFn: () => getPhaseTemplatesForLeagueType(typeIdOrSlug),
  });
};
