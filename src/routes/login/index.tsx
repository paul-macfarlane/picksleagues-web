import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginCard } from "@/features/auth/components/login-card";

export const Route = createFileRoute("/login/")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (context.session) {
      throw redirect({ to: "/" });
    }
  },
});

function RouteComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <LoginCard />
    </div>
  );
}
