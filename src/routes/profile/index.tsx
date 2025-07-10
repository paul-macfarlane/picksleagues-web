import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
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
} from "@/api/profiles";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { zodValidator } from "@tanstack/zod-adapter";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const searchSchema = z.object({
  setup: z.boolean().optional(),
});

function ProfileLoadingSkeleton() {
  return <Skeleton className="h-120 w-full max-w-md mx-auto mt-8" />;
}

function ProfileErrorState() {
  const { navigate } = useRouter();
  return (
    <div className="flex justify-center items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Unexpected Error</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-6 py-8">
            <span className="text-destructive text-center">
              An unexpected error occurred. Please try again later.
            </span>
            <Button variant="outline" onClick={() => navigate({ to: "/" })}>
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/profile/")({
  validateSearch: zodValidator(searchSchema),
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.session) {
      throw redirect({ to: "/login" });
    }
  },
});

function RouteComponent() {
  const { data: session } = authClient.useSession();
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const queryClient = useQueryClient();
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useQuery(profileQueryOptions(session?.user.id ?? ""));
  const { mutateAsync: updateProfile } = useUpdateProfile();
  const { setup } = Route.useSearch();
  const navigate = useNavigate();

  const form = useAppForm({
    defaultValues: {
      username: profileData?.username ?? "",
      firstName: profileData?.firstName ?? "",
      lastName: profileData?.lastName ?? "",
      avatarUrl: profileData?.avatarUrl ?? "",
    } as UpdateProfileRequest,
    validators: {
      onSubmit: updateProfileSchema,
    },
    onSubmit: async (values) => {
      try {
        await updateProfile(values.value);
        queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
        toast.success(
          setup ? "Profile setup successfully" : "Profile updated successfully",
        );
        if (setup) {
          navigate({ to: "/" });
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setSubmitError(error.message);
        } else {
          setSubmitError("Failed to update profile");
        }
      }
    },
  });

  if (isLoadingProfile) {
    return <ProfileLoadingSkeleton />;
  }

  if (profileError) {
    return <ProfileErrorState />;
  }

  return (
    <div className="flex justify-center items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{setup ? "Setup Profile" : "Edit Profile"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
              setSubmitError(undefined);
            }}
          >
            <form.Subscribe
              selector={(state) => state.values.avatarUrl}
              children={(avatarUrl) => (
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={avatarUrl ?? undefined} alt="Profile" />
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
