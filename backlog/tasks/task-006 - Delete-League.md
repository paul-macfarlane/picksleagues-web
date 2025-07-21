---
id: task-006
title: Delete League
status: Done
assignee: []
created_date: '2025-07-21'
updated_date: '2025-07-21'
labels: []
dependencies: []
---

## Description

As a league commissioner, I can delete a picks league. This removes all data associated with this league (members, picks, standings, seasons, etc). I am warned of the consequences before I perform this action.

## Acceptance Criteria

- [x] A league commissioner can delete a league.
- [x] Deleting a league removes all associated data (members, picks, standings, seasons, etc).
- [x] The commissioner is warned before deleting the league.

## Implementation Notes

- Added `deleteLeague` and `useDeleteLeague` to `src/features/leagues/leagues.api.ts`.
- Created `DeleteLeagueDialog` component in `src/features/leagues/components/delete-league-dialog.tsx`.
- Updated `LeagueSettingsForm` in `src/features/leagues/components/league-settings-form.tsx` to include a "Delete League" button and the `DeleteLeagueDialog`.
- The "Delete League" button is only visible to league commissioners.
- After a successful deletion, the user is redirected to the football home page.
