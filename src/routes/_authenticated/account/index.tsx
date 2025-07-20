import { createFileRoute } from "@tanstack/react-router";
import { AccountManagement } from "@/features/profiles/components/account-management";
import { GetMyLeaguesQueryOptions } from "@/features/leagues/leagues.api";
import { LEAGUE_INCLUDES } from "@/features/leagues/leagues.types";

export const Route = createFileRoute("/_authenticated/account/")({
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(
      GetMyLeaguesQueryOptions([LEAGUE_INCLUDES.MEMBERS]),
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <AccountManagement />;
}
