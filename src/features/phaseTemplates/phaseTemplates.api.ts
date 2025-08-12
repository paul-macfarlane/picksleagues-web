import { API_BASE, authenticatedFetch } from "@/lib/api";
import type { PhaseTemplateResponse } from "./phaseTemplates.types";
import { queryOptions } from "@tanstack/react-query";

export async function getPhaseTemplatesForLeagueType(
  typeIdOrSlug: string,
  excludeStarted: boolean = false,
): Promise<PhaseTemplateResponse[]> {
  const url = new URL(
    `${API_BASE}/v1/league-types/${typeIdOrSlug}/phase-templates`,
  );
  if (excludeStarted) {
    url.searchParams.set("excludeStarted", "true");
  }
  return await authenticatedFetch<PhaseTemplateResponse[]>(url.toString());
}

export const GetPhaseTemplatesByLeagueTypeQueryKey = (
  typeIdOrSlug: string,
  excludeStarted: boolean = false,
) => ["phase-templates", typeIdOrSlug, excludeStarted];

export const GetPhaseTemplatesByLeagueTypeQueryOptions = ({
  typeIdOrSlug,
  excludeStarted = false,
  enabled = true,
}: {
  typeIdOrSlug: string;
  excludeStarted?: boolean;
  enabled?: boolean;
}) =>
  queryOptions({
    queryKey: GetPhaseTemplatesByLeagueTypeQueryKey(
      typeIdOrSlug,
      excludeStarted,
    ),
    queryFn: () => getPhaseTemplatesForLeagueType(typeIdOrSlug, excludeStarted),
    enabled,
  });
