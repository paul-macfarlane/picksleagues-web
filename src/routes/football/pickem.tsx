import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/football/pickem")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/football/pickem"!</div>;
}
