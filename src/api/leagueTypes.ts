import { queryOptions } from "@tanstack/react-query";
import { API_BASE, authenticatedFetch } from ".";
import type { PhaseTemplateResponse } from "./phaseTemplates";

export enum LEAGUE_TYPE_NAMES {
  PICK_EM = "Pick'Em",
}

export enum LEAGUE_TYPE_SLUGS {
  PICK_EM = "pick-em",
}

export async function getPhaseTemplatesForLeagueType(typeIdOrSlug: string) {
  return await authenticatedFetch<PhaseTemplateResponse[]>(
    `${API_BASE}/v1/league-types/${typeIdOrSlug}/phase-templates`,
  );
}

export const PHASE_TEMPLATES_BY_LEAGUE_TYPE_QUERY_KEY = (
  typeIdOrSlug: string,
) => ["phase-templates", typeIdOrSlug];

export const phaseTemplatesByLeagueTypeQueryOptions = (typeIdOrSlug: string) =>
  queryOptions({
    queryKey: PHASE_TEMPLATES_BY_LEAGUE_TYPE_QUERY_KEY(typeIdOrSlug),
    queryFn: () => getPhaseTemplatesForLeagueType(typeIdOrSlug),
  });
