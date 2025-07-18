import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import z from "zod";
import {
  useUpdateProfile,
  GetProfileByUserIdQueryOptions,
} from "@/features/profiles/profiles.api";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { zodValidator } from "@tanstack/zod-adapter";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { UpdateProfileSchema } from "@/features/profiles/profiles.types";
import { ProfileLoadingSkeleton } from "@/features/profiles/components/profile-states";
import { ProfileForm } from "@/features/profiles/components/profile-form";
import { RouteErrorBoundary } from "@/components/route-error-boundary";

const searchSchema = z.object({
  setup: z.boolean().optional(),
});

export const Route = createFileRoute("/_authenticated/profile/")({
  validateSearch: zodValidator(searchSchema),
  loader: ({ context: { queryClient, session } }) => {
    return queryClient.ensureQueryData(
      GetProfileByUserIdQueryOptions(session!.userId),
    );
  },
  pendingMs: 300,
  pendingComponent: ProfileLoadingSkeleton,
  errorComponent: () => <RouteErrorBoundary />,
  component: RouteComponent,
});

function RouteComponent() {
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();
  const { data: profileData } = useSuspenseQuery(
    GetProfileByUserIdQueryOptions(session!.user.id),
  );
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
        queryKey: GetProfileByUserIdQueryOptions(session?.user.id ?? "")
          .queryKey,
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
