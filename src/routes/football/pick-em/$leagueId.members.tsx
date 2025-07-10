import { createFileRoute, redirect, useParams } from "@tanstack/react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  X,
  UserRound,
  Copy,
  ChevronsUpDown,
  Check,
  AlertCircle,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { profileQueryOptions, profileSearchQueryOptions } from "@/api/profiles";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState, useEffect } from "react";
import { useAppForm } from "@/components/form";
import {
  leagueMembersQueryOptions,
  LEAGUE_MEMBER_ROLES,
  type LeagueMemberResponse,
} from "@/api/leagueMembers";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

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

      {isCommissioner && <InviteManagement currentMembers={members} />}
    </div>
  );
}

function InviteManagement({
  currentMembers,
}: {
  currentMembers: LeagueMemberResponse[];
}) {
  const { leagueId } = useParams({
    from: "/football/pick-em/$leagueId/members",
  });
  const {
    data: invites,
    isLoading: isInvitesLoading,
    error: invitesError,
  } = useQuery(leagueInvitesQueryOptions({ leagueId, enabled: true }));
  const queryClient = useQueryClient();

  const { mutateAsync: deactivateInvite } = useDeactivateLeagueInvite();

  async function handleDeactivate(inviteId: string) {
    try {
      await deactivateInvite(inviteId);
      toast.success("Invite link deactivated");
      queryClient.invalidateQueries({
        queryKey: leagueInvitesQueryOptions({ leagueId }).queryKey,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to deactivate invite link");
      }
    }
  }

  if (isInvitesLoading) {
    return <InviteManagementSkeleton />;
  }

  if (invitesError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invite Management</CardTitle>
          <CardDescription>
            There was an error loading the invites.
          </CardDescription>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
          <h3 className="mt-2 text-lg font-semibold">Something went wrong</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {invitesError.message}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() =>
              queryClient.refetchQueries({
                queryKey: leagueInvitesQueryOptions({ leagueId }).queryKey,
              })
            }
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const linkInvites = invites!.filter(
    (invite) => invite.type === LEAGUE_INVITE_TYPES.LINK,
  );
  const directInvites = invites!.filter(
    (invite) => invite.type === LEAGUE_INVITE_TYPES.DIRECT,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <CreateInviteLinkFormComponent />
        <LinkInviteList invites={linkInvites} onDeactivate={handleDeactivate} />
        <Separator />
        <DirectInviteFormComponent
          currentMembers={currentMembers}
          invites={directInvites}
        />
        <DirectInviteList
          invites={directInvites}
          onDeactivate={handleDeactivate}
        />
      </CardContent>
    </Card>
  );
}

function InviteManagementSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Form skeleton */}
        <Skeleton className="h-8 w-1/2 mb-2" />
        <Skeleton className="h-6 w-full mb-4" />
        {/* Table skeleton */}
        <Skeleton className="h-6 w-1/3 mb-2" />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Skeleton className="h-5 w-20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-5 w-20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-5 w-20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-5 w-20" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(2)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-6 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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
          queryKey: leagueInvitesQueryOptions({ leagueId }).queryKey,
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
        Create a new invite link for others to join your league. Anyone with the
        link can join and will have the role you select.
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

function LinkInviteList({
  invites,
  onDeactivate,
}: {
  invites: LeagueInviteResponse[];
  onDeactivate: (inviteId: string) => void;
}) {
  const handleCopy = (token: string) => {
    const url = `${window.location.origin}/join/${token}`;
    navigator.clipboard.writeText(url);
    toast.success("Invite link copied to clipboard");
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Link Invites</h3>
      {invites.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          No active invite links yet. Create one above to invite members to your
          league.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Link</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invites.map((invite) => (
              <TableRow key={invite.id}>
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
                <TableCell>
                  <Badge variant="outline">{invite.role}</Badge>
                </TableCell>
                <TableCell>
                  {invite.expiresAt
                    ? new Date(invite.expiresAt).toLocaleString()
                    : "Never"}
                </TableCell>
                <TableCell className="text-right space-x-2">
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
      )}
    </div>
  );
}

function DirectInviteList({
  invites,
  onDeactivate,
}: {
  invites: LeagueInviteResponse[];
  onDeactivate: (inviteId: string) => void;
}) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Direct Invites</h3>
      {invites.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          No active direct invites.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invites.map((invite) => (
              <DirectInviteRow
                key={invite.id}
                invite={invite}
                onDeactivate={onDeactivate}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function DirectInviteRow({
  invite,
  onDeactivate,
}: {
  invite: LeagueInviteResponse;
  onDeactivate: (inviteId: string) => void;
}) {
  const { data: userProfile } = useSuspenseQuery(
    profileQueryOptions(invite.inviteeId!),
  );

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={userProfile.avatarUrl ?? undefined}
              alt={`${userProfile.firstName} ${userProfile.lastName}`}
            />
            <AvatarFallback>
              <UserRound className="h-4 w-4 text-primary" />
            </AvatarFallback>
          </Avatar>
          <span>
            {userProfile.firstName} {userProfile.lastName} (@
            {userProfile.username})
          </span>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{invite.role}</Badge>
      </TableCell>
      <TableCell>
        {invite.expiresAt
          ? new Date(invite.expiresAt).toLocaleString()
          : "Never"}
      </TableCell>
      <TableCell className="text-right">
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
  );
}

function DirectInviteFormComponent({
  currentMembers,
  invites,
}: {
  currentMembers: LeagueMemberResponse[];
  invites: LeagueInviteResponse[];
}) {
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
          queryKey: leagueInvitesQueryOptions({ leagueId }).queryKey,
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
        Invite a user directly by their name or username.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
          setSubmitError(undefined);
        }}
        className="mt-4 space-y-4"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
          <form.AppField
            name="role"
            children={(field) => (
              <field.SelectField
                labelProps={{
                  htmlFor: "role",
                  children: "Role",
                }}
                selectProps={{
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
            name="inviteeId"
            children={(field) => {
              return (
                <div className="space-y-2">
                  <Label htmlFor="inviteeId" className="text-sm font-medium">
                    User
                  </Label>
                  <UserSearchCombobox
                    id="inviteeId"
                    selectedUser={field.state.value ?? ""}
                    onSelect={(userId) => field.handleChange(userId)}
                    currentMembers={currentMembers}
                    invites={invites}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <div className="text-destructive text-sm">
                      {field.state.meta.errors[0]?.message}
                    </div>
                  )}
                </div>
              );
            }}
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
  currentMembers,
  invites,
}: {
  selectedUser: string;
  onSelect: (userId: string) => void;
  id?: string;
  currentMembers: LeagueMemberResponse[];
  invites: LeagueInviteResponse[];
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Update debounced value after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.length >= 3) {
        setDebouncedSearch(search);
      }
    }, 300); // 300ms delay

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const { data: profiles = [] } = useQuery(
    profileSearchQueryOptions({
      search: {
        username: debouncedSearch,
        firstName: debouncedSearch,
        lastName: debouncedSearch,
      },
      enabled: debouncedSearch.length >= 3,
    }),
  );

  // filter out profiles that are already in the league and that don't already have an invite
  const filteredProfiles = profiles.filter(
    (profile) =>
      !currentMembers.some((member) => member.userId === profile.userId) &&
      !invites.some((invite) => invite.inviteeId === profile.userId),
  );

  const selectedProfile = filteredProfiles.find(
    (profile) => profile.userId === selectedUser,
  );

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
          {selectedUser ? (
            selectedProfile ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-4 w-4">
                  <AvatarImage src={selectedProfile.avatarUrl ?? undefined} />
                  <AvatarFallback>
                    <UserRound className="h-4 w-4 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <span>
                  {selectedProfile.firstName} {selectedProfile.lastName} (
                  {selectedProfile.username})
                </span>
              </div>
            ) : null
          ) : (
            "Select a user..."
          )}
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
            {search.length < 3 ? (
              <CommandEmpty className="p-2 text-sm text-muted-foreground">
                Type at least 3 characters to search...
              </CommandEmpty>
            ) : (
              <>
                <CommandEmpty>No users found.</CommandEmpty>
                <CommandGroup>
                  {filteredProfiles.map((profile) => (
                    <CommandItem
                      key={profile.userId}
                      value={profile.username}
                      onSelect={() => {
                        if (selectedUser === profile.userId) {
                          onSelect("");
                        } else {
                          onSelect(profile.userId);
                          setOpen(false);
                        }
                      }}
                    >
                      <Check
                        className={cn(
                          "h-4 w-4",
                          selectedUser === profile.userId
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={profile.avatarUrl ?? undefined} />
                        <AvatarFallback>
                          <UserRound className="h-4 w-4 text-primary" />
                        </AvatarFallback>
                      </Avatar>
                      {profile.username}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
