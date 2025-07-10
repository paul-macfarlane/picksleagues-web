import { queryOptions, useMutation } from "@tanstack/react-query";
import { API_BASE, authenticatedFetch } from ".";
import z from "zod";

export type ProfileResponse = {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

async function fetchProfile(userId: string): Promise<ProfileResponse> {
  return await authenticatedFetch<ProfileResponse>(
    `${API_BASE}/v1/profiles/${userId}`,
  );
}

export const PROFILE_QUERY_KEY = ["profiles"];

export const profileQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["profiles", userId],
    queryFn: () => fetchProfile(userId),
  });

const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 50;
const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 50;

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(MIN_USERNAME_LENGTH, {
      message: `Username must be at least ${MIN_USERNAME_LENGTH} characters`,
    })
    .max(MAX_USERNAME_LENGTH, {
      message: `Username must be at most ${MAX_USERNAME_LENGTH} characters`,
    }),
  firstName: z
    .string()
    .min(MIN_NAME_LENGTH, { message: `First name is required ` })
    .max(MAX_NAME_LENGTH, {
      message: `First name must be at most ${MAX_NAME_LENGTH} characters`,
    }),
  lastName: z
    .string()
    .min(MIN_NAME_LENGTH, { message: `Last name is required` })
    .max(MAX_NAME_LENGTH, {
      message: `Last name must be at most ${MAX_NAME_LENGTH} characters`,
    }),
  avatarUrl: z.union([
    z.string().trim().url().optional(),
    z.literal(""),
    z.null(),
  ]),
});

export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>;

export async function updateProfile(
  profile: UpdateProfileRequest,
): Promise<ProfileResponse> {
  return await authenticatedFetch<ProfileResponse>(`${API_BASE}/v1/profiles`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profile),
  });
}

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: updateProfile,
  });
};

export const SearchProfilesSchema = z.object({
  username: z.string().trim().min(1).optional(),
  firstName: z.string().trim().min(1).optional(),
  lastName: z.string().trim().min(1).optional(),
});

export type SearchProfilesRequest = z.infer<typeof SearchProfilesSchema>;

export async function searchProfiles(
  search: SearchProfilesRequest,
): Promise<ProfileResponse[]> {
  return await authenticatedFetch<ProfileResponse[]>(
    `${API_BASE}/v1/profiles/search?${new URLSearchParams(search).toString()}`,
  );
}

export const profileSearchQueryOptions = (options: {
  search: SearchProfilesRequest;
  enabled: boolean;
}) =>
  queryOptions({
    queryKey: ["profiles", "search", options.search],
    queryFn: () => searchProfiles(options.search),
    enabled: options.enabled,
  });
