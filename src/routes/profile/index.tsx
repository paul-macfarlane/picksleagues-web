import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import z from "zod";
import {
  GetProfileByUserIdQueryKey,
  useUpdateProfile,
  GetProfileByUserIdQueryOptions,
} from "@/features/profiles/profiles.api";
import {
  useQueryClient,
  useSuspenseQuery,
  useQueryErrorResetBoundary,
} from "@tanstack/react-query";
import { zodValidator } from "@tanstack/zod-adapter";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { UpdateProfileSchema } from "@/features/profiles/profiles.types";
import {
  ProfileErrorState,
  ProfileLoadingSkeleton,
} from "@/features/profiles/components/profile-states";
import { ProfileForm } from "@/features/profiles/components/profile-form";
import { Button } from "@/components/ui/button";

const searchSchema = z.object({
  setup: z.boolean().optional(),
});

function ProfilePageErrorComponent() {
  const router = useRouter();
  const { reset } = useQueryErrorResetBoundary();
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <ProfileErrorState />
      <Button
        onClick={() => {
          reset();
          router.invalidate();
        }}
        className="mt-4"
      >
        Try again
      </Button>
    </div>
  );
}

export const Route = createFileRoute("/profile/")({
  validateSearch: zodValidator(searchSchema),
  beforeLoad: async ({ context }) => {
    if (!context.session) {
      throw redirect({ to: "/login" });
    }
  },
  loader: ({ context: { queryClient, session } }) => {
    return queryClient.ensureQueryData(
      GetProfileByUserIdQueryOptions(session!.userId),
    );
  },
  pendingMs: 300,
  pendingComponent: ProfileLoadingSkeleton,
  errorComponent: ProfilePageErrorComponent,
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
