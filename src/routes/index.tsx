import { createFileRoute } from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/app" });
    } else {
      throw redirect({ to: "/welcome" });
    }
  },
});

function App() {
  return <></>;
}
