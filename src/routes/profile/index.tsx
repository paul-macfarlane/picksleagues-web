import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import z from "zod";
import {
  GetProfileByUserIdQueryKey,
  useGetProfileByUserId,
  useUpdateProfile,
} from "@/features/profiles/profiles.api";
import { useQueryClient } from "@tanstack/react-query";
import { zodValidator } from "@tanstack/zod-adapter";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { UpdateProfileSchema } from "@/features/profiles/profiles.types";
import {
  ProfileErrorState,
  ProfileLoadingSkeleton,
} from "@/features/profiles/components/profile-states";
import { ProfileForm } from "@/features/profiles/components/profile-form";

const searchSchema = z.object({
  setup: z.boolean().optional(),
});

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
  const queryClient = useQueryClient();
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useGetProfileByUserId(session?.user.id ?? "");
  const { mutateAsync: updateProfile } = useUpdateProfile();
  const { setup } = Route.useSearch();
  const navigate = useNavigate();

  const handleSubmit = async (values: z.infer<typeof UpdateProfileSchema>) => {
    try {
      await updateProfile({
        userId: session?.user.id ?? "",
        profile: values,
      });
      await queryClient.invalidateQueries({
        queryKey: GetProfileByUserIdQueryKey(session?.user.id ?? ""),
      });
      toast.success(
        setup ? "Profile setup successfully" : "Profile updated successfully",
      );
      if (setup) {
        navigate({ to: "/" });
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile",
      );
      throw error;
    }
  };

  if (isLoadingProfile) {
    return <ProfileLoadingSkeleton />;
  }

  if (profileError) {
    return <ProfileErrorState />;
  }

  const defaultValues = {
    username: profileData?.username ?? "",
    firstName: profileData?.firstName ?? "",
    lastName: profileData?.lastName ?? "",
    avatarUrl: profileData?.avatarUrl ?? "",
  };

  return (
    <div className="flex justify-center items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{setup ? "Setup Profile" : "Edit Profile"}</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            isSetupMode={setup}
          />
        </CardContent>
      </Card>
    </div>
  );
}
