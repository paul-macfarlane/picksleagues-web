import {
  useJoinLeagueByInviteToken,
  useLeagueInviteByToken,
} from "@/api/leagueInvites";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import {
  createFileRoute,
  Link,
  useParams,
  useRouter,
} from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { LeagueCardSkeleton } from "@/components/league/league-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/join/$token")({
  component: RouteComponent,
});

function RouteComponent() {
  const { token } = useParams({ from: "/join/$token" });
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const {
    data: leagueInvite,
    isLoading,
    isError,
    error,
  } = useLeagueInviteByToken({
    token,
    enabled: !!session,
  });

  const { mutateAsync: joinLeagueByInviteToken, isPending } =
    useJoinLeagueByInviteToken();

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

  if (!session?.user) {
    return (
      <div className="flex justify-center items-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Please Log In</CardTitle>
            <CardDescription>
              You need to be logged in to accept this invitation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/login">Log In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <div className="w-full max-w-md">
          <LeagueCardSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              {error instanceof Error
                ? error.message
                : "Could not load invite."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!leagueInvite) {
    return (
      <div className="flex justify-center items-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Invalid Invite</CardTitle>
            <CardDescription>
              This invite link is invalid or has been used.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (new Date(leagueInvite.expiresAt) < new Date()) {
    return (
      <div className="flex justify-center items-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Invite Expired</CardTitle>
            <CardDescription>
              This invite link has expired. Please request a new one.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={leagueInvite.league.image ?? undefined}
              alt={leagueInvite.league.name}
            />
            <AvatarFallback>
              {leagueInvite.league.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl pt-2">Join League</CardTitle>
          <CardDescription>
            You've been invited to join{" "}
            <strong>{leagueInvite.league.name}</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            You will join as a{" "}
            <Badge variant="secondary">{leagueInvite.role}</Badge>.
          </p>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleJoinLeague}
            disabled={isPending}
            className="w-full"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Join League
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
