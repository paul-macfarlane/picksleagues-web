import { API_BASE, authenticatedFetch } from "@/lib/api";
import type { PopulatedLeagueMemberResponse } from "./leagueMembers.types";
import { queryOptions, useQuery } from "@tanstack/react-query";

// todo in frontend refactor, the include should be parameterized
export async function getLeagueMembers(
  leagueId: string,
): Promise<PopulatedLeagueMemberResponse[]> {
  return await authenticatedFetch<PopulatedLeagueMemberResponse[]>(
    `${API_BASE}/v1/leagues/${leagueId}/members?include=profile`,
  );
}

export const GetLeagueMembersQueryKey = (leagueId: string) => [
  "leagues",
  leagueId,
  "members",
];

export const GetLeagueMembersQueryOptions = (leagueId: string) =>
  queryOptions({
    queryKey: GetLeagueMembersQueryKey(leagueId),
    queryFn: () => getLeagueMembers(leagueId),
  });

export const useGetLeagueMembers = (leagueId: string, enabled: boolean) => {
  return useQuery({
    queryKey: GetLeagueMembersQueryKey(leagueId),
    queryFn: () => getLeagueMembers(leagueId),
    enabled: enabled,
  });
};
