import { createFileRoute } from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
  loader: async () => {
    const authed = false; // todo replace with actual auth check
    if (authed) {
      return redirect({ to: "/app" });
    } else {
      return redirect({ to: "/welcome" });
    }
  },
});

function App() {
  return <></>;
}
