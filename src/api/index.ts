import z from "zod";

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

// need to maintain this until we have migrated all the clients to the new error response format
const legacyErrorResponseSchema = z.object({
  error: z.string(),
});

const errorResponseSchema = z.object({
  error: z.object({
    message: z.string(),
    code: z.string(),
  }),
});

async function detectAndThrowError(response: Response) {
  if (!response.ok) {
    const errorResponse = await response.json();
    let errorMessage = "";

    const legacyErrorResponse =
      legacyErrorResponseSchema.safeParse(errorResponse);

    if (legacyErrorResponse.success) {
      errorMessage = legacyErrorResponse.data.error;
    }

    const newErrorResponse = errorResponseSchema.safeParse(errorResponse);
    if (newErrorResponse.success) {
      errorMessage = newErrorResponse.data.error.message;
    }

    switch (response.status) {
      case 400:
        throw new BadRequestError(errorMessage);
      case 401:
        throw new UnauthorizedError(errorMessage);
      case 403:
        throw new ForbiddenError(errorMessage);
      case 404:
        throw new NotFoundError(errorMessage);
      default:
        throw new InternalServerError(errorMessage);
    }
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string) {
    super(message, 403);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string) {
    super(message, 500);
  }
}
