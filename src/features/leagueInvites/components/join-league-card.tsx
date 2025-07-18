import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { PopulatedLeagueInviteResponse } from "../leagueInvites.types";
import { Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";

type JoinLeagueCardProps = {
  leagueInvite: PopulatedLeagueInviteResponse;
  isJoining: boolean;
  onJoin: () => void;
  isLoggedIn: boolean;
};

function LoginPromptCard() {
  return (
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
  );
}

function ExpiredInviteCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Invite Expired</CardTitle>
        <CardDescription>
          This invite link has expired. Please request a new one.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export function JoinLeagueCard({
  leagueInvite,
  isJoining,
  onJoin,
  isLoggedIn,
}: JoinLeagueCardProps) {
  if (!isLoggedIn) {
    return <LoginPromptCard />;
  }

  if (new Date(leagueInvite.expiresAt) < new Date()) {
    return <ExpiredInviteCard />;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="items-center text-center">
        <Avatar className="h-24 w-24">
          <AvatarImage
            src={leagueInvite.league?.image ?? undefined}
            alt={leagueInvite.league?.name ?? "Unknown League"}
          />
          <AvatarFallback>
            {leagueInvite.league?.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-2xl pt-2">Join League</CardTitle>
        <CardDescription>
          You've been invited to join{" "}
          <strong>{leagueInvite.league?.name ?? "Unknown League"}</strong>.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground">
          You will join as a{" "}
          <Badge variant="secondary">{leagueInvite.role}</Badge>.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={onJoin} disabled={isJoining} className="w-full">
          {isJoining && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Join League
        </Button>
      </CardFooter>
    </Card>
  );
}
