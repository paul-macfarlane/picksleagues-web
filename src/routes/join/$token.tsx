import { authClient } from "@/lib/auth-client";
import { createFileRoute, useParams, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  GetLeagueInviteByTokenQueryOptions,
  useJoinLeagueByInviteToken,
} from "@/features/leagueInvites/leagueInvites.api";
import { JoinLeagueCard } from "@/features/leagueInvites/components/join-league-card";
import { useSuspenseQuery } from "@tanstack/react-query";
import { JoinLeagueSkeleton } from "@/features/leagueInvites/components/join-league-states";
import { RouteErrorBoundary } from "@/components/route-error-boundary";
import { LEAGUE_INVITE_INCLUDES } from "@/features/leagueInvites/leagueInvites.types";

export const Route = createFileRoute("/join/$token")({
  loader: async ({ context: { queryClient }, params: { token } }) => {
    await queryClient.ensureQueryData(
      GetLeagueInviteByTokenQueryOptions({
        token,
        includes: [
          LEAGUE_INVITE_INCLUDES.LEAGUE,
          LEAGUE_INVITE_INCLUDES.LEAGUE_TYPE,
        ],
      }),
    );
  },
  pendingMs: 300,
  pendingComponent: JoinLeagueSkeleton,
  errorComponent: () => (
    <RouteErrorBoundary
      title="Invite Not Found"
      message="This invite link is either invalid or has expired."
    />
  ),
  component: RouteComponent,
});

function RouteComponent() {
  const { token } = useParams({ from: "/join/$token" });
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const { data: leagueInvite } = useSuspenseQuery(
    GetLeagueInviteByTokenQueryOptions({
      token,
      includes: [
        LEAGUE_INVITE_INCLUDES.LEAGUE,
        LEAGUE_INVITE_INCLUDES.LEAGUE_TYPE,
      ],
    }),
  );

  const {
    mutateAsync: joinLeagueByInviteToken,
    isPending: isPendingJoinLeague,
  } = useJoinLeagueByInviteToken();

  async function handleJoinLeague() {
    try {
      await joinLeagueByInviteToken({
        token,
        leagueId: leagueInvite!.leagueId!,
        leagueType: leagueInvite!.league!.leagueType!.slug,
      });
      toast.success("You have joined the league.");
      router.navigate({
        to: "/football/pick-em/$leagueId",
        params: { leagueId: leagueInvite!.leagueId! },
      });
    } catch (error) {
      const errorMessage = "Failed to join the league.";
      if (error instanceof Error) {
        toast.error(`${errorMessage} ${error.message}`);
      } else {
        toast.error(errorMessage);
      }

      // in the case where there is an error, the invite is invalid and will be cleaned up, so refresh the page

      window.location.reload();
    }
  }

  return (
    <div className="flex items-center justify-center p-4">
      <JoinLeagueCard
        leagueInvite={leagueInvite}
        isJoining={isPendingJoinLeague}
        onJoin={handleJoinLeague}
        isLoggedIn={!!session?.user}
      />
    </div>
  );
}
