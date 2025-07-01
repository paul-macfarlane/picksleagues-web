import { createFileRoute, redirect } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAppForm } from "@/components/form";
import z from "zod";
import { useState } from "react";

export const Route = createFileRoute("/profile/")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.session) {
      throw redirect({ to: "/login" });
    }
  },
});

// todo integrate data fetching
// todo use query params to see if user is editing or setting up for the first time

const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 20;
const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 50;

const updateProfileSchema = z.object({
  username: z
    .string()
    .min(MIN_USERNAME_LENGTH, {
      message: `Username must be at least ${MIN_USERNAME_LENGTH} characters`,
    })
    .max(MAX_USERNAME_LENGTH, {
      message: `Username must be at most ${MAX_USERNAME_LENGTH} characters`,
    }),
  firstName: z
    .string()
    .min(MIN_NAME_LENGTH, { message: `First name is required ` })
    .max(MAX_NAME_LENGTH, {
      message: `First name must be at most ${MAX_NAME_LENGTH} characters`,
    }),
  lastName: z
    .string()
    .min(MIN_NAME_LENGTH, { message: `Last name is required` })
    .max(MAX_NAME_LENGTH, {
      message: `Last name must be at most ${MAX_NAME_LENGTH} characters`,
    }),
  avatarUrl: z.union([z.string().url(), z.undefined(), z.literal("")]),
});

function RouteComponent() {
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const form = useAppForm({
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      avatarUrl: "",
    } as z.infer<typeof updateProfileSchema>,
    validators: {
      onSubmit: updateProfileSchema,
    },
    onSubmit: async (values) => {
      try {
        // throw new Error("test");
        console.log(values);
        // todo call mutation to update profile
      } catch (error: unknown) {
        if (error instanceof Error) {
          setSubmitError(error.message);
        } else {
          setSubmitError("Failed to update profile");
        }
      }
    },
  });

  return (
    <div className="flex justify-center items-center min-h-[60vh] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-6"
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <form.Subscribe
              selector={(state) => state.values.avatarUrl}
              children={(avatarUrl) => (
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={avatarUrl} alt="Profile" />
                    {/* couldn't find a way to add reactivity based on the avatarUrl AND username without re-rendering the entire page compoment using useStore, so setting fallback to A */}
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                </div>
              )}
            />

            <form.AppField
              name="avatarUrl"
              children={(field) => (
                <field.TextField
                  labelProps={{
                    htmlFor: "avatarUrl",
                    children: "Avatar URL",
                  }}
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
                    placeholder: "username",
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
                children="Save Changes"
                submitError={submitError}
              />
            </form.AppForm>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
