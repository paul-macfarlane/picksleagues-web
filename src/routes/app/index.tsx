import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.session) {
      throw redirect({ to: "/login" });
    }
  },
});

function RouteComponent() {
  const { navigate } = useRouter();
  async function signOut() {
    try {
      await authClient.signOut();

      navigate({ to: "/login", reloadDocument: true });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <p>Hello!</p>
      <Button onClick={signOut}>Sign out</Button>
    </div>
  );
}
