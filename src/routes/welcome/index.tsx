import { redirect, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/welcome/")({
  component: RouteComponent,
  loader: async () => {
    const authed = false; // todo replace with actual auth check
    if (authed) {
      return redirect({ to: "/app" });
    }
  },
});

function RouteComponent() {
  return <div>Hello "/welcome/"!</div>;
}
