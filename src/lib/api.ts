import { detectAndThrowError } from "./errors";

export const API_BASE = import.meta.env.VITE_API_BASE;

export async function unauthenticatedFetch<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(url, {
    ...options,
  });

  await detectAndThrowError(response);

  return (await response.json()) as T;
}

export async function authenticatedFetch<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(url, {
    credentials: "include",
    ...options,
  });

  await detectAndThrowError(response);

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}
