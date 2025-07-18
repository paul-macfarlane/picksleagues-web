import { API_BASE, authenticatedFetch } from "@/lib/api";
import {
  type CreateLeagueInviteSchema,
  type LeagueInviteResponse,
  type PopulatedLeagueInviteResponse,
  type RespondToLeagueInviteSchema,
  LEAGUE_INVITE_INCLUDES,
} from "./leagueInvites.types";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import z from "zod";

export async function getLeagueInvites(
  leagueId: string,
  includes: LEAGUE_INVITE_INCLUDES[] = [],
): Promise<PopulatedLeagueInviteResponse[]> {
  const includeQuery =
    includes.length > 0 ? `?include=${includes.join(",")}` : "";
  return await authenticatedFetch<PopulatedLeagueInviteResponse[]>(
    `${API_BASE}/v1/leagues/${leagueId}/invites${includeQuery}`,
  );
}

export const GetLeagueInvitesQueryKey = (
  leagueId: string,
  includes: LEAGUE_INVITE_INCLUDES[] = [],
) => ["leagues", leagueId, "invites", ...includes];

export const GetLeagueInvitesQueryOptions = ({
  leagueId,
  includes = [],
  enabled = true,
}: {
  leagueId: string;
  includes?: LEAGUE_INVITE_INCLUDES[];
  enabled?: boolean;
}) =>
  queryOptions({
    queryKey: GetLeagueInvitesQueryKey(leagueId, includes),
    queryFn: () => getLeagueInvites(leagueId, includes),
    enabled: enabled,
  });

export async function getLeagueInvitesForUser(
  includes: LEAGUE_INVITE_INCLUDES[] = [],
): Promise<PopulatedLeagueInviteResponse[]> {
  return await authenticatedFetch<PopulatedLeagueInviteResponse[]>(
    `${API_BASE}/v1/league-invites/my-invites${
      includes.length > 0 ? `?include=${includes.join(",")}` : ""
    }`,
  );
}

export const GetLeagueInvitesForUserQueryKey = (
  includes: LEAGUE_INVITE_INCLUDES[] = [],
) => ["league-invites", "my-invites", ...includes];

export const GetLeagueInvitesForUserQueryOptions = ({
  includes = [],
}: {
  includes?: LEAGUE_INVITE_INCLUDES[];
}) =>
  queryOptions({
    queryKey: GetLeagueInvitesForUserQueryKey(includes),
    queryFn: () => getLeagueInvitesForUser(includes),
  });

export async function getLeagueInviteByToken(
  token: string,
  includes: LEAGUE_INVITE_INCLUDES[] = [],
): Promise<PopulatedLeagueInviteResponse> {
  const includeQuery =
    includes.length > 0 ? `?include=${includes.join(",")}` : "";
  return await authenticatedFetch<PopulatedLeagueInviteResponse>(
    `${API_BASE}/v1/league-invites/token/${token}${includeQuery}`,
  );
}

export const GetLeagueInviteByTokenQueryKey = (
  token: string,
  includes: LEAGUE_INVITE_INCLUDES[] = [],
) => ["league-invites", "token", token, ...includes];

export const GetLeagueInviteByTokenQueryOptions = ({
  token,
  includes = [],
}: {
  token: string;
  includes?: LEAGUE_INVITE_INCLUDES[];
}) =>
  queryOptions({
    queryKey: GetLeagueInviteByTokenQueryKey(token, includes),
    queryFn: () => getLeagueInviteByToken(token, includes),
  });

export async function createLeagueInvite(
  invite: z.infer<typeof CreateLeagueInviteSchema>,
): Promise<LeagueInviteResponse> {
  return await authenticatedFetch<LeagueInviteResponse>(
    `${API_BASE}/v1/league-invites`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invite),
    },
  );
}

export const useCreateLeagueInvite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invite: z.infer<typeof CreateLeagueInviteSchema>) =>
      createLeagueInvite(invite),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: GetLeagueInvitesQueryKey(variables.leagueId),
      });
    },
  });
};

export async function respondToLeagueInvite(
  inviteId: string,
  response: z.infer<typeof RespondToLeagueInviteSchema>,
): Promise<void> {
  return await authenticatedFetch<void>(
    `${API_BASE}/v1/league-invites/${inviteId}/respond`,
    {
      method: "POST",
      body: JSON.stringify(response),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}

export const useRespondToLeagueInvite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      inviteId,
      response,
    }: {
      inviteId: string;
      response: z.infer<typeof RespondToLeagueInviteSchema>;
      leagueId: string;
    }) => respondToLeagueInvite(inviteId, response),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: GetLeagueInvitesForUserQueryKey(),
      });
    },
  });
};

export async function deleteLeagueInvite(inviteId: string): Promise<void> {
  return await authenticatedFetch<void>(
    `${API_BASE}/v1/league-invites/${inviteId}`,
    {
      method: "DELETE",
    },
  );
}

export const useDeleteLeagueInvite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ inviteId }: { inviteId: string; leagueId: string }) =>
      deleteLeagueInvite(inviteId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: GetLeagueInvitesQueryKey(variables.leagueId),
      });
    },
  });
};

export async function joinLeagueByInviteToken(token: string): Promise<void> {
  return await authenticatedFetch<void>(
    `${API_BASE}/v1/league-invites/token/${token}/join`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}

export const useJoinLeagueByInviteToken = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (token: string) => joinLeagueByInviteToken(token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: GetLeagueInvitesForUserQueryKey(),
      });
    },
  });
};
