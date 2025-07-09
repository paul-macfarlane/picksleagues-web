import { API_BASE, authenticatedFetch } from ".";
import type { ProfileResponse } from "./profiles";
import { queryOptions } from "@tanstack/react-query";

export enum LEAGUE_MEMBER_ROLES {
  COMMISSIONER = "commissioner",
  MEMBER = "member",
}

export type LeagueMemberResponse = {
  createdAt: Date;
  updatedAt: Date;
  leagueId: string;
  userId: string;
  role: LEAGUE_MEMBER_ROLES;
};

export type LeagueMemberWithProfileResponse = LeagueMemberResponse & {
  profile: ProfileResponse;
};

export async function getLeagueMembers(
  leagueId: string,
): Promise<LeagueMemberWithProfileResponse[]> {
  return await authenticatedFetch<LeagueMemberWithProfileResponse[]>(
    `${API_BASE}/v1/leagues/${leagueId}/members`,
  );
}

export const leagueMembersQueryOptions = (leagueId: string) =>
  queryOptions({
    queryKey: ["leagues", leagueId, "members"],
    queryFn: () => getLeagueMembers(leagueId),
  });
