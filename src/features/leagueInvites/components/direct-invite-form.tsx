import { useParams } from "@tanstack/react-router";
import { useAppForm } from "@/components/form";
import { toast } from "sonner";
import {
  CreateLeagueInviteObjectSchema,
  CreateLeagueInviteSchema,
  DEFAULT_LEAGUE_INVITE_EXPIRATION_DAYS,
  LEAGUE_INVITE_TYPES,
  type LeagueInviteResponse,
} from "@/features/leagueInvites/leagueInvites.types";
import { useCreateLeagueInvite } from "@/features/leagueInvites/leagueInvites.api";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Loader2, Search, UserRound, X } from "lucide-react";
import {
  useGetProfileByUserId,
  useSearchProfiles,
} from "@/features/profiles/profiles.api";
import { useState, useEffect, useRef } from "react";
import type { LeagueMemberResponse } from "@/features/leagueMembers/leagueMembers.types";
import z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useDelayedLoader } from "@/hooks/useDelayedLoader";

const DirectInviteFormSchema = CreateLeagueInviteObjectSchema.extend({
  inviteeId: z.string().min(1, "Please select a user to invite."),
});

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
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const {
    data: selectedProfile,
    isFetching: isSelectedProfileFetching,
    error: selectedProfileError,
  } = useGetProfileByUserId({
    userId: selectedUser,
    enabled: !!selectedUser,
  });
  const {
    data: profiles,
    isFetching: isSearchFetching,
    error: searchError,
  } = useSearchProfiles(
    {
      username: debouncedValue,
      firstName: debouncedValue,
      lastName: debouncedValue,
    },
    !!debouncedValue && isOpen,
  );

  const showSearchLoader = useDelayedLoader(isSearchFetching, 300);

  useEffect(() => {
    if (selectedProfileError) {
      toast.error(
        selectedProfileError.message || "Failed to fetch selected user",
      );
    }
  }, [selectedProfileError]);

  useEffect(() => {
    if (selectedProfile) {
      setInputValue(
        `@${selectedProfile.username} (${selectedProfile.firstName} ${selectedProfile.lastName})`,
      );
    }
  }, [selectedProfile]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (
        !selectedProfile ||
        inputValue !==
          `${selectedProfile.firstName} ${selectedProfile.lastName}`
      ) {
        setDebouncedValue(inputValue);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, selectedProfile]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const currentMemberIds = currentMembers.map((member) => member.userId);
  const alreadyInvitedUserIds = invites.map((invite) => invite.inviteeId);

  const availableProfiles = profiles?.filter(
    (profile) =>
      !currentMemberIds.includes(profile.userId) &&
      !alreadyInvitedUserIds.includes(profile.userId),
  );

  const handleSelect = (userId: string) => {
    onSelect(userId);
    setIsOpen(false);
    const profile = profiles?.find((p) => p.userId === userId);
    if (profile) {
      setInputValue(
        `@${profile.username} (${profile.firstName} ${profile.lastName})`,
      );
    }
  };

  return (
    <Command ref={ref} className="relative overflow-visible">
      <div className="relative">
        {isSelectedProfileFetching ? (
          <Loader2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        ) : (
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <CommandInput
          id={id}
          value={inputValue}
          onValueChange={(search) => {
            if (selectedUser) {
              onSelect("");
            }
            setInputValue(search);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-9"
          placeholder="Search for user..."
        />
        {selectedUser ? (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
            onClick={() => {
              onSelect("");
              setInputValue("");
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
      {isOpen && (
        <div className="absolute top-full z-10 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
          <CommandList>
            {showSearchLoader ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : searchError ? (
              <CommandEmpty>
                Error: {searchError.message || "Could not search for users."}
              </CommandEmpty>
            ) : (
              <>
                {!availableProfiles?.length && debouncedValue && (
                  <CommandEmpty>
                    No users found. They might already be in the league or have
                    a pending invite.
                  </CommandEmpty>
                )}
                {!availableProfiles?.length && !debouncedValue && (
                  <CommandEmpty>
                    Search for a user by their name or username.
                  </CommandEmpty>
                )}
                <CommandGroup>
                  {availableProfiles?.map((profile) => (
                    <CommandItem
                      key={profile.userId}
                      onSelect={() => handleSelect(profile.userId)}
                      value={`@${profile.username} (${profile.firstName} ${profile.lastName})`}
                    >
                      <Avatar className="mr-2 h-6 w-6">
                        <AvatarImage src={profile.avatarUrl ?? undefined} />
                        <AvatarFallback>
                          <UserRound className="h-5 w-5 text-primary" />
                        </AvatarFallback>
                      </Avatar>
                      @{profile.username} ({profile.firstName}{" "}
                      {profile.lastName})
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </div>
      )}
    </Command>
  );
}

export function DirectInviteFormComponent({
  currentMembers,
  invites,
}: {
  currentMembers: LeagueMemberResponse[];
  invites: LeagueInviteResponse[];
}) {
  const { leagueId } = useParams({
    from: "/_authenticated/football/pick-em/$leagueId/members",
  });
  const { mutateAsync: createInvite, isPending } = useCreateLeagueInvite();

  const form = useAppForm({
    defaultValues: {
      leagueId,
      role: "member",
      type: LEAGUE_INVITE_TYPES.DIRECT,
      expiresInDays: DEFAULT_LEAGUE_INVITE_EXPIRATION_DAYS,
      inviteeId: "",
    },
    validators: {
      onSubmit: DirectInviteFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createInvite(value as z.infer<typeof CreateLeagueInviteSchema>);
        toast.success("Invite sent");
        form.reset();
      } catch (error) {
        const errorMessage = "Failed to send invite";
        if (error instanceof Error) {
          toast.error(`${errorMessage}: ${error.message}`);
        } else {
          toast.error(errorMessage);
        }
      }
    },
  });

  return (
    <div>
      <h3 className="text-lg font-medium">Invite a User Directly</h3>
      <form
        className="mt-2 flex flex-col items-stretch gap-2 sm:flex-row sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="flex-1">
          <form.AppField
            name="inviteeId"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor="user-search">User</Label>
                <UserSearchCombobox
                  id="user-search"
                  selectedUser={field.state.value}
                  onSelect={(userId) => field.handleChange(userId)}
                  currentMembers={currentMembers}
                  invites={invites}
                />
              </div>
            )}
          />
        </div>
        <div className="flex flex-col gap-2 sm:w-40">
          <form.AppField
            name="expiresInDays"
            children={(field) => (
              <field.NumberField
                labelProps={{
                  children: "Expires in (days)",
                }}
              />
            )}
          />
        </div>
        <form.AppForm>
          <form.SubmitButton className="w-full sm:w-auto" disabled={isPending}>
            Send Invite
          </form.SubmitButton>
        </form.AppForm>
      </form>
    </div>
  );
}
