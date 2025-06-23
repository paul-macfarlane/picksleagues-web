import { Button } from "@/components/ui/button";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
  beforeLoad: async () => {
    const authed = true; // TODO: check if user is authed
    if (!authed) {
      throw redirect({ to: "/login" });
    }
  },
});

function RouteComponent() {
  async function signOut() {
    // TODO: implement
  }

  return (
    <div>
      <p>Hello!</p>
      <Button onClick={signOut}>Sign out</Button>
    </div>
  );
}
