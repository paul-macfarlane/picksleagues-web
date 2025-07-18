import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useDeleteLeagueInvite } from "@/features/leagueInvites/leagueInvites.api";
import { useParams } from "@tanstack/react-router";
import type { PopulatedLeagueMemberResponse } from "@/features/leagueMembers/leagueMembers.types";
import {
  LEAGUE_INVITE_TYPES,
  type PopulatedLeagueInviteResponse,
} from "../leagueInvites.types";
import { toast } from "sonner";
import { CreateInviteLinkFormComponent } from "./create-invite-link-form";
import { LinkInviteList } from "./link-invite-list";
import { DirectInviteFormComponent } from "./direct-invite-form";
import { DirectInviteList } from "./direct-invite-list";

type InviteManagementProps = {
  currentMembers: PopulatedLeagueMemberResponse[];
  invites: PopulatedLeagueInviteResponse[];
};

export function InviteManagement({
  currentMembers,
  invites,
}: InviteManagementProps) {
  const { leagueId } = useParams({
    from: "/_authenticated/football/pick-em/$leagueId/members",
  });
  const { mutateAsync: deactivateInvite } = useDeleteLeagueInvite();

  async function handleDeactivate(inviteId: string) {
    try {
      await deactivateInvite({ inviteId, leagueId });
      toast.success("Invite link deactivated");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to deactivate invite link");
      }
    }
  }

  const linkInvites = invites.filter(
    (invite) => invite.type === LEAGUE_INVITE_TYPES.LINK,
  );
  const directInvites = invites.filter(
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
