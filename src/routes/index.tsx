import {
  createFileRoute,
  Link,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Check, X, Icon, AlertCircle } from "lucide-react";
import {
  LEAGUE_TYPE_SLUGS,
  myLeaguesForLeagueTypeQueryOptions,
} from "@/api/leagueTypes";
import { useQuery } from "@tanstack/react-query";
import {
  PICK_EM_PICK_TYPE_LABELS,
  type PickEmLeagueResponse,
} from "@/api/leagues";
import { football } from "@lucide/lab";
import {
  LeagueCard,
  LeagueCardSkeleton,
} from "@/components/league/league-card";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LEAGUE_INVITE_STATUSES,
  useLeagueInvitesForUser,
  useRespondToLeagueInvite,
  type RespondToLeagueInvite,
} from "@/api/leagueInvites";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.session) {
      throw redirect({ to: "/login" });
    }
  },
});

function RouteComponent() {
  const router = useRouter();

  const {
    data: pickEmLeagues,
    isLoading: pickEmLeaguesIsLoading,
    error: pickEmLeaguesError,
  } = useQuery(
    myLeaguesForLeagueTypeQueryOptions<PickEmLeagueResponse>(
      LEAGUE_TYPE_SLUGS.PICK_EM,
    ),
  );

  const {
    data: leagueInvites,
    isLoading: leagueInvitesIsLoading,
    error: leagueInvitesError,
  } = useLeagueInvitesForUser();

  const { mutateAsync: respondToLeagueInvite } = useRespondToLeagueInvite();

  const handleRespondToLeagueInvite = async (
    inviteId: string,
    leagueId: string,
    response: RespondToLeagueInvite,
  ) => {
    try {
      await respondToLeagueInvite({ inviteId, response });
      if (response.response === LEAGUE_INVITE_STATUSES.ACCEPTED) {
        router.navigate({
          to: "/football/pick-em/$leagueId",
          params: { leagueId },
        });
      } else {
        toast.success("Invite declined");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container py-4 md:py-8 space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Home</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening in your leagues.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
          Open Invites
        </h2>
        {leagueInvitesIsLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <LeagueCardSkeleton />
            <LeagueCardSkeleton />
            <LeagueCardSkeleton />
          </div>
        ) : leagueInvitesError ? (
          <Card>
            <CardHeader className="flex-row items-center gap-2">
              <AlertCircle className="h-6 w-6 text-destructive" />
              <div>
                <CardTitle className="text-base">
                  Error loading invites
                </CardTitle>
                <CardDescription>
                  {leagueInvitesError instanceof Error
                    ? leagueInvitesError.message
                    : "Please try again later."}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        ) : leagueInvites && leagueInvites.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {leagueInvites.map((invite) => (
              <LeagueCard
                key={invite.id}
                name={invite.league?.name ?? "Unknown League"}
                imageUrl={invite.league?.image ?? undefined}
                description={
                  <>
                    Invited to join a{" "}
                    {invite.league?.leagueType?.name ?? "Unknown League Type"}{" "}
                    league.
                  </>
                }
                footer={
                  <div className="flex w-full justify-end gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        handleRespondToLeagueInvite(
                          invite.id,
                          invite.leagueId,
                          {
                            response: LEAGUE_INVITE_STATUSES.DECLINED,
                          },
                        )
                      }
                    >
                      <X className="mr-2 h-4 w-4" /> Decline
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        handleRespondToLeagueInvite(
                          invite.id,
                          invite.leagueId,
                          {
                            response: LEAGUE_INVITE_STATUSES.ACCEPTED,
                          },
                        )
                      }
                    >
                      <Check className="mr-2 h-4 w-4" /> Accept
                    </Button>
                  </div>
                }
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No open invites right now.</p>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
          My Leagues
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon iconNode={football} className="w-6 h-6 text-primary" />
              <h3 className="text-lg md:text-xl font-semibold">
                Football Pick'em
              </h3>
            </div>
            <Button variant="link" asChild>
              <Link to="/football/pick-em">View All</Link>
            </Button>
          </div>
          {pickEmLeaguesIsLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <LeagueCardSkeleton />
              <LeagueCardSkeleton />
              <LeagueCardSkeleton />
            </div>
          ) : pickEmLeaguesError ? (
            <Card>
              <CardHeader className="flex-row items-center gap-2">
                <AlertCircle className="h-6 w-6 text-destructive" />
                <div>
                  <CardTitle className="text-base">
                    Error loading leagues
                  </CardTitle>
                  <CardDescription>
                    {pickEmLeaguesError instanceof Error
                      ? pickEmLeaguesError.message
                      : "Please try again later."}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          ) : pickEmLeagues && pickEmLeagues.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pickEmLeagues.slice(0, 3).map((league) => (
                <Link
                  key={league.id}
                  to="/football/pick-em/$leagueId"
                  params={{ leagueId: league.id }}
                  className="transition-transform hover:scale-[1.02]"
                >
                  <LeagueCard
                    name={league.name}
                    imageUrl={league.image}
                    description={
                      PICK_EM_PICK_TYPE_LABELS[league.settings.pickType]
                    }
                    content={
                      <p className="text-sm text-muted-foreground">
                        {league.settings.picksPerPhase} pick
                        {league.settings.picksPerPhase === 1 ? "" : "s"} per
                        week
                      </p>
                    }
                  />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              You haven't joined any Pick'em leagues yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
