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

async function fetchProfile(): Promise<ProfileResponse> {
  return await authenticatedFetch<ProfileResponse>(`${API_BASE}/v1/profile`);
}

export const PROFILE_QUERY_KEY = ["profile"];

export const profileQueryOptions = () =>
  queryOptions({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => fetchProfile(),
  });

const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 20;
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
  avatarUrl: z.union([z.string().url().optional(), z.literal(""), z.null()]),
});

export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>;

export async function updateProfile(
  profile: UpdateProfileRequest,
): Promise<ProfileResponse> {
  return await authenticatedFetch<ProfileResponse>(`${API_BASE}/v1/profile`, {
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
