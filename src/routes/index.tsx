import { createFileRoute } from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
  beforeLoad: async () => {
    const authed = false; // TODO: check if user is authed
    if (!authed) {
      throw redirect({ to: "/app" });
    } else {
      throw redirect({ to: "/welcome" });
    }
  },
});

function App() {
  return <></>;
}
