import { redirect, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/welcome/")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (context.session) {
      throw redirect({ to: "/app" });
    }
  },
});

function RouteComponent() {
  return <div>Hello "/welcome/"!</div>;
}
