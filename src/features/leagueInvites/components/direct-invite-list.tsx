import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserRound, X } from "lucide-react";
import type { PopulatedLeagueInviteResponse } from "../leagueInvites.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function DirectInviteRow({
  invite,
  onDeactivate,
}: {
  invite: PopulatedLeagueInviteResponse;
  onDeactivate: (inviteId: string) => void;
}) {
  return (
    <TableRow key={invite.id}>
      <TableCell>
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={invite.invitee?.avatarUrl ?? undefined}
              alt={invite.invitee?.username}
            />
            <AvatarFallback>
              <UserRound className="h-4 w-4 text-primary" />
            </AvatarFallback>
          </Avatar>
          <span>
            {invite.invitee?.firstName} {invite.invitee?.lastName}
          </span>
        </div>
      </TableCell>
      <TableCell>{invite.invitee?.username}</TableCell>
      <TableCell className="hidden sm:table-cell">
        {new Date(invite.expiresAt).toLocaleString()}
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive"
          onClick={() => onDeactivate(invite.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

type DirectInviteListProps = {
  invites: PopulatedLeagueInviteResponse[];
  onDeactivate: (inviteId: string) => void;
};

export function DirectInviteList({
  invites,
  onDeactivate,
}: DirectInviteListProps) {
  return (
    <div>
      <h3 className="text-lg font-medium">Direct Invites</h3>
      <div className="rounded-md border mt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead className="hidden sm:table-cell">Expires</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invites.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No active direct invites
                </TableCell>
              </TableRow>
            )}
            {invites.map((invite) => (
              <DirectInviteRow
                key={invite.id}
                invite={invite}
                onDeactivate={onDeactivate}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
