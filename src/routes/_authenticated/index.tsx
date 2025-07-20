import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Check, X, Icon } from "lucide-react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { football } from "@lucide/lab";
import { LeagueCard } from "@/features/leagues/components/league-card";
import {
  GetLeagueInvitesForUserQueryKey,
  GetLeagueInvitesForUserQueryOptions,
  useRespondToLeagueInvite,
} from "@/features/leagueInvites/leagueInvites.api";
import { toast } from "sonner";
import { GetMyLeaguesForLeagueTypeQueryOptions } from "@/features/leagues/leagues.api";
import {
  PICK_EM_PICK_TYPE_LABELS,
  type PickEmLeagueResponse,
} from "@/features/leagues/leagues.types";
import { LEAGUE_TYPE_SLUGS } from "@/features/leagueTypes/leagueTypes.types";
import {
  LEAGUE_INVITE_STATUSES,
  type RespondToLeagueInviteSchema,
  LEAGUE_INVITE_INCLUDES,
} from "@/features/leagueInvites/leagueInvites.types";
import z from "zod";
import { HomePageSkeleton } from "@/features/leagues/components/home-page-states";
import { RouteErrorBoundary } from "@/components/route-error-boundary";

export const Route = createFileRoute("/_authenticated/")({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(
      GetLeagueInvitesForUserQueryOptions({
        includes: [
          LEAGUE_INVITE_INCLUDES.LEAGUE,
          LEAGUE_INVITE_INCLUDES.LEAGUE_TYPE,
        ],
      }),
    );
    await queryClient.ensureQueryData(
      GetMyLeaguesForLeagueTypeQueryOptions(LEAGUE_TYPE_SLUGS.PICK_EM),
    );
  },
  pendingComponent: HomePageSkeleton,
  errorComponent: () => <RouteErrorBoundary />,
  pendingMs: 300,
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: pickEmLeagues } = useSuspenseQuery(
    GetMyLeaguesForLeagueTypeQueryOptions<PickEmLeagueResponse>(
      LEAGUE_TYPE_SLUGS.PICK_EM,
    ),
  );

  const { data: leagueInvites } = useSuspenseQuery(
    GetLeagueInvitesForUserQueryOptions({
      includes: [
        LEAGUE_INVITE_INCLUDES.LEAGUE,
        LEAGUE_INVITE_INCLUDES.LEAGUE_TYPE,
      ],
    }),
  );

  const { mutateAsync: respondToLeagueInvite } = useRespondToLeagueInvite();

  const handleRespondToLeagueInvite = async (
    inviteId: string,
    leagueId: string,
    leagueType: LEAGUE_TYPE_SLUGS,
    response: z.infer<typeof RespondToLeagueInviteSchema>,
  ) => {
    try {
      await respondToLeagueInvite({ inviteId, response, leagueId, leagueType });
      if (response.response === LEAGUE_INVITE_STATUSES.ACCEPTED) {
        router.navigate({
          to: "/football/pick-em/$leagueId",
          params: { leagueId },
        });
      } else {
        toast.success("Invite declined");
      }
    } catch (error) {
      const errorMessage = "Error responding to invite";
      if (error instanceof Error) {
        toast.error(`${errorMessage}: ${error.message}`);
      } else {
        toast.error(errorMessage);
      }

      // in most cases, we don't want to invalidate queries after an error
      // but in this special case, the bad invites get cleaned by in the backend
      // so we do want to invalidate the query
      await queryClient.invalidateQueries({
        queryKey: GetLeagueInvitesForUserQueryKey(),
      });
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
        {leagueInvites && leagueInvites.length > 0 ? (
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
                          invite.league!.leagueType!.slug,
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
                          invite.league!.leagueType!.slug,
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
          {pickEmLeagues && pickEmLeagues.length > 0 ? (
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
