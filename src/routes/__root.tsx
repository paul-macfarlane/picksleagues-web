import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { Session } from "better-auth/types";
import { QueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/components/app-layout";

type RouterContext = {
  session: Session | null | undefined;
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <AppLayout>
        <Outlet />
      </AppLayout>
      <ReactQueryDevtools />
      <TanStackRouterDevtools />
    </>
  ),
});
