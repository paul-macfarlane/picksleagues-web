import { createFileRoute, redirect } from "@tanstack/react-router";
import { GetProfileByUserIdQueryOptions } from "@/features/profiles/profiles.api";
import { AppLayout, AppLayoutSkeleton } from "@/components/app-layout";

export const Route = createFileRoute("/_authenticated")({
  component: AppLayout,
  pendingComponent: AppLayoutSkeleton,
  beforeLoad: async ({ context }) => {
    if (!context.session) {
      throw redirect({ to: "/login" });
    }
  },
  loader: ({ context: { queryClient, session } }) =>
    queryClient.ensureQueryData(
      GetProfileByUserIdQueryOptions(session!.userId),
    ),
});
