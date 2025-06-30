import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.session) {
      throw redirect({ to: "/login" });
    }
  },
});

function RouteComponent() {
  const { navigate } = useRouter();
  const { data: session } = authClient.useSession();

  async function signOut() {
    try {
      await authClient.signOut();
      navigate({ to: "/login", reloadDocument: true });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 gap-4">
      <p>Hello {session?.user?.name}!</p>
      <Button variant="default" onClick={signOut}>
        Sign out
      </Button>
    </div>
  );
}
