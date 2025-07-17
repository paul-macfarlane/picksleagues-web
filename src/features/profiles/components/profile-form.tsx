import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";
import { useAppForm } from "@/components/form";
import { UpdateProfileSchema } from "../profiles.types";
import { useState } from "react";
import type { z } from "zod";

type ProfileFormData = z.infer<typeof UpdateProfileSchema>;

type ProfileFormProps = {
  defaultValues: ProfileFormData;
  onSubmit: (values: ProfileFormData) => Promise<void>;
  isSetupMode?: boolean;
};

export function ProfileForm({
  defaultValues,
  onSubmit,
  isSetupMode,
}: ProfileFormProps) {
  const [submitError, setSubmitError] = useState<string | undefined>();

  const form = useAppForm({
    validators: {
      onSubmit: UpdateProfileSchema,
    },
    defaultValues,
    onSubmit: async ({ value }) => {
      try {
        setSubmitError(undefined);
        await onSubmit(value);
      } catch (e) {
        if (e instanceof Error) {
          setSubmitError(e.message);
        } else {
          setSubmitError("An unexpected error occurred");
        }
      }
    },
  });

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Subscribe
        selector={(state) => state.values.avatarUrl}
        children={(avatarUrl) => (
          <div className="flex flex-col items-center gap-2">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarUrl ?? ""} />
              <AvatarFallback>
                <UserRound className="w-4 h-4 text-primary" />
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      />
      <form.AppField
        name="avatarUrl"
        children={(field) => (
          <field.TextField
            labelProps={{ htmlFor: "avatarUrl", children: "Avatar URL" }}
            inputProps={{
              id: "avatarUrl",
              placeholder: "https://...",
              type: "url",
            }}
          />
        )}
      />

      <form.AppField
        name="username"
        children={(field) => (
          <field.TextField
            labelProps={{
              htmlFor: "username",
              children: "Username",
            }}
            inputProps={{
              id: "username",
              placeholder: "john.doe",
              type: "text",
            }}
          />
        )}
      />

      <form.AppField
        name="firstName"
        children={(field) => (
          <field.TextField
            labelProps={{
              htmlFor: "firstName",
              children: "First Name",
            }}
            inputProps={{
              id: "firstName",
              placeholder: "First Name",
              type: "text",
            }}
          />
        )}
      />

      <form.AppField
        name="lastName"
        children={(field) => (
          <field.TextField
            labelProps={{
              htmlFor: "lastName",
              children: "Last Name",
            }}
            inputProps={{
              id: "lastName",
              placeholder: "Last Name",
              type: "text",
            }}
          />
        )}
      />

      <form.AppForm>
        <form.SubmitButton
          children={isSetupMode ? "Complete Setup" : "Save Changes"}
          submiterror={submitError}
        />
      </form.AppForm>
    </form>
  );
}
