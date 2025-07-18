> [!NOTE]
> This migration is complete. The plan is preserved for historical reference.

# Migration Plan

This plan outlines the incremental steps to refactor the codebase to meet the new feature-sliced standards outlined in [STANDARDS.md](./STANDARDS.md).

### Step 1: Create the Foundational Structure [x]

**Goal**: Create the new directories and shared hooks that will be used in the refactor.

1.  `[x]` Create the `src/features` and `src/hooks` directories.
2.  `[x]` Create the `useDelayedLoader` hook in `src/hooks/useDelayedLoader.ts` as defined in `STANDARDS.md`.
3.  `[x]` Based on the files in `src/api`, create an initial, empty directory for each feature slice (e.g., `src/features/leagues`).

### Step 2: Relocate and Split Feature Logic

**Goal**: Move all existing code from the old structure into the appropriate feature slice.

1.  `[x]` Go through each file in the old `src/api` directory and move its contents to the appropriate feature slice (`[feature-name].types.ts`, `[feature-name].api.ts`).
2.  `[x]` Move any feature-specific components (e.g., from `src/components/league`) into the new `components` subdirectory within the corresponding feature slice. (Completed for `/`, `/profile`, `/login`, `/join`, `/football/pick-em/create`, `/football/pick-em/$leagueId/members`, the `/football/pick-em/$leagueId` layout, `/football/pick-em/$leagueId/settings`, `/football/pick-em/$leagueId/league-picks`, `/football/pick-em/$leagueId/my-picks`, and `/football/pick-em/$leagueId/` routes).
3.  `[x]` Relocate the base API client logic from `src/api/index.ts` to `src/lib/api.ts`.

### Step 3: Refactor Route-Level Data Fetching [x]

**Goal**: Implement the new non-blocking, deferred loading pattern for all routes that fetch data.

1.  **Identify Data Requirements**: For each route, identify what data is needed and whether it's critical for the initial render.
2.  **Define `queryOptions`**: In the corresponding `[feature-name].api.ts` file, create and export a reusable `queryOptions` object for each query. This should contain the `queryKey` and `queryFn`. Note that in many cases these will already be defined in the api file.
3.  **Implement Route `loader`s**: In the route definition file, add a `loader` function.
    - Use `await queryClient.ensureQueryData(queryOptions)` for data that is **critical** for the initial render.
    - Use `queryClient.ensureQueryData(queryOptions)` (without `await`) for non-critical data that can be loaded in the background.
4.  **Create `pending` and `error` Components**:
    - Create a `pendingComponent` for the route that renders the page's structural layout with skeleton elements.
    - To prevent UI flashes on fast connections, set a `pendingMs` delay (e.g., 300ms) on the route.
    - For the `errorComponent`, use the standardized `RouteErrorBoundary` component from `src/components/route-error-boundary.tsx`. This ensures all data fetching errors are handled consistently.
5.  **Update Route Component**:
    - Replace any existing data fetching logic (e.g., `useEffect` with fetch, `useQuery`) in the component with `useSuspenseQuery(queryOptions)`.
    - Since the `loader` ensures the data is available, `useSuspenseQuery` will read from the cache and render instantly without triggering a suspense fallback on the initial load.

### Step 4: Refactor Components and Update Imports [x]

**Goal**: Update components to use data from route loaders, handle component-level data fetching correctly, and update all imports to reflect the new project structure.

1.  **Update Imports**: Systematically go through all components and update their `import` statements to point to the new locations in `src/features`.
2.  **Refactor Components for Route Data**: Ensure components that rely on data from a route `loader` have their internal loading logic removed and are using `useSuspenseQuery` as described in Step 3.
3.  **Handle Component-Level Data Fetching**:
    - Identify components that fetch their own data based on user interaction (e.g., a search input) rather than the route URL.
    - For these components, continue to use `useQuery`.
    - To prevent UI flashes for these queries, use the `useDelayedLoader` hook to only show a loading skeleton if the request takes longer than a set delay (e.g., 300ms).

### Step 5: Refactor Forms [x]

**Goal**: Standardize all forms using `@tanstack/react-form` and `Zod`.

1.  Identify all forms in the application.
2.  Ensure each form's validation uses a `Zod` schema imported from the relevant feature slice's `[feature-name].types.ts` file.
3.  Convert the form to use the `@tanstack/react-form` library.

### Step 6: Enforce Explicit Return Types [x]

**Goal**: Audit the codebase to ensure all critical functions have explicit return types as defined in `STANDARDS.md`.

1.  **Audit API Functions**: Go through every `[feature-name].api.ts` file and ensure every exported function has an explicit `Promise<T>` return type.
2.  **Audit Custom Hooks**: Review any custom hooks (e.g., in `src/hooks`) and add explicit return types.
3.  **Audit All Other Exports**: Briefly review all other exported functions to ensure they comply with the new standard.

### Step 7: Clean Up and Final Review

**Goal**: Remove legacy code and ensure the new structure is consistent.

1.  `[x]` Once all logic is moved and imports are updated, safely delete the original `src/api` directory.
2.  `[x]` Review the `src/features` directory to ensure all slices follow the standard structure (`[feature-name].api.ts`, `[feature-name].types.ts`, `components/`).
3.  `[x]` Confirm that `src/routes` files correctly implement the `loader` and `pendingComponent` pattern.
