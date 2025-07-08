import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/football/pickem/$leagueId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/football/pickem/$leagueId"!</div>;
}
