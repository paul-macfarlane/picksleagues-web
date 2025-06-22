import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/helpers/authContext";
import { auth } from "@/helpers/firebaseConfig";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { signOut } from "firebase/auth";

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/login" });
    }
  },
});

function RouteComponent() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  return (
    <div>
      <p>Hello {user?.displayName}!</p>
      <Button
        onClick={async () => {
          try {
            await signOut(auth);
            navigate({ to: "/login" });
          } catch (error) {
            console.error(error);
          }
        }}
      >
        Sign out
      </Button>
    </div>
  );
}
