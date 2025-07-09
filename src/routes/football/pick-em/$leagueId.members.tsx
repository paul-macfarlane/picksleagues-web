import { createFileRoute, redirect } from "@tanstack/react-router";
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
import { X } from "lucide-react";

// Mock members data
const mockMembers = [
  {
    id: "usr1",
    name: "Alice",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    role: "Commissioner",
  },
  {
    id: "usr2",
    name: "Bob",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026705d",
    role: "Member",
  },
  {
    id: "usr3",
    name: "Charlie",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026706d",
    role: "Member",
  },
];

export const Route = createFileRoute("/football/pick-em/$leagueId/members")({
  component: MembersComponent,
  beforeLoad: async ({ context }) => {
    if (!context.session) {
      throw redirect({ to: "/login" });
    }
  },
});

function MembersComponent() {
  // TODO: Refactor to get isCommissioner and seasonState from API
  const isCommissioner = false;
  const isOffSeason = true;
  const leagueIsFull = mockMembers.length >= 10; // Mocked logic

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Members ({mockMembers.length})</CardTitle>
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
            {mockMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{member.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {member.role === "Commissioner" && (
                    <Badge>{member.role}</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {isOffSeason &&
                    isCommissioner /*|| member.id === "usr2"*/ && // TODO: check if current user is member
                    member.role !== "Commissioner" && (
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
