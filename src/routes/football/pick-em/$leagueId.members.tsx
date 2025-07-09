import { createFileRoute, redirect, useParams } from "@tanstack/react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, UserRound } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  leagueMembersQueryOptions,
  leagueQueryOptions,
  LEAGUE_MEMBER_ROLES,
} from "@/api/leagues";

export const Route = createFileRoute("/football/pick-em/$leagueId/members")({
  component: MembersComponent,
  beforeLoad: async ({ context }) => {
    if (!context.session) {
      throw redirect({ to: "/login" });
    }
  },
  loader: ({ context: { queryClient }, params: { leagueId } }) => {
    queryClient.ensureQueryData(leagueMembersQueryOptions(leagueId));
  },
});

function MembersComponent() {
  const { leagueId } = useParams({
    from: "/football/pick-em/$leagueId/members",
  });
  const { session } = Route.useRouteContext();
  const { data: league } = useSuspenseQuery(leagueQueryOptions(leagueId));
  const { data: members } = useSuspenseQuery(
    leagueMembersQueryOptions(leagueId),
  );

  const currentUserMemberInfo = members.find(
    (member) => member.userId === session?.userId,
  );
  const isCommissioner =
    currentUserMemberInfo?.role === LEAGUE_MEMBER_ROLES.COMMISSIONER;
  const isOffSeason = true; // TODO: get from league season state
  const leagueIsFull = members.length >= league.size;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Members ({members.length})</CardTitle>
        {isCommissioner && isOffSeason && !leagueIsFull && (
          <Button>Invite Member</Button>
        )}
      </CardHeader>
      <CardContent>
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
                        src={member.profile.avatarUrl ?? undefined}
                        alt={`${member.profile.firstName} ${member.profile.lastName}`}
                      />
                      <AvatarFallback>
                        <UserRound className="h-4 w-4 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                    <span>
                      {member.profile.firstName} {member.profile.lastName}
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
      </CardContent>
    </Card>
  );
}
