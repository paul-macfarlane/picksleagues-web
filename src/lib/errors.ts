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

export class AppError extends Error {
  constructor(
    message: string,
    public status: number,
    public retryable = false,
    public title = "Something went wrong",
  ) {
    super(message);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, title = "Bad Request") {
    super(message, 400, false, title);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string, title = "Unauthorized") {
    super(message, 401, false, title);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string, title = "Forbidden") {
    super(message, 403, false, title);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, title = "Not Found") {
    super(message, 404, false, title);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string, title = "Something went wrong") {
    super(message, 500, true, title);
  }
}
