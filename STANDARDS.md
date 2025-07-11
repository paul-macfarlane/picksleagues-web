# PicksLeagues Web Frontend Standards

This document outlines the standards for developing the PicksLeagues web frontend. For the plan to migrate the existing codebase to these standards, please see [MIGRATION_PLAN.md](./MIGRATION_PLAN.md).

## Development Standards

### 1. Directory Structure

To maintain a clear and organized codebase, we will adhere to the following directory structure:

- `src/api/`: Contains all functions that interact with the backend API. Files should be organized by resource (e.g., `leagues.ts`, `users.ts`). This directory will also contain the TanStack Query query and mutation hooks related to each resource.
- `src/components/`: For all React components.
  - `ui/`: Generic, reusable UI components (e.g., from `shadcn/ui`).
  - `form/`: Reusable, typed components for building forms.
  - `features/`: Components that are specific to a particular feature or domain (e.g., `league-card.tsx`).
- `src/hooks/`: For custom, reusable React hooks.
- `src/lib/`: For utility functions and configurations for third-party libraries (e.g., `auth-client.ts`, `utils.ts`).
- `src/routes/`: Contains all route components, following the file-based routing conventions of TanStack Router.
- `src/types/`: A central location for all TypeScript type definitions and Zod schemas related to API resources. Files should be organized by resource, mirroring the structure of `src/api/`.

### 2. Data Fetching & State Management

- **Server State**: All data fetching from the API must be managed by `TanStack Query`. This provides caching, refetching, and a consistent data-fetching layer.
- **No `useEffect` for Fetching**: Avoid using the `useEffect` hook for manual data fetching.
- **Query Keys**: Query keys should be structured and consistent. The recommended format is `['resource', { id: '...' }]` for a single item (e.g., `['leagues', { leagueId: '123' }]`) and `['resource', { params: '...' }]` for lists (e.g., `['leagues', { status: 'active' }]`).
- **API Hooks**: For every API function, a corresponding `TanStack Query` `queryOptions` object or `useMutation` hook should be exported from the same file in `src/api/`.

### 3. API Client

- All API interactions will adhere strictly to the **API Design Guide**.
- **Base Client**: The base fetch logic, including authentication handling and custom error classes, will reside in `src/api/index.ts`.
- **Error Handling**: The client must correctly parse the structured error response: `{ error: { message: string, code: string } }`.

### 4. Models & Types

- To ensure a "better separation of models," all API-related `type` definitions, `interface`s, `enum`s, and `zod` schemas will be located in the `src/types/` directory.
- This provides a single source of truth for the data structures used throughout the application.

### 5. Forms

- **Form Library**: We will standardize on `@tanstack/react-form` for all forms to ensure consistency.
- **Validation**: All form validation must be handled by `Zod` via the `@tanstack/zod-adapter`. The Zod schemas should be imported from the `src/types/` directory.
- **Form Components**: Reusable form controls (e.g., `TextField`, `SelectField`) will live in `src/components/form/` and be built to integrate seamlessly with `@tanstack/react-form`.

### 6. UI Components

- **Consistency**: For displaying common data objects like users, we will create dedicated, reusable components (e.g., a `UserDisplay` component showing an avatar and name).
- **Atomic Design Principles**: We will follow principles similar to atomic design, with generic, low-level components in `src/components/ui/` and more complex, feature-specific components composed from them in `src/components/features/`.
