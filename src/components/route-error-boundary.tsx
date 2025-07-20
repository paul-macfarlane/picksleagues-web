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

type RouteErrorBoundaryProps = {
  title?: string;
  message?: string;
};

export function RouteErrorBoundary({
  title = "Something went wrong",
  message = "There was an issue loading this page. Please try again.",
}: RouteErrorBoundaryProps) {
  const router = useRouter();
  const { reset } = useQueryErrorResetBoundary();

  return (
    <div className="container flex flex-col justify-center items-center h-full p-4 gap-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{message}</p>
        </CardContent>

        <CardFooter>
          <Button
            onClick={() => {
              reset();
              router.invalidate();
            }}
          >
            Try again
          </Button>
        </CardFooter>
      </Card>

      <Button variant="outline" asChild>
        <Link to="/">Back to Home</Link>
      </Button>
    </div>
  );
}
