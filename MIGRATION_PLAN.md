# Migration Plan

This plan outlines the incremental steps to refactor the codebase to meet the new feature-sliced standards outlined in [STANDARDS.md](./STANDARDS.md).

### Step 1: Create the Foundational Structure

**Goal**: Create the new directories and shared hooks that will be used in the refactor.

1.  Create the `src/features` and `src/hooks` directories.
2.  Create the `useDelayedLoader` hook in `src/hooks/useDelayedLoader.ts` as defined in `STANDARDS.md`.
3.  Based on the files in `src/api`, create an initial, empty directory for each feature slice (e.g., `src/features/leagues`).

### Step 2: Relocate and Split Feature Logic

**Goal**: Move all existing code from the old structure into the appropriate feature slice.

1.  Go through each file in the old `src/api` directory and move its contents to the appropriate feature slice (`types.ts`, `api.ts`).
2.  Move any feature-specific components (e.g., from `src/components/league`) into the new `components` subdirectory within the corresponding feature slice.
3.  Relocate the base API client logic from `src/api/index.ts` to `src/lib/api-client.ts`.

### Step 3: Refactor Routes for Critical Data Loading

**Goal**: Implement the new non-blocking, deferred loading pattern for all routes that fetch essential data.

1.  Identify all routes that require critical data to render (e.g., a league detail page).
2.  For each of these routes, define a `loader` function that uses `queryClient.ensureQueryData` to pre-fetch its data.
3.  Set a `pendingMs` delay (e.g., 300) on the route to prevent loading UI flashes on fast connections.
4.  Create a dedicated `pendingComponent` for the route. This component should render the page's structural layout with skeleton elements in place of the loading data.

### Step 4: Refactor UI Components and Non-Critical Data

**Goal**: Update components to use the new structure and handle their own loading states correctly.

1.  Systematically go through all components, updating their `import` statements to point to the new locations in `src/features`.
2.  For components that fetch their own non-critical data, use the `useDelayedLoader` hook to manage loading skeletons gracefully.
3.  Ensure components that rely on data from the route `loader` have their internal loading logic removed, as the router now handles this state.

### Step 5: Refactor Forms

**Goal**: Standardize all forms using `@tanstack/react-form` and `Zod`.

1.  Identify all forms in the application.
2.  Ensure each form's validation uses a `Zod` schema imported from the relevant feature slice's `types.ts` file.
3.  Convert the form to use the `@tanstack/react-form` library.

### Step 6: Clean Up and Final Review

**Goal**: Remove legacy code and ensure the new structure is consistent.

1.  Once all logic is moved and imports are updated, safely delete the original `src/api` directory.
2.  Review the `src/features` directory to ensure all slices follow the standard structure (`api.ts`, `types.ts`, `components/`).
3.  Confirm that `src/routes` files correctly implement the `loader` and `pendingComponent` pattern.
