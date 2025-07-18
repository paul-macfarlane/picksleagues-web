import { API_BASE, authenticatedFetch } from "@/lib/api";
import type {
  LEAGUE_MEMBER_INCLUDES,
  PopulatedLeagueMemberResponse,
} from "./leagueMembers.types";
import { queryOptions } from "@tanstack/react-query";

export async function getLeagueMembers(
  leagueId: string,
  includes: LEAGUE_MEMBER_INCLUDES[] = [],
): Promise<PopulatedLeagueMemberResponse[]> {
  return await authenticatedFetch<PopulatedLeagueMemberResponse[]>(
    `${API_BASE}/v1/leagues/${leagueId}/members${
      includes.length > 0 ? `?include=${includes.join(",")}` : ""
    }`,
  );
}

export const GetLeagueMembersQueryKey = (
  leagueId: string,
  includes: LEAGUE_MEMBER_INCLUDES[] = [],
) => ["leagues", leagueId, "members", ...includes];

export const GetLeagueMembersQueryOptions = (
  leagueId: string,
  includes: LEAGUE_MEMBER_INCLUDES[] = [],
) =>
  queryOptions({
    queryKey: GetLeagueMembersQueryKey(leagueId, includes),
    queryFn: () => getLeagueMembers(leagueId, includes),
  });
