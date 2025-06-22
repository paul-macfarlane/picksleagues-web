import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
  loader: async () => {
    const authed = true; // todo replace with actual auth check
    if (!authed) {
      return redirect({ to: "/login" });
    }
  },
});

function RouteComponent() {
  return <div>Hello "/app/"!</div>;
}
