import { API_BASE, authenticatedFetch } from "@/lib/api";
import type {
  CreateLeagueInviteSchema,
  LeagueInviteResponse,
  PopulatedLeagueInviteResponse,
  RespondToLeagueInviteSchema,
} from "./leagueInvites.types";
import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import z from "zod";

// todo in frontend refactor, the include should be parameterized
export async function getLeagueInvites(
  leagueId: string,
): Promise<PopulatedLeagueInviteResponse[]> {
  return await authenticatedFetch<PopulatedLeagueInviteResponse[]>(
    `${API_BASE}/v1/leagues/${leagueId}/invites?include=invitee`,
  );
}

export const GetLeagueInvitesQueryKey = (leagueId: string) => [
  "leagues",
  leagueId,
  "invites",
];

export const GetLeagueInvitesQueryOptions = ({
  leagueId,
  enabled = true,
}: {
  leagueId: string;
  enabled?: boolean;
}) =>
  queryOptions({
    queryKey: GetLeagueInvitesQueryKey(leagueId),
    queryFn: () => getLeagueInvites(leagueId),
    enabled,
  });

export const useGetLeagueInvites = (leagueId: string, enabled: boolean) => {
  return useQuery({
    queryKey: GetLeagueInvitesQueryKey(leagueId),
    queryFn: () => getLeagueInvites(leagueId),
    enabled: enabled,
  });
};

export async function getLeagueInvitesForUser(): Promise<
  PopulatedLeagueInviteResponse[]
> {
  return await authenticatedFetch<PopulatedLeagueInviteResponse[]>(
    `${API_BASE}/v1/league-invites/my-invites?include=league,league.leagueType`,
  );
}

export const GetLeagueInvitesForUserQueryKey = ["league-invites", "my-invites"];

export const GetLeagueInvitesForUserQueryOptions = () =>
  queryOptions({
    queryKey: GetLeagueInvitesForUserQueryKey,
    queryFn: () => getLeagueInvitesForUser(),
  });

export const useGetLeagueInvitesForUser = () => {
  return useQuery({
    queryKey: GetLeagueInvitesForUserQueryKey,
    queryFn: () => getLeagueInvitesForUser(),
  });
};

// todo in frontend refactor, the include should be parameterized
export async function getLeagueInviteByToken(
  token: string,
): Promise<PopulatedLeagueInviteResponse> {
  return await authenticatedFetch<PopulatedLeagueInviteResponse>(
    `${API_BASE}/v1/league-invites/token/${token}?include=league,league.leagueType`,
  );
}

export const GetLeagueInviteByTokenQueryKey = (token: string) => [
  "league-invites",
  "token",
  token,
];

export const GetLeagueInviteByTokenQueryOptions = ({
  token,
  enabled,
}: {
  token: string;
  enabled: boolean;
}) =>
  queryOptions({
    queryKey: GetLeagueInviteByTokenQueryKey(token),
    queryFn: () => getLeagueInviteByToken(token),
    enabled,
  });

export const useGetLeagueInviteByToken = (token: string, enabled: boolean) => {
  return useQuery({
    queryKey: GetLeagueInviteByTokenQueryKey(token),
    queryFn: () => getLeagueInviteByToken(token),
    enabled: enabled,
  });
};

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
  return useMutation({
    mutationFn: (invite: z.infer<typeof CreateLeagueInviteSchema>) =>
      createLeagueInvite(invite),
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
  return useMutation({
    mutationFn: ({
      inviteId,
      response,
    }: {
      inviteId: string;
      response: z.infer<typeof RespondToLeagueInviteSchema>;
    }) => respondToLeagueInvite(inviteId, response),
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
  return useMutation({
    mutationFn: (inviteId: string) => deleteLeagueInvite(inviteId),
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
  return useMutation({
    mutationFn: (token: string) => joinLeagueByInviteToken(token),
  });
};
