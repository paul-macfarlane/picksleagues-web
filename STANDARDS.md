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
  - `api.ts`: API functions and TanStack Query hooks (`queryOptions`, `useMutation`).
  - `components/`: React components specific to this feature.
  - `types.ts`: TypeScript types, interfaces, enums, and Zod validation schemas.
  - `hooks/`: React hooks specific to this feature.
- `src/routes/`: File-based routes. These files should import from `src/features` and compose the page.
- `src/components/`:
  - `ui/`: Generic, reusable, unstyled or lightly styled UI components (e.g., from `shadcn/ui`).
  - `form/`: Reusable, typed components for building forms.
- `src/hooks/`: Custom, reusable React hooks that are shared across multiple features.
- `src/lib/`: For utility functions and configurations for third-party libraries (e.g., `auth-client.ts`, `utils.ts`).

### 3. Data Fetching & State Management

All server state, including data fetching, caching, and mutations, will be managed exclusively by **TanStack Query**.

- **Location of Hooks**: Query and mutation hooks (`queryOptions`, `useMutation`) are co-located with their API functions inside their respective feature slice (e.g., `src/features/leagues/api.ts`).
- **Query Keys**: Query keys must be structured hierarchically by feature to ensure consistency and prevent collisions. The convention is `['featureName', 'resource', { id: '...' }]` (e.g., `['leagues', 'list']`, `['leagues', 'detail', { leagueId: '123' }]`).

#### Data Fetching Strategy: Route Loaders vs. Component-Level Fetching

We will use a hybrid approach that leverages the strengths of both TanStack Router's loaders and TanStack Query's component-level hooks. The choice depends on whether the data is critical for the initial render.

**A. Use Route Loaders for CRITICAL Data**

Fetch data in a route's `loader` function when the page or view cannot be meaningfully rendered without it. This provides instant navigation feedback for the user while the critical data loads in the background.

- **When to Use**:

  - The primary resource for a detail page (e.g., the league data for `/leagues/$leagueId`).
  - The list of items for an index page (e.g., the list of leagues for `/leagues`).
  - Core user data required for a profile page.

- **Implementation**:
  1.  Define a `loader` function on the route that calls `queryClient.ensureQueryData`. This pre-fetches the data and populates the TanStack Query cache.
  2.  Set a `pendingMs` delay on the route (e.g., `300`). The router will wait this long before showing a fallback. This prevents flashing a loading UI on fast connections.
  3.  Define a `pendingComponent`. This component will be rendered if the `loader` takes longer than `pendingMs`. It should render the basic page layout with skeleton components where the data will appear.
  4.  The final route component will access the data using `useQuery`. Because the `loader` populates the cache, the query will either be instant (if the loader finished) or suspended until the data is ready, which works seamlessly with the `pendingComponent`.

**B. Use Component-Level `useQuery` for NON-CRITICAL Data**

Fetch data directly within a component using the `useQuery` hook when the data is not essential for the initial meaningful paint of the page. This improves perceived performance by allowing the primary content to render immediately.

- **When to Use**:

  - Secondary content, such as a "related items" sidebar.
  - Data that is loaded in response to a user interaction (e.g., opening a modal or a dropdown).
  - Content that is "below the fold" or less important.

- **Implementation**:
  1.  Call the `useQuery` hook directly within the component that needs the data.
  2.  The component must handle its own loading and error states, typically by displaying a skeleton loader or a placeholder. This prevents layout shifts when the data loads.

By following this hybrid model, we get the best of both worlds: fast perceived performance for non-critical content and a stable, flicker-free initial render for the essential data of any given route.

### 4. API Client

- All API interactions will adhere strictly to the **API Design Guide**.
- **Base Client**: The base fetch logic, including authentication handling and custom error classes, will reside in `src/lib/api-client.ts`.
- **Error Handling**: The client must correctly parse the structured error response: `{ error: { message: string, code: string } }`.

### 5. Models & Types

- All API-related `type` definitions and `zod` schemas are co-located within their feature slice in a `types.ts` file. This keeps the data definitions right next to the code that uses them.

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

    - **API Layer Functions**: All functions in `api.ts` files that fetch data must have an explicit `Promise<T>` return type, where `T` is a defined type from `types.ts`.
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
