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
import {
  X,
  UserRound,
  Copy,
  PlusCircle,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import {
  leagueMembersQueryOptions,
  leagueInvitesQueryOptions,
  useCreateLeagueInvite,
  useDeactivateLeagueInvite,
  type CreateLeagueInvite,
  LEAGUE_MEMBER_ROLES,
  type LeagueInviteResponse,
  createLeagueInviteSchema,
} from "@/api/leagues";
import { Separator } from "@/components/ui/separator";
import { useForm } from "@tanstack/react-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/football/pick-em/$leagueId/members")({
  component: MembersComponent,
  beforeLoad: async ({ context }) => {
    if (!context.session) {
      throw redirect({ to: "/login" });
    }
  },
  loader: ({ context: { queryClient }, params: { leagueId } }) => {
    queryClient.ensureQueryData(leagueMembersQueryOptions(leagueId));
    queryClient.ensureQueryData(leagueInvitesQueryOptions(leagueId));
  },
});

function MembersComponent() {
  const { leagueId } = useParams({
    from: "/football/pick-em/$leagueId/members",
  });
  const { session } = Route.useRouteContext();
  const { data: members } = useSuspenseQuery(
    leagueMembersQueryOptions(leagueId),
  );

  const currentUserMemberInfo = members.find(
    (member) => member.userId === session?.userId,
  );
  const isCommissioner =
    currentUserMemberInfo?.role === LEAGUE_MEMBER_ROLES.COMMISSIONER;
  const isOffSeason = true; // TODO: get from league season state

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Members ({members.length})</CardTitle>
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

      {isCommissioner && <InviteManagement />}
    </div>
  );
}

function InviteManagement() {
  const { leagueId } = useParams({
    from: "/football/pick-em/$leagueId/members",
  });
  const { data: invites } = useSuspenseQuery(
    leagueInvitesQueryOptions(leagueId),
  );
  const queryClient = useQueryClient();

  const { mutate: deactivateInvite } = useDeactivateLeagueInvite();

  const handleDeactivate = (inviteId: string) => {
    deactivateInvite(inviteId, {
      onSuccess: () => {
        toast.success("Invite link deactivated");
        queryClient.invalidateQueries({
          queryKey: leagueInvitesQueryOptions(leagueId).queryKey,
        });
      },
      onError: () => {
        toast.error("Failed to deactivate invite link");
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Link Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <CreateInviteForm />
        <Separator />
        <InviteList invites={invites} onDeactivate={handleDeactivate} />
      </CardContent>
    </Card>
  );
}

function CreateInviteForm() {
  const { leagueId } = useParams({
    from: "/football/pick-em/$leagueId/members",
  });
  const queryClient = useQueryClient();
  const { mutate: createInvite, isPending } = useCreateLeagueInvite(leagueId);

  const form = useForm({
    defaultValues: {
      role: LEAGUE_MEMBER_ROLES.MEMBER,
      maxUses: undefined,
      expiresAt: undefined,
    } as CreateLeagueInvite,
    onSubmit: async ({ value }) => {
      createInvite(value, {
        onSuccess: () => {
          toast.success("Invite link created");
          form.reset();
          queryClient.invalidateQueries({
            queryKey: leagueInvitesQueryOptions(leagueId).queryKey,
          });
        },
        onError: () => {
          toast.error("Failed to create invite link");
        },
      });
    },
    validators: {
      onSubmit: createLeagueInviteSchema,
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <form.Field name="role">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Role</Label>
              <Select
                name={field.name}
                value={field.state.value}
                onValueChange={(value) =>
                  field.handleChange(value as LEAGUE_MEMBER_ROLES)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={LEAGUE_MEMBER_ROLES.MEMBER}>
                    Member
                  </SelectItem>
                  <SelectItem value={LEAGUE_MEMBER_ROLES.COMMISSIONER}>
                    Commissioner
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </form.Field>

        <form.Field name="maxUses">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Max Uses (optional)</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value ?? ""}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(
                    e.target.value === "" ? undefined : e.target.valueAsNumber,
                  )
                }
                type="number"
                placeholder="5"
              />
            </div>
          )}
        </form.Field>
        <form.Field name="expiresAt">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Expires At (optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id={field.name}
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.state.value && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.state.value ? (
                      format(field.state.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      field.state.value
                        ? new Date(field.state.value)
                        : undefined
                    }
                    onSelect={(value) =>
                      field.handleChange(value ? value.getTime() : undefined)
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </form.Field>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create Invite"}
          <PlusCircle className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

interface InviteListProps {
  invites: LeagueInviteResponse[];
  onDeactivate: (inviteId: string) => void;
}

function InviteList({ invites, onDeactivate }: InviteListProps) {
  const handleCopy = (token: string) => {
    const url = `${window.location.origin}/join/${token}`;
    navigator.clipboard.writeText(url);
    toast.success("Invite link copied to clipboard");
  };

  if (invites.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No active invite links yet. Create one above to invite members to your
        league.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Token</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Uses</TableHead>
          <TableHead>Expires</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invites.map((invite) => (
          <TableRow key={invite.id}>
            <TableCell className="font-mono">{invite.token}</TableCell>
            <TableCell>
              <Badge variant="outline">{invite.role}</Badge>
            </TableCell>
            <TableCell>
              {invite.uses} / {invite.maxUses ?? "∞"}
            </TableCell>
            <TableCell>
              {invite.expiresAt
                ? format(new Date(invite.expiresAt), "MMM d, yyyy")
                : "Never"}
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(invite.token)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => onDeactivate(invite.id)}
              >
                <X className="h-4 w-4 mr-2" />
                Deactivate
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
