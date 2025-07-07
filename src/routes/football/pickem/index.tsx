import { createFileRoute } from "@tanstack/react-router";

// todo, a bit pedantic, but this should probably be /pick-em
export const Route = createFileRoute("/football/pickem/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/football/pickem"!</div>;
}
