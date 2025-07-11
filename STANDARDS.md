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

- **Server State**: All data fetching is managed by `TanStack Query`.
- **Location of Hooks**: Query and mutation hooks are co-located with their API functions inside their respective feature slice (e.g., `src/features/leagues/api.ts`).
- **Query Keys**: Query keys should be structured by feature: `['featureName', 'resource', { id: '...' }]` (e.g., `['leagues', 'leagues', { leagueId: '123' }]`).

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
