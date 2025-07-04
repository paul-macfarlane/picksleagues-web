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

  return (await response.json()) as T;
}

type ErrorResponse = {
  error: string;
};

async function detectAndThrowError(response: Response) {
  if (!response.ok) {
    const errorResponse = (await response.json()) as ErrorResponse;

    switch (response.status) {
      case 400:
        throw new BadRequestError(errorResponse.error);
      case 401:
        throw new UnauthorizedError(errorResponse.error);
      case 403:
        throw new ForbiddenError(errorResponse.error);
      case 404:
        throw new NotFoundError(errorResponse.error);
      default:
        throw new InternalServerError(errorResponse.error);
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
