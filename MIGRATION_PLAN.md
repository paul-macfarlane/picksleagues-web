# Migration Plan

This plan outlines the incremental steps to refactor the codebase to meet the new feature-sliced standards outlined in [STANDARDS.md](./STANDARDS.md).

### Step 1: Create the Feature Slices

**Goal**: Create the new directory structure for all existing features.

1.  Create the `src/features` directory.
2.  Based on the files in `src/api` (`leagues.ts`, `profiles.ts`, `leagueMembers.ts`, etc.), create a corresponding feature directory for each resource. For example:
    - `src/features/leagues`
    - `src/features/profiles`
    - `src/features/leagueMembers`
    - ...and so on.
3.  Inside each new feature directory, create the standard sub-structure: an `api.ts` file, a `types.ts` file, and a `components` subdirectory.

### Step 2: Relocate and Split Feature Logic

**Goal**: Move all existing code from the old structure into the appropriate feature slice.

1.  Go through each file in the old `src/api` directory (e.g., `src/api/leagues.ts`).
2.  **Split the content**:
    - Move all `type`, `interface`, `enum`, and `zod` schema definitions from that file into the `types.ts` of the corresponding feature slice (e.g., `src/features/leagues/types.ts`).
    - Move all API call functions and TanStack Query hooks (`useMutation`, `queryOptions`) into the `api.ts` of the corresponding feature slice (e.g., `src/features/leagues/api.ts`).
3.  Move any feature-specific components from `src/components/[feature]` to the new `components` subdirectory within the feature slice (e.g., `src/components/league/league-card.tsx` moves to `src/features/leagues/components/league-card.tsx`).
4.  Relocate the base API client logic from `src/api/index.ts` to `src/lib/api-client.ts`.

### Step 3: Update Imports Across the Application

**Goal**: Re-wire the application to use the newly located modules.

1.  This is the most tedious step. Systematically go through every file in `src/routes` and `src/features`.
2.  Update all `import` statements to point to the new locations of types, API calls, hooks, and components within the `src/features` directories.
3.  Your IDE's "find and replace" or "move file and update imports" feature will be very helpful here.

### Step 4: Clean Up Old Directories

**Goal**: Remove the now-empty legacy directories.

1.  Once all logic has been moved and all imports have been updated, the application should build and run correctly.
2.  Safely delete the original `src/api` directory.
3.  Safely delete any old feature-specific component directories like `src/components/league`.

### Step 5: Final Review

**Goal**: Ensure the new structure is consistent and correct.

1.  Review the `src/features` directory to ensure all slices follow the new standard structure.
2.  Check that the `src/routes` files are now primarily responsible for layout and composition, importing their logic from the feature slices.
3.  Ensure no imports reference the old, deleted paths.
