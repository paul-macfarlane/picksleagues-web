import { createFileRoute, redirect } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import googleLogo from "@/assets/google.svg";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/login/")({
  component: RouteComponent,
  beforeLoad: async () => {
    const authed = false; // TODO: check if user is authed
    if (authed) {
      throw redirect({ to: "/app" });
    }
  },
});

function RouteComponent() {
  async function signInWithGoogle() {
    // TODO: implement
  }

  return (
    <div className={"flex min-h-screen items-center justify-center p-4"}>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Sign in to Picks Leagues
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 py-6 text-base font-semibold"
            onClick={signInWithGoogle}
          >
            <img src={googleLogo} alt="Google" className="h-6 w-6 mr-2" />
            Sign in with Google
          </Button>
          <Link
            to="/welcome"
            className="block text-center text-sm hover:underline mt-2"
          >
            Back to Welcome
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
