import { z } from "zod";
import { LEAGUE_MEMBER_ROLES } from "./leagueMembers";
import { API_BASE, authenticatedFetch } from ".";
import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import type { LeagueResponse } from "./leagues";
import type { LeagueTypeResponse } from "./leagueTypes";

export enum LEAGUE_INVITE_TYPES {
  DIRECT = "direct",
  LINK = "link",
}

export enum LEAGUE_INVITE_STATUSES {
  PENDING = "pending",
  ACCEPTED = "accepted",
  DECLINED = "declined",
}

export const MIN_LEAGUE_INVITE_USES = 1;
export const MAX_LEAGUE_INVITE_USES = 10;

export const MIN_LEAGUE_INVITE_EXPIRATION_DAYS = 1;
export const MAX_LEAGUE_INVITE_EXPIRATION_DAYS = 30;

export const CreateLeagueInviteSchema = z
  .object({
    leagueId: z.string().trim().uuid(),
    role: z.enum([
      LEAGUE_MEMBER_ROLES.COMMISSIONER,
      LEAGUE_MEMBER_ROLES.MEMBER,
    ]),
    type: z.enum([LEAGUE_INVITE_TYPES.DIRECT, LEAGUE_INVITE_TYPES.LINK]),
    expiresInDays: z
      .number()
      .int()
      .min(MIN_LEAGUE_INVITE_EXPIRATION_DAYS, {
        message: `Expires in days must be at least ${MIN_LEAGUE_INVITE_EXPIRATION_DAYS}`,
      })
      .max(MAX_LEAGUE_INVITE_EXPIRATION_DAYS, {
        message: `Expires in days must be at most ${MAX_LEAGUE_INVITE_EXPIRATION_DAYS}`,
      }),

    // Direct invite only
    inviteeId: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    // if the invite type is direct, then inviteeId is required
    if (data.type === LEAGUE_INVITE_TYPES.DIRECT) {
      if (!data.inviteeId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `User is required`,
          path: ["inviteeId"],
        });
      }
    }
    return true;
  });

export type CreateLeagueInvite = z.infer<typeof CreateLeagueInviteSchema>;

export type LeagueInviteResponse = {
  id: string;
  token: string;
  leagueId: string;
  inviteeId: string | null;
  role: LEAGUE_MEMBER_ROLES;
  type: LEAGUE_INVITE_TYPES;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
};

export async function getLeagueInvites(
  leagueId: string,
): Promise<LeagueInviteResponse[]> {
  return await authenticatedFetch<LeagueInviteResponse[]>(
    `${API_BASE}/v1/leagues/${leagueId}/invites`,
  );
}

export const leagueInvitesQueryOptions = ({
  leagueId,
  enabled = true,
}: {
  leagueId: string;
  enabled?: boolean;
}) =>
  queryOptions({
    queryKey: ["leagues", leagueId, "invites"],
    queryFn: () => getLeagueInvites(leagueId),
    enabled,
  });

export async function createLeagueInvite(
  invite: CreateLeagueInvite,
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
    mutationFn: (invite: CreateLeagueInvite) => createLeagueInvite(invite),
  });
};

export const RespondToLeagueInviteSchema = z.object({
  response: z.enum([
    LEAGUE_INVITE_STATUSES.ACCEPTED,
    LEAGUE_INVITE_STATUSES.DECLINED,
  ]),
});

export type RespondToLeagueInvite = z.infer<typeof RespondToLeagueInviteSchema>;

export async function respondToLeagueInvite(
  inviteId: string,
  response: RespondToLeagueInvite,
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
      response: RespondToLeagueInvite;
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

export const useDeactivateLeagueInvite = () => {
  return useMutation({
    mutationFn: (inviteId: string) => deleteLeagueInvite(inviteId),
  });
};

export type LeagueInviteWithLeagueAndTypeResponse = LeagueInviteResponse & {
  league: LeagueResponse;
  leagueType: LeagueTypeResponse;
};

export async function getLeagueInvitesForUser(): Promise<
  LeagueInviteWithLeagueAndTypeResponse[]
> {
  return await authenticatedFetch<LeagueInviteWithLeagueAndTypeResponse[]>(
    `${API_BASE}/v1/league-invites/my-invites`,
  );
}

export const leagueInvitesForUserQueryOptions = () =>
  queryOptions({
    queryKey: ["league-invites", "my-invites"],
    queryFn: () => getLeagueInvitesForUser(),
  });

export const useLeagueInvitesForUser = () => {
  return useQuery(leagueInvitesForUserQueryOptions());
};

export async function getLeagueInviteByToken(
  token: string,
): Promise<LeagueInviteWithLeagueAndTypeResponse> {
  return await authenticatedFetch<LeagueInviteWithLeagueAndTypeResponse>(
    `${API_BASE}/v1/league-invites/token/${token}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}

export const leagueInviteByTokenQueryOptions = ({
  token,
  enabled,
}: {
  token: string;
  enabled: boolean;
}) =>
  queryOptions({
    queryKey: ["league-invites", "token", token],
    queryFn: () => getLeagueInviteByToken(token),
    enabled,
  });

export const useLeagueInviteByToken = ({
  token,
  enabled,
}: {
  token: string;
  enabled: boolean;
}) => {
  return useQuery(leagueInviteByTokenQueryOptions({ token, enabled }));
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
