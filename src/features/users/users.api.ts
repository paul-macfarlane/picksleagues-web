import { API_BASE, authenticatedFetch } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export async function deleteAccount(): Promise<void> {
  await authenticatedFetch<void>(`${API_BASE}/v1/users/me`, {
    method: "DELETE",
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: deleteAccount,
    // no need to invalidate queries for the profile, since the user will be logged out and will not be logging back in
  });
}
