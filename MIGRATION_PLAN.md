# Migration Plan

This plan outlines the incremental steps to refactor the codebase to meet the new feature-sliced standards outlined in [STANDARDS.md](./STANDARDS.md).

### Step 1: Create the Foundational Structure

**Goal**: Create the new directories and shared hooks that will be used in the refactor.

1.  `[x]` Create the `src/features` and `src/hooks` directories.
2.  `[x]` Create the `useDelayedLoader` hook in `src/hooks/useDelayedLoader.ts` as defined in `STANDARDS.md`.
3.  `[x]` Based on the files in `src/api`, create an initial, empty directory for each feature slice (e.g., `src/features/leagues`).

### Step 2: Relocate and Split Feature Logic

**Goal**: Move all existing code from the old structure into the appropriate feature slice.

1.  `[x]` Go through each file in the old `src/api` directory and move its contents to the appropriate feature slice (`[feature-name].types.ts`, `[feature-name].api.ts`).
2.  `[In Progress]` Move any feature-specific components (e.g., from `src/components/league`) into the new `components` subdirectory within the corresponding feature slice. (Completed for `/` and `/profile` routes).
3.  `[x]` Relocate the base API client logic from `src/api/index.ts` to `src/lib/api.ts`.

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
2.  Ensure each form's validation uses a `Zod` schema imported from the relevant feature slice's `[feature-name].types.ts` file.
3.  Convert the form to use the `@tanstack/react-form` library.

### Step 6: Enforce Explicit Return Types

**Goal**: Audit the codebase to ensure all critical functions have explicit return types as defined in `STANDARDS.md`.

1.  **Audit API Functions**: Go through every `[feature-name].api.ts` file and ensure every exported function has an explicit `Promise<T>` return type.
2.  **Audit Route Loaders**: Check every route file in `src/routes` and add explicit return types to all `loader` functions.
3.  **Audit Custom Hooks**: Review any custom hooks (e.g., in `src/hooks`) and add explicit return types.
4.  **Audit Components**: Add `JSX.Element` or `React.Node` as the return type for all React components.
5.  **Audit All Other Exports**: Briefly review all other exported functions to ensure they comply with the new standard.

### Step 7: Clean Up and Final Review

**Goal**: Remove legacy code and ensure the new structure is consistent.

1.  `[x]` Once all logic is moved and imports are updated, safely delete the original `src/api` directory.
2.  `[ ]` Review the `src/features` directory to ensure all slices follow the standard structure (`[feature-name].api.ts`, `[feature-name].types.ts`, `components/`).
3.  `[ ]` Confirm that `src/routes` files correctly implement the `loader` and `pendingComponent` pattern.
