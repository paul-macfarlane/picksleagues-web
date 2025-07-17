# PicksLeagues Web Frontend Standards

This document outlines the standards for developing the PicksLeagues web frontend. For the plan to migrate the existing codebase to these standards, please see [MIGRATION_PLAN.md](./MIGRATION_PLAN.md).

## Development Standards

### 1. Architecture: Hybrid Feature-Sliced

We will use a hybrid architecture that combines the benefits of feature-sliced design with the simplicity of file-based routing.

- **Feature Slices**: Core application logic is organized by feature (e.g., `leagues`, `profile`) in the `src/features` directory. Each slice contains its own API logic, components, types, and hooks.
- **File-Based Routing**: The `src/routes` directory will continue to be used as defined by TanStack Router. Route components should be lightweight, acting as entry points that assemble and compose UI and logic from the various feature slices.
- **Shared Logic**: Truly generic, cross-cutting concerns like UI primitives, shared hooks, and library configurations will live in dedicated shared directories (`src/components/ui`, `src/hooks`, `src/lib`).

### 2. Directory Structure

- `src/features/[feature-name]/`: Self-contained modules for each feature.
  - `[feature-name].api.ts`: API functions and TanStack Query hooks (`queryOptions`, `useMutation`).
  - `components/`: React components specific to this feature.
  - `[feature-name].types.ts`: TypeScript types, interfaces, enums, and Zod validation schemas.
  - `hooks/`: React hooks specific to this feature.
- `src/routes/`: File-based routes. These files should import from `src/features` and compose the page.
- `src/components/`:
  - `ui/`: Generic, reusable, unstyled or lightly styled UI components (e.g., from `shadcn/ui`).
  - `form/`: Reusable, typed components for building forms.
- `src/hooks/`: Custom, reusable React hooks that are shared across multiple features.
- `src/lib/`: For utility functions and configurations for third-party libraries (e.g., `auth-client.ts`, `utils.ts`).

### 3. Data Fetching & State Management

All server state, including data fetching, caching, and mutations, will be managed exclusively by **TanStack Query**.

- **Location of Hooks**: Query and mutation hooks (`queryOptions`, `useMutation`) are co-located with their API functions inside their respective feature slice (e.g., `src/features/leagues/leagues.api.ts`).
- **Query Keys**: Query keys must be structured hierarchically by feature to ensure consistency and prevent collisions. The convention is `['featureName', 'resource', { id: '...' }]` (e.g., `['leagues', 'list']`, `['leagues', 'detail', { leagueId: '123' }]`).
- **Query Options**: For each query, a `queryOptions` object should be created in the feature's `.api.ts` file. This object centralizes the query key and the query function, making it reusable and the single source of truth for that query.

#### Data Fetching Strategy: Unified `loader` and `useSuspenseQuery`

We will use a unified approach that leverages TanStack Router's `loader` function to orchestrate all server-state fetching with TanStack Query. This ensures data is loaded and cached before a component renders, preventing loading waterfalls and providing a better user experience.

- **Implementation**:

  1.  **Define `queryOptions`**: In the feature's `.api.ts` file, create and export a `queryOptions` object for each query. This includes the `queryKey` and the `queryFn`, making it the reusable single source of truth for that query.
  2.  **Use `loader` for Orchestration**: In the route definition, use the `loader` function to call `queryClient.ensureQueryData(queryOptions)`. For critical data required for the initial paint, `await` this call. For non-critical data, you can call `queryClient.ensureQueryData(queryOptions)` without `await` to load it in the background.
  3.  **Access Data with `useSuspenseQuery`**: In the route component, use `useSuspenseQuery(queryOptions)` to access the data. Since the `loader` has already populated the cache with critical data, this hook will read from the cache and will not trigger a suspense fallback on the initial render. For non-critical data, this hook can be used within a `<React.Suspense>` boundary.
  4.  **Set `pendingMs` for Better UX**: Set a `pendingMs` delay on the route (e.g., `300`). This prevents a "flash" of a loading skeleton on fast connections by only showing the `pendingComponent` if the load takes longer than the specified delay.
  5.  **Create a `pendingComponent`**: This component will be rendered if the `loader` exceeds the `pendingMs` threshold. It should contain the page's structural shell with skeleton elements in place of the data.
  6.  **Create an `errorComponent`**: Each route fetching data should have a dedicated `errorComponent`. This component should use `useQueryErrorResetBoundary` and provide a `router.invalidate()` mechanism to allow the user to retry the failed request.

- **Example Flow**:
  - A user navigates to `/leagues/$leagueId`.
  - The route's `loader` calls `await queryClient.ensureQueryData(getLeagueQueryOptions(leagueId))`.
  - If the data isn't in the cache, TanStack Query fetches it. The router shows the `pendingComponent`.
  - Once the data is fetched, the `LeagueDetail` component renders.
  - `useSuspenseQuery(getLeagueQueryOptions(leagueId))` reads the data from the cache and displays it instantly.

This approach combines the strengths of both libraries: TanStack Router handles the orchestration and initial load, while TanStack Query manages the cache and provides reactive, suspense-ready data access in the components.

#### Exceptions to Route-Level Fetching

While route-level data fetching is the standard, there are valid exceptions where fetching within a component is appropriate:

- **Highly Interactive Components**: For components where data fetching is driven by real-time user input that doesn't map to a URL change (e.g., a search-as-you-type combobox), fetching directly within the component is more direct and makes sense.
- **Truly Non-Essential, User-Triggered Data**: If data is only loaded based on a specific user action _after_ the initial page load (e.g., clicking a "Show More Details" button), it can be fetched within the component that handles that action.
- **Self-Contained Widgets**: A reusable, standalone widget (like a stock ticker or weather widget) that can be placed on any page may manage its own data fetching to remain decoupled from the routes it's used in.

**Rule of Thumb:** If the data is required to render the page based on the **URL**, fetch it in the route `loader`. If the data is required based on a user **interaction** that happens _within_ the page, it is a candidate for component-level fetching.

### 4. API Client

- All API interactions will adhere strictly to the **API Design Guide**.
- **Base Client**: The base fetch logic, including authentication handling and custom error classes, will reside in `src/lib/api.ts`.
- **Error Handling**: The client must correctly parse the structured error response: `{ error: { message: string, code: string } }`.

### 5. Models & Types

- All API-related `type` definitions and `zod` schemas are co-located within their feature slice in a `[feature-name].types.ts` file. This keeps the data definitions right next to the code that uses them.

### 6. Forms

- **Standardization**: We will use `@tanstack/react-form` for all forms, with validation powered by `Zod`.
- **Schemas**: Validation schemas will be imported from the `types.ts` file of the relevant feature slice.
- **Components**: Generic form components will live in `src/components/form/`.

### 7. UI Components

- **Feature Components**: Components that are tightly coupled to a specific feature belong inside that feature's `components` directory.
- **Shared UI**: Components that are purely presentational and could be used by any feature belong in `src/components/ui`.

### 8. Loading UI: Skeletons and Delays

A good user experience requires thoughtful handling of loading states. We must balance providing feedback to the user without introducing jarring UI flashes for fast network requests.

- **Route-Level Data**: For critical data fetched in a route's `loader` function, the router will show a `pendingComponent` if the fetch exceeds the `pendingMs` delay. This pending component **should** contain the page's shell and loading skeletons. A global top-bar loader can supplement this as a secondary indicator.
- **Component-Level Data**: For non-critical data fetched with `useQuery` inside a component, a loading skeleton is the correct approach.

  - The skeleton should match the layout and dimensions of the content it is replacing to prevent layout shifts when the data arrives.
  - **Delayed Appearance**: To prevent flickering, the `useDelayedLoader` hook should be used. This ensures a loading skeleton only appears if the data takes longer than a reasonable delay (e.g., **300ms**) to load.

- **Implementation**:
  A simple custom hook can be created in `src/hooks/` to manage this delay for component-level loading.

```tsx
// src/hooks/useDelayedLoader.ts
import { useState, useEffect } from "react";

export const useDelayedLoader = (isLoading: boolean, delay: number = 300) => {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isLoading) {
      timeoutId = setTimeout(() => {
        setShowLoader(true);
      }, delay);
    } else {
      setShowLoader(false);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isLoading, delay]);

  return showLoader;
};
```

### 9. Explicit Return Types

To improve code clarity, maintainability, and prevent accidental data leaks across boundaries, we favor explicit return types for functions. This is especially critical at architectural boundaries.

#### ALWAYS Use Explicit Return Types For:

1.  **Functions at Architectural Boundaries:**

    - **API Layer Functions**: All functions in `[feature-name].api.ts` files that fetch data must have an explicit `Promise<T>` return type, where `T` is a defined type from `[feature-name].types.ts`.
    - **TanStack Router `loader` Functions**: The `loader` function for each route must have an explicit return type defining the data it provides to the component.
    - **React Components**: Component functions should have an explicit return type, typically `JSX.Element` or `React.ReactNode`.
    - **Custom Hooks**: Any custom hook (e.g., `useDelayedLoader`) must have an explicit return type.

2.  **All Other Exported Functions (`export function ...`)**:
    - If a function is exported from any file, it is part of that module's public API and its contract must be made explicit with a return type.

#### It's OK to Use Inferred Return Types For:

1.  **Short, Inline Arrow Functions**:

    - Especially inside methods like `Array.prototype.map` or `Array.prototype.filter`, where the local context makes the return type obvious.
    - _Example_: `const names = leagues.map(league => league.name); // Implicit is fine here`

2.  **Private, Internal Helper Functions**:
    - If a function is not exported and is only used as a simple helper within the same file, type inference is acceptable.
