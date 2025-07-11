# Migration Plan

This plan outlines the incremental steps to refactor the codebase to meet the new standards outlined in [STANDARDS.md](./STANDARDS.md).

### Step 1: Establish Centralized Type Definitions

**Goal**: Move all type and schema definitions to the `src/types` directory.

1.  Create the `src/types` directory.
2.  Iterate through each file in `src/api` (e.g., `leagues.ts`, `profiles.ts`).
3.  For each file, move all `type`, `interface`, `enum`, and `zod` schema definitions to a new, corresponding file in `src/types` (e.g., types from `src/api/leagues.ts` go into `src/types/leagues.ts`).
4.  Update all imports across the application to reference the new type locations in `src/types`.

### Step 2: Refactor the API Layer

**Goal**: Align the API client with the API Design Guide and new standards.

1.  Update the `detectAndThrowError` function in `src/api/index.ts` to correctly parse the new nested error structure (`error.message`, `error.code`).
2.  Review and refactor all functions in the `src/api` directory to ensure they align with the API's URL structure (plural nouns, nesting) and naming conventions (camelCase).
3.  Ensure that the API functions are clean of any type definitions, as they should now reside in `src/types`.

### Step 3: Standardize Data Fetching with TanStack Query

**Goal**: Replace all manual data fetching with standardized `TanStack Query` hooks.

1.  Audit all components that currently fetch data.
2.  Replace any `fetch` calls within `useEffect` hooks with the appropriate `TanStack Query` hooks (`useSuspenseQuery`, `useMutation`) that are exported from the `src/api` files.
3.  Ensure all API functions in `src/api` have a corresponding `queryOptions` object or `useMutation` hook co-located with them.

### Step 4: Consolidate Form Implementation

**Goal**: Unify all forms to use `@tanstack/react-form` and `Zod`.

1.  Identify all forms in the application.
2.  Refactor each form to use the `useForm` hook from `@tanstack/react-form`.
3.  Use the `zodValidator` to connect the form to the Zod schemas defined in `src/types`.
4.  Replace raw `<input>` elements with the reusable components from `src/components/form`, ensuring they are correctly registered with the form instance.

### Step 5: Simplify and Generalize the UI

**Goal**: Reduce code duplication and increase UI consistency by creating reusable components.

1.  Identify common, repeated UI patterns. A key example is how user information (avatar, name) is displayed.
2.  Create a `UserDisplay` component (or similar) that takes a user/profile object and renders it consistently.
3.  Refactor all instances where user information is displayed to use this new component.
4.  Look for other opportunities to create reusable components and place them in either `src/components/ui` or `src/components/features`.
