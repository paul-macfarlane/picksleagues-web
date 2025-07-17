import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

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
    <div className="container flex flex-col justify-center items-center h-full p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{message}</p>
        </CardContent>
      </Card>
      <Button
        onClick={() => {
          reset();
          router.invalidate();
        }}
        className="mt-4"
      >
        Try again
      </Button>
    </div>
  );
}
