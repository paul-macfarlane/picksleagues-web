import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/football/pick-em/$leagueId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/football/pickem/$leagueId"!</div>;
}
