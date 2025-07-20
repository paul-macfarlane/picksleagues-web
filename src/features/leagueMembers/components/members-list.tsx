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
import { useUpdateLeagueMember } from "../leagueMembers.api";
import { toast } from "sonner";

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
  const { mutateAsync: updateMember } = useUpdateLeagueMember(leagueId);

  const handleChangeRole = async (
    userId: string,
    role: LEAGUE_MEMBER_ROLES,
  ) => {
    try {
      await updateMember({ userId, update: { role } });
      toast.success("Member role updated successfully.");
    } catch (error) {
      const errorMessage = "Failed to update member role.";
      if (error instanceof Error) {
        toast.error(`${errorMessage}: ${error.message}`);
      } else {
        toast.error(errorMessage);
      }
    }
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
                          handleChangeRole(
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
                          handleChangeRole(
                            member.userId,
                            LEAGUE_MEMBER_ROLES.COMMISSIONER,
                          )
                        }
                      >
                        Make Commissioner
                      </DropdownMenuItem>
                    )}
                    {member.userId !== userId && (
                      <DropdownMenuItem className="text-destructive">
                        Remove Member
                      </DropdownMenuItem>
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
