---
id: task-007
title: Edit League Settings
status: In Progress
assignee: []
created_date: '2025-07-21'
updated_date: '2025-07-21'
labels: []
dependencies: []
---

## Description

As a commissioner I can edit league settings like name and profile picture. If the league is not in season (between start week and end week). I can also edit start week, end week, picks per week, league size (can’t go below existing amount of members), and pick type.

## Acceptance Criteria

- [ ] - [x] A commissioner can edit league settings (name
- [ ] profile picture).
- [ ] - [x] If the league is not in season
- [ ] a commissioner can edit start week
- [ ] end week
- [ ] picks per week
- [ ] league size
- [ ] and pick type.
- [ ] - [x] League size cannot be reduced below the current number of members.
## Implementation Plan

1. Create the API endpoint and query options for updating league settings in `src/features/leagues/leagues.api.ts`.\n2. Add the necessary types for the update payload in `src/features/leagues/leagues.types.ts`.\n3. Update the existing `league-settings-form.tsx` component to use the new mutation and handle the form logic for editing the league settings. This will include conditionally showing fields based on whether the season has started.\n4. Update the route loader for the settings page to fetch any necessary data for the form, such as the current league settings.\n5. Ensure cache invalidation is handled correctly after a successful update, as per the standards.

## Implementation Notes

Added the ability for league commissioners to edit league settings. This includes updating the league name, image, and, if the season has not started, other settings like league size and picks per week. The implementation follows the project's standards, using TanStack Query for mutations and TanStack Form for the settings form. The relevant files modified were: `src/features/leagues/leagues.api.ts`, `src/features/leagues/leagues.types.ts`, `src/features/leagues/components/league-settings-form.tsx`, and `src/routes/_authenticated/football/pick-em/.settings.tsx`.
