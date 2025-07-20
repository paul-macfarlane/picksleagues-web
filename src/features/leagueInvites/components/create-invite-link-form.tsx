import { useParams } from "@tanstack/react-router";
import { useAppForm } from "@/components/form";
import { toast } from "sonner";
import {
  CreateLeagueInviteObjectSchema,
  CreateLeagueInviteSchema,
  DEFAULT_LEAGUE_INVITE_EXPIRATION_DAYS,
  LEAGUE_INVITE_TYPES,
} from "@/features/leagueInvites/leagueInvites.types";
import { useCreateLeagueInvite } from "@/features/leagueInvites/leagueInvites.api";
import z from "zod";
import { LEAGUE_MEMBER_ROLES } from "@/features/leagueMembers/leagueMembers.types";

export function CreateInviteLinkFormComponent() {
  const { leagueId } = useParams({
    from: "/_authenticated/football/pick-em/$leagueId/members",
  });
  const { mutateAsync: createInvite, isPending } = useCreateLeagueInvite();

  const form = useAppForm({
    defaultValues: {
      leagueId,
      role: "member",
      type: LEAGUE_INVITE_TYPES.LINK,
      expiresInDays: DEFAULT_LEAGUE_INVITE_EXPIRATION_DAYS,
    },
    validators: {
      onSubmit: CreateLeagueInviteObjectSchema.pick({
        leagueId: true,
        role: true,
        type: true,
        expiresInDays: true,
      }),
    },
    onSubmit: async ({ value }) => {
      try {
        await createInvite(value as z.infer<typeof CreateLeagueInviteSchema>);
        toast.success("Invite link created");
        form.reset();
      } catch (error) {
        const errorMessage = "Failed to create invite link";
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
      <h3 className="text-lg font-medium">Create Invite Link</h3>
      <form
        className="mt-2 flex flex-col items-stretch gap-2 sm:flex-row sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="flex-1">
          <form.AppField
            name="role"
            children={(field) => (
              <field.SelectField
                selectProps={{
                  name: "role",
                }}
                selectTriggerProps={{
                  id: "role",
                }}
                labelProps={{
                  htmlFor: "role",
                  children: "Role",
                }}
                options={Object.values(LEAGUE_MEMBER_ROLES).map((role) => ({
                  value: role,
                  label: role.charAt(0).toUpperCase() + role.slice(1),
                }))}
              />
            )}
          />
        </div>
        <div className="sm:w-40">
          <form.AppField
            name="expiresInDays"
            children={(field) => (
              <field.NumberField
                labelProps={{
                  htmlFor: "expiresInDays",
                  children: "Expires in (days)",
                }}
                inputProps={{
                  id: "expiresInDays",
                  name: "expiresInDays",
                }}
              />
            )}
          />
        </div>
        <form.AppForm>
          <form.SubmitButton className="w-full sm:w-auto" disabled={isPending}>
            Create Link
          </form.SubmitButton>
        </form.AppForm>
      </form>
    </div>
  );
}
