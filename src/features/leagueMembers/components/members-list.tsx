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
import { X, UserRound } from "lucide-react";
import {
  LEAGUE_MEMBER_ROLES,
  type PopulatedLeagueMemberResponse,
} from "@/features/leagueMembers/leagueMembers.types";
import type { Session } from "better-auth";

type MembersListProps = {
  members: PopulatedLeagueMemberResponse[];
  session: Session | null | undefined;
  isCommissioner: boolean;
  isOffSeason: boolean;
};

export function MembersList({
  members,
  session,
  isCommissioner,
  isOffSeason,
}: MembersListProps) {
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
              {isOffSeason &&
                isCommissioner &&
                member.userId !== session?.userId &&
                member.role !== LEAGUE_MEMBER_ROLES.COMMISSIONER && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
