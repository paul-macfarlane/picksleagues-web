import z from "zod";

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

export async function detectAndThrowError(response: Response) {
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
