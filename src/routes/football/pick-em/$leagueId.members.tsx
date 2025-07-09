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
import { X, UserRound, Copy, ChevronsUpDown, Check } from "lucide-react";
import {
  useSuspenseQuery,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import {
  leagueInvitesQueryOptions,
  useCreateLeagueInvite,
  useDeactivateLeagueInvite,
  LEAGUE_INVITE_TYPES,
  type CreateLeagueInvite,
  CreateLeagueInviteSchema,
  MIN_LEAGUE_INVITE_EXPIRATION_DAYS,
  type LeagueInviteResponse,
} from "@/api/leagueInvites";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { userSearchQueryOptions } from "@/api/profiles";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import React, { useState } from "react";
import { useAppForm } from "@/components/form";
import {
  leagueMembersQueryOptions,
  LEAGUE_MEMBER_ROLES,
} from "@/api/leagueMembers";

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
        <CardTitle>Invite Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <CreateInviteLinkFormComponent />
        <Separator />
        <DirectInviteFormComponent />
        <Separator />
        <InviteList invites={invites} onDeactivate={handleDeactivate} />
      </CardContent>
    </Card>
  );
}

// todo should validate that the leagueId is valid

function CreateInviteLinkFormComponent() {
  const { leagueId } = useParams({
    from: "/football/pick-em/$leagueId/members",
  });
  const queryClient = useQueryClient();
  const { mutateAsync: createInvite, isPending } = useCreateLeagueInvite();
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);

  const form = useAppForm({
    defaultValues: {
      leagueId,
      type: LEAGUE_INVITE_TYPES.LINK,
      role: LEAGUE_MEMBER_ROLES.MEMBER,
      expiresInDays: MIN_LEAGUE_INVITE_EXPIRATION_DAYS,
    } as CreateLeagueInvite,
    onSubmit: async ({ value }) => {
      try {
        await createInvite({ ...value, type: LEAGUE_INVITE_TYPES.LINK });
        toast.success("Invite link created");
        form.reset();
        queryClient.invalidateQueries({
          queryKey: leagueInvitesQueryOptions(leagueId).queryKey,
        });
      } catch (error) {
        if (error instanceof Error) {
          setSubmitError(error.message);
        } else {
          setSubmitError("An unknown error occurred");
        }
      }
    },
    validators: {
      onSubmit: CreateLeagueInviteSchema,
    },
  });

  return (
    <div>
      <h3 className="text-lg font-medium">Create Invite Link</h3>
      <p className="text-sm text-muted-foreground">
        Create a new invite link for others to join your league.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
          setSubmitError(undefined);
        }}
        className="mt-4 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <form.AppField
            name="role"
            children={(field) => (
              <field.SelectField
                labelProps={{
                  htmlFor: "role",
                  children: "Role",
                }}
                selectProps={{
                  disabled: isPending,
                  name: "role",
                }}
                selectTriggerProps={{
                  id: "role",
                }}
                options={Object.values(LEAGUE_MEMBER_ROLES).map((role) => ({
                  value: role,
                  label: role,
                }))}
                placeholder="Select a role"
              />
            )}
          />

          <form.AppField
            name="expiresInDays"
            children={(field) => (
              <field.NumberField
                labelProps={{
                  htmlFor: "expiresInDays",
                  children: "Expires In Days",
                }}
                inputProps={{
                  id: "expiresInDays",
                  name: "expiresInDays",
                  placeholder: MIN_LEAGUE_INVITE_EXPIRATION_DAYS.toString(),
                  onChange: (e) => field.handleChange(Number(e.target.value)),
                }}
              />
            )}
          />
        </div>

        <div className="flex justify-end">
          <form.AppForm>
            <form.SubmitButton
              submiterror={submitError}
              children="Create Link"
            />
          </form.AppForm>
        </div>
      </form>
    </div>
  );
}

function DirectInviteFormComponent() {
  const { leagueId } = useParams({
    from: "/football/pick-em/$leagueId/members",
  });
  const queryClient = useQueryClient();
  const { mutateAsync: createInvite } = useCreateLeagueInvite();

  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const form = useAppForm({
    defaultValues: {
      inviteeId: "",
      role: LEAGUE_MEMBER_ROLES.MEMBER,
      type: LEAGUE_INVITE_TYPES.DIRECT,
      leagueId,
      expiresInDays: MIN_LEAGUE_INVITE_EXPIRATION_DAYS,
    } as CreateLeagueInvite,
    onSubmit: async ({ value }) => {
      try {
        await createInvite({
          ...value,
          type: LEAGUE_INVITE_TYPES.DIRECT,
          leagueId,
        });
        toast.success("Invite sent");
        queryClient.invalidateQueries({
          queryKey: leagueInvitesQueryOptions(leagueId).queryKey,
        });
        form.reset();
      } catch (error) {
        if (error instanceof Error) {
          setSubmitError(error.message);
        } else {
          setSubmitError("An unknown error occurred");
        }
      }
    },
    validators: {
      onSubmit: CreateLeagueInviteSchema,
    },
  });

  return (
    <div>
      <h3 className="text-lg font-medium">Direct Invite</h3>
      <p className="text-sm text-muted-foreground">
        Invite a user directly by their username.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
          setSubmitError(undefined);
        }}
        className="mt-4 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <form.AppField
            name="inviteeId"
            children={(field) => (
              <div className="space-y-2">
                <label htmlFor="inviteeId" className="text-sm font-medium">
                  User
                </label>
                <UserSearchCombobox
                  id="inviteeId"
                  selectedUser={field.state.value ?? ""}
                  onSelect={(userId) => field.handleChange(userId)}
                />
              </div>
            )}
          />

          <form.AppField
            name="expiresInDays"
            children={(field) => (
              <field.NumberField
                labelProps={{
                  htmlFor: "expiresInDays",
                  children: "Expires In Days",
                }}
                inputProps={{
                  id: "expiresInDays",
                  name: "expiresInDays",
                  placeholder: MIN_LEAGUE_INVITE_EXPIRATION_DAYS.toString(),
                  onChange: (e) => field.handleChange(Number(e.target.value)),
                }}
              />
            )}
          />
        </div>

        <div className="flex justify-end">
          <form.AppForm>
            <form.SubmitButton
              submiterror={submitError}
              children="Send Invite"
            />
          </form.AppForm>
        </div>
      </form>
    </div>
  );
}

function UserSearchCombobox({
  selectedUser,
  onSelect,
  id,
}: {
  selectedUser: string;
  onSelect: (userId: string) => void;
  id?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const { data: users = [] } = useQuery(userSearchQueryOptions(search));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          id={id}
        >
          {selectedUser
            ? users.find((user) => user.userId === selectedUser)?.username
            : "Select a user..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput
            placeholder="Search for a user..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.userId}
                  value={user.username}
                  onSelect={() => {
                    onSelect(user.userId);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedUser === user.userId
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {user.username}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
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
