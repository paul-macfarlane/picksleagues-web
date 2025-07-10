import { z } from "zod";
import { LEAGUE_MEMBER_ROLES } from "./leagueMembers";
import { API_BASE, authenticatedFetch } from ".";
import { queryOptions, useMutation } from "@tanstack/react-query";

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

export const leagueInvitesQueryOptions = (leagueId: string) =>
  queryOptions({
    queryKey: ["leagues", leagueId, "invites"],
    queryFn: () => getLeagueInvites(leagueId),
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
    `${API_BASE}/v1/leagues/invites/${inviteId}/respond`,
    {
      method: "POST",
      body: JSON.stringify(response),
    },
  );
}

export const useRespondToLeagueInvite = (inviteId: string) => {
  return useMutation({
    mutationFn: (response: RespondToLeagueInvite) =>
      respondToLeagueInvite(inviteId, response),
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
