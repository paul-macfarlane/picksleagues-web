import { redirect, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/welcome/")({
  component: RouteComponent,
  beforeLoad: async () => {
    const authed = false; // TODO: check if user is authed
    if (authed) {
      throw redirect({ to: "/app" });
    }
  },
});

function RouteComponent() {
  return <div>Hello "/welcome/"!</div>;
}
