import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { ApiError } from "@/lib/errors";

type RouteErrorBoundaryProps = {
  error?: Error;
};

function extractErrorData(error: Error): {
  title: string;
  message: string;
  isRetryable: boolean;
} {
  let title = "Something went wrong";
  let message = "There was an unexpected error.";
  let isRetryable = true;
  if (error instanceof ApiError) {
    title = error.title;
    message = error.message;
    isRetryable = error.retryable;
  } else if (!(error instanceof ApiError) && error.cause instanceof ApiError) {
    title = error.cause.title;
    message = error.cause.message;
    isRetryable = error.cause.retryable;
  }

  return {
    title,
    message,
    isRetryable,
  };
}

export function RouteErrorBoundary({ error }: RouteErrorBoundaryProps) {
  const router = useRouter();
  const { reset } = useQueryErrorResetBoundary();

  const { title, message, isRetryable } = extractErrorData(
    error ?? new Error(),
  );

  return (
    <div className="container flex flex-col justify-center items-center h-full p-4 gap-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{message}</p>
        </CardContent>

        <CardFooter className="flex gap-2">
          {isRetryable && (
            <Button
              onClick={() => {
                reset();
                router.invalidate();
              }}
            >
              Try again
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
