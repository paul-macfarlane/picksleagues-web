import { API_BASE, authenticatedFetch } from "@/lib/api";
import type {
  ProfileResponse,
  SearchProfilesSchema,
  UpdateProfileSchema,
} from "./profiles.types";
import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import type z from "zod";

export async function getProfileByUserId(
  userId: string,
): Promise<ProfileResponse> {
  return await authenticatedFetch<ProfileResponse>(
    `${API_BASE}/v1/profiles/${userId}`,
  );
}

export const GetProfileByUserIdQueryKey = (userId: string) => [
  "profiles",
  userId,
];

export const GetProfileByUserIdQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: GetProfileByUserIdQueryKey(userId),
    queryFn: () => getProfileByUserId(userId),
  });

export const useGetProfileByUserId = (userId: string) => {
  return useQuery({
    queryKey: GetProfileByUserIdQueryKey(userId),
    queryFn: () => getProfileByUserId(userId),
  });
};

export async function updateProfile(
  userId: string,
  profile: z.infer<typeof UpdateProfileSchema>,
): Promise<ProfileResponse> {
  return await authenticatedFetch<ProfileResponse>(
    `${API_BASE}/v1/profiles/${userId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    },
  );
}

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: ({
      userId,
      profile,
    }: {
      userId: string;
      profile: z.infer<typeof UpdateProfileSchema>;
    }) => updateProfile(userId, profile),
  });
};

export async function searchProfiles(
  search: z.infer<typeof SearchProfilesSchema>,
): Promise<ProfileResponse[]> {
  return await authenticatedFetch<ProfileResponse[]>(
    `${API_BASE}/v1/profiles/search?${new URLSearchParams(search).toString()}`,
  );
}

export const SearchProfilesQueryKey = (
  search: z.infer<typeof SearchProfilesSchema>,
) => ["profiles", "search", search];

export const SearchProfilesQueryOptions = (options: {
  search: z.infer<typeof SearchProfilesSchema>;
  enabled: boolean;
}) =>
  queryOptions({
    queryKey: SearchProfilesQueryKey(options.search),
    queryFn: () => searchProfiles(options.search),
    enabled: options.enabled,
  });

export const useSearchProfiles = (
  search: z.infer<typeof SearchProfilesSchema>,
  enabled: boolean,
) => {
  return useQuery({
    queryKey: SearchProfilesQueryKey(search),
    queryFn: () => searchProfiles(search),
    enabled: enabled,
  });
};
