import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserRound, MoreVertical } from "lucide-react";
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

type MembersListProps = {
  members: PopulatedLeagueMemberResponse[];
  canManageMembers: boolean;
  userId: string;
  leagueId: string;
};

export function MembersList({
  members,
  canManageMembers,
  userId,
  leagueId,
}: MembersListProps) {
  const { mutate: updateMember } = useUpdateLeagueMember();
  const { mutate: removeMember } = useRemoveMember(leagueId);

  const handleUpdateMember = (userId: string, role: LEAGUE_MEMBER_ROLES) => {
    updateMember(
      { leagueId, userId, update: { role } },
      {
        onSuccess: () => {
          toast.success("Member role updated successfully.");
        },
        onError: (error: Error) => {
          const errorMessage = "Failed to update member role.";
          if (error instanceof Error) {
            toast.error(`${errorMessage}: ${error.message}`);
          } else {
            toast.error(errorMessage);
          }
        },
      },
    );
  };

  const handleRemoveMember = (userId: string) => {
    removeMember(userId, {
      onSuccess: () => {
        toast.success("Member removed successfully.");
      },
      onError: (error: Error) => {
        const errorMessage = "Failed to remove member.";
        if (error instanceof Error) {
          toast.error(`${errorMessage}: ${error.message}`);
        } else {
          toast.error(errorMessage);
        }
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
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={member.profile?.avatarUrl ?? undefined}
                    alt={`${member.profile?.firstName} ${member.profile?.lastName}`}
                  />
                  <AvatarFallback>
                    <UserRound className="h-4 w-4 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <span>
                  {member.profile?.firstName} {member.profile?.lastName}
                </span>
              </div>
            </TableCell>
            <TableCell>
              {member.role === LEAGUE_MEMBER_ROLES.COMMISSIONER && (
                <Badge>{member.role}</Badge>
              )}
            </TableCell>
            <TableCell className="text-right">
              {canManageMembers && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {member.role === LEAGUE_MEMBER_ROLES.COMMISSIONER ? (
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
                    ) : (
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
                    )}
                    {member.userId !== userId && (
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
                              The member will be removed from the league and an
                              invite will be requested to be sent to them to
                              re-join the league.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRemoveMember(member.userId)}
                            >
                              Remove
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
