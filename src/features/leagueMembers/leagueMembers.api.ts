import { API_BASE, authenticatedFetch } from "@/lib/api";
import type {
  LEAGUE_MEMBER_INCLUDES,
  LeagueMemberResponse,
  PopulatedLeagueMemberResponse,
  UpdateLeagueMemberSchema,
} from "./leagueMembers.types";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import z from "zod";
import { GetMyLeaguesQueryKey } from "../leagues/leagues.api";
import { LEAGUE_INCLUDES } from "../leagues/leagues.types";

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

export async function updateLeagueMember(
  leagueId: string,
  userId: string,
  update: z.infer<typeof UpdateLeagueMemberSchema>,
): Promise<LeagueMemberResponse> {
  return await authenticatedFetch<LeagueMemberResponse>(
    `${API_BASE}/v1/leagues/${leagueId}/members/${userId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    },
  );
}

export const useUpdateLeagueMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      leagueId,
      userId,
      update,
    }: {
      userId: string;
      leagueId: string;
      update: z.infer<typeof UpdateLeagueMemberSchema>;
    }) => updateLeagueMember(leagueId, userId, update),
    onSuccess: ({ leagueId }) => {
      queryClient.invalidateQueries({
        queryKey: GetLeagueMembersQueryKey(leagueId),
      });
      queryClient.invalidateQueries({
        queryKey: GetMyLeaguesQueryKey([LEAGUE_INCLUDES.MEMBERS]),
      });
    },
  });
};
