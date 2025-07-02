import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAppForm } from "@/components/form";
import z from "zod";
import { useState } from "react";
import {
  PROFILE_QUERY_KEY,
  profileQueryOptions,
  updateProfileSchema,
  useUpdateProfile,
  type UpdateProfileRequest,
} from "@/api/profile";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { zodValidator } from "@tanstack/zod-adapter";

const searchSchema = z.object({
  setup: z.boolean().optional(),
});

export const Route = createFileRoute("/profile/")({
  validateSearch: zodValidator(searchSchema),
  component: RouteComponent,
  errorComponent: () => {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 p-4">
        <p>An unexpected error occurred. Please try again later.</p>

        <Button asChild variant="outline">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  },
  beforeLoad: async ({ context }) => {
    if (!context.session) {
      throw redirect({ to: "/login" });
    }
  },
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(profileQueryOptions()),
});

function RouteComponent() {
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const queryClient = useQueryClient();
  const { data: profileData } = useSuspenseQuery(profileQueryOptions());
  const { mutateAsync: updateProfile } = useUpdateProfile();
  const { setup } = Route.useSearch();

  const form = useAppForm({
    defaultValues: {
      username: profileData.username ?? "",
      firstName: profileData.firstName ?? "",
      lastName: profileData.lastName ?? "",
      avatarUrl: profileData.avatarUrl ?? "",
    } as UpdateProfileRequest,
    validators: {
      onSubmit: updateProfileSchema,
    },
    onSubmit: async (values) => {
      try {
        setSubmitError(undefined);
        await updateProfile(values.value);
        queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
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
          <CardTitle>{setup ? "Setup Profile" : "Edit Profile"}</CardTitle>
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
                    <AvatarImage src={avatarUrl ?? undefined} alt="Profile" />
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
                children={setup ? "Setup Profile" : "Save Changes"}
                submiterror={submitError}
              />
            </form.AppForm>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
