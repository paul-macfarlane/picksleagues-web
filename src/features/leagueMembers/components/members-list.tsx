import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { UserDisplay } from "@/components/ui/user-display";
import {
  LEAGUE_MEMBER_ROLES,
  type PopulatedLeagueMemberResponse,
} from "@/features/leagueMembers/leagueMembers.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdateLeagueMember, useRemoveMember } from "../leagueMembers.api";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useLeaveLeague } from "@/features/leagueMembers/leagueMembers.api";
import { useRouter } from "@tanstack/react-router";

type MembersListProps = {
  members: PopulatedLeagueMemberResponse[];
  canRemoveMembers: boolean;
  canEditMemberRoles: boolean;
  canLeaveLeague: boolean;
  isSoleMember: boolean;
  userId: string;
  leagueId: string;
};

export function MembersList({
  members,
  canRemoveMembers,
  canEditMemberRoles,
  canLeaveLeague,
  isSoleMember,
  userId,
  leagueId,
}: MembersListProps) {
  const { mutate: updateMember } = useUpdateLeagueMember();
  const { mutate: removeMember } = useRemoveMember(leagueId);
  const { mutate: leaveLeague } = useLeaveLeague();
  const router = useRouter();

  const handleUpdateMember = (userId: string, role: LEAGUE_MEMBER_ROLES) => {
    updateMember(
      { leagueId, userId, update: { role } },
      {
        onSuccess: () => {
          toast.success("Member role updated successfully.");
        },
        onError: (error) => {
          toast.error(`Failed to update member role: ${error.message}`);
        },
      },
    );
  };

  const handleRemoveMember = (userId: string) => {
    removeMember(userId, {
      onSuccess: () => {
        toast.success("Member removed successfully.");
      },
      onError: (error) => {
        toast.error(`Failed to remove member: ${error.message}`);
      },
    });
  };

  const handleLeaveLeague = () => {
    leaveLeague(leagueId, {
      onSuccess: () => {
        router.navigate({ to: "/" });
        toast.success("You have left the league.");
      },
      onError: (error: Error) => {
        toast.error(`Failed to leave the league: ${error.message}`);
      },
    });
  };

  const isSoleCommissioner =
    members.filter((m) => m.role === LEAGUE_MEMBER_ROLES.COMMISSIONER)
      .length === 1;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.userId}>
            <TableCell className="font-medium">
              <UserDisplay
                profile={member.profile!}
                showUsername={true}
                showFullName={true}
                avatarSize="md"
              />
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  member.role === LEAGUE_MEMBER_ROLES.COMMISSIONER
                    ? "default"
                    : "secondary"
                }
                className={
                  member.role === LEAGUE_MEMBER_ROLES.COMMISSIONER
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-600 hover:bg-gray-700"
                }
              >
                {member.role === LEAGUE_MEMBER_ROLES.COMMISSIONER
                  ? "Commissioner"
                  : "Member"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              {(canRemoveMembers ||
                canEditMemberRoles ||
                (member.userId === userId && canLeaveLeague)) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <>
                      {canEditMemberRoles &&
                      member.role === LEAGUE_MEMBER_ROLES.COMMISSIONER ? (
                        <DropdownMenuItem
                          disabled={
                            isSoleCommissioner && member.userId === userId
                          }
                          onClick={() =>
                            handleUpdateMember(
                              member.userId,
                              LEAGUE_MEMBER_ROLES.MEMBER,
                            )
                          }
                        >
                          Make Member
                        </DropdownMenuItem>
                      ) : canEditMemberRoles &&
                        member.role === LEAGUE_MEMBER_ROLES.MEMBER ? (
                        <DropdownMenuItem
                          onClick={() =>
                            handleUpdateMember(
                              member.userId,
                              LEAGUE_MEMBER_ROLES.COMMISSIONER,
                            )
                          }
                        >
                          Make Commissioner
                        </DropdownMenuItem>
                      ) : null}
                      {member.userId !== userId && canRemoveMembers && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="text-destructive"
                              onSelect={(e) => e.preventDefault()}
                            >
                              Remove Member
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure you want to remove this member?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                The member will be removed from the league and
                                an invite will be requested to be sent to them
                                to re-join the league.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleRemoveMember(member.userId)
                                }
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </>
                    {member.userId === userId && canLeaveLeague && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            className="text-destructive"
                            onSelect={(e) => e.preventDefault()}
                          >
                            Leave League
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure you want to leave this league?{" "}
                              {isSoleMember &&
                                "This will delete the league and all associated data."}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleLeaveLeague}>
                              Leave
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
