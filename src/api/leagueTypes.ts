import { queryOptions } from "@tanstack/react-query";
import { API_BASE, authenticatedFetch } from ".";
import type { PhaseTemplateResponse } from "./phaseTemplates";
import type { LeagueResponse } from "./leagues";

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

export async function getMyLeaguesForLeagueType<T extends LeagueResponse>(
  typeIdOrSlug: string,
) {
  return await authenticatedFetch<T[]>(
    `${API_BASE}/v1/league-types/${typeIdOrSlug}/my-leagues`,
  );
}

export const MY_LEAGUES_FOR_LEAGUE_TYPE_QUERY_KEY = (typeIdOrSlug: string) => [
  "my-leagues",
  typeIdOrSlug,
];

export const myLeaguesForLeagueTypeQueryOptions = <T extends LeagueResponse>(
  typeIdOrSlug: string,
) =>
  queryOptions({
    queryKey: MY_LEAGUES_FOR_LEAGUE_TYPE_QUERY_KEY(typeIdOrSlug),
    queryFn: () => getMyLeaguesForLeagueType<T>(typeIdOrSlug),
  });

export type LeagueTypeResponse = {
  id: string;
  name: LEAGUE_TYPE_NAMES;
  slug: LEAGUE_TYPE_SLUGS;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  sportLeagueId: string;
};
