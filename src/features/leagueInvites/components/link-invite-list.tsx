import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Copy, X } from "lucide-react";
import type { LeagueInviteResponse } from "../leagueInvites.types";
import { toast } from "sonner";

type LinkInviteListProps = {
  invites: LeagueInviteResponse[];
  onDeactivate: (inviteId: string) => void;
};

export function LinkInviteList({ invites, onDeactivate }: LinkInviteListProps) {
  const handleCopy = (token: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/join/${token}`);
    toast.success("Invite link copied to clipboard");
  };

  return (
    <div>
      <h3 className="text-lg font-medium">Active Invite Links</h3>
      <div className="rounded-md border mt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Link</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invites.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No active invite links
                </TableCell>
              </TableRow>
            )}
            {invites.map((invite) => (
              <TableRow key={invite.id}>
                <TableCell>{invite.role}</TableCell>
                <TableCell>
                  {new Date(invite.expiresAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(invite.token)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
