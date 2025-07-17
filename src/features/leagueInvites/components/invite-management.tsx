import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";
import {
  GetLeagueInvitesQueryKey,
  useDeleteLeagueInvite,
  useGetLeagueInvites,
} from "@/features/leagueInvites/leagueInvites.api";
import { useParams } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import type { PopulatedLeagueMemberResponse } from "@/features/leagueMembers/leagueMembers.types";
import { LEAGUE_INVITE_TYPES } from "../leagueInvites.types";
import { toast } from "sonner";
import { InviteManagementSkeleton } from "./invite-management-skeleton";
import { CreateInviteLinkFormComponent } from "./create-invite-link-form";
import { LinkInviteList } from "./link-invite-list";
import { DirectInviteFormComponent } from "./direct-invite-form";
import { DirectInviteList } from "./direct-invite-list";

type InviteManagementProps = {
  currentMembers: PopulatedLeagueMemberResponse[];
};

export function InviteManagement({ currentMembers }: InviteManagementProps) {
  const { leagueId } = useParams({
    from: "/football/pick-em/$leagueId/members",
  });
  const {
    data: invites,
    isLoading: isInvitesLoading,
    error: invitesError,
  } = useGetLeagueInvites(leagueId, true);
  const queryClient = useQueryClient();

  const { mutateAsync: deactivateInvite } = useDeleteLeagueInvite();

  async function handleDeactivate(inviteId: string) {
    try {
      await deactivateInvite(inviteId);
      toast.success("Invite link deactivated");
      queryClient.invalidateQueries({
        queryKey: GetLeagueInvitesQueryKey(leagueId),
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to deactivate invite link");
      }
    }
  }

  if (isInvitesLoading) {
    return <InviteManagementSkeleton />;
  }

  if (invitesError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invite Management</CardTitle>
          <CardDescription>
            There was an error loading the invites.
          </CardDescription>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
          <h3 className="mt-2 text-lg font-semibold">Something went wrong</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {invitesError.message}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() =>
              queryClient.refetchQueries({
                queryKey: GetLeagueInvitesQueryKey(leagueId),
              })
            }
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const linkInvites = invites!.filter(
    (invite) => invite.type === LEAGUE_INVITE_TYPES.LINK,
  );
  const directInvites = invites!.filter(
    (invite) => invite.type === LEAGUE_INVITE_TYPES.DIRECT,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <CreateInviteLinkFormComponent />
        <LinkInviteList invites={linkInvites} onDeactivate={handleDeactivate} />
        <Separator />
        <DirectInviteFormComponent
          currentMembers={currentMembers}
          invites={directInvites}
        />
        <DirectInviteList
          invites={directInvites}
          onDeactivate={handleDeactivate}
        />
      </CardContent>
    </Card>
  );
}
