import { authClient } from "@/lib/auth-client";
import { createFileRoute, useParams, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  useGetLeagueInviteByToken,
  useJoinLeagueByInviteToken,
} from "@/features/leagueInvites/leagueInvites.api";
import { JoinLeagueCard } from "@/features/leagueInvites/components/join-league-card";

export const Route = createFileRoute("/join/$token")({
  component: RouteComponent,
});

function RouteComponent() {
  const { token } = useParams({ from: "/join/$token" });
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const {
    data: leagueInvite,
    isLoading: isLoadingLeagueInvite,
    error: leagueInviteError,
  } = useGetLeagueInviteByToken(token, !!session);

  const {
    mutateAsync: joinLeagueByInviteToken,
    isPending: isPendingJoinLeague,
  } = useJoinLeagueByInviteToken();

  async function handleJoinLeague() {
    try {
      await joinLeagueByInviteToken(token);
      toast.success("You have joined the league.");
      router.navigate({
        to: "/football/pick-em/$leagueId",
        params: { leagueId: leagueInvite!.leagueId! },
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to join the league.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <JoinLeagueCard
        leagueInvite={leagueInvite}
        isLoading={isLoadingLeagueInvite}
        error={leagueInviteError}
        isJoining={isPendingJoinLeague}
        onJoin={handleJoinLeague}
        isLoggedIn={!!session?.user}
      />
    </div>
  );
}
