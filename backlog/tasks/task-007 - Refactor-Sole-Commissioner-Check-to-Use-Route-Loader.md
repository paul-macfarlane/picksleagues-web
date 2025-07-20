---
id: task-007
title: Refactor Sole Commissioner Check to Use Route Loader
status: In Progress
assignee: []
created_date: '2025-07-20'
updated_date: '2025-07-20'
labels: []
dependencies: []
---

## Description

Refactor the sole commissioner check to fetch data in the '/account' route loader instead of a component-level hook. The business logic will be moved to a utility function, and the component will consume the pre-fetched data.

## Acceptance Criteria

- [ ] A utility function is created to determine if a user is a sole commissioner.
- [ ] The '/account' route loader fetches the user's leagues with members.
- [ ] The AccountManagement component uses the loader's data and the utility function.
- [ ] The old 'useSoleCommissionerCheck' hook is removed.

## Implementation Plan

1. Create a new utility function 'isSoleCommissioner' in a new file at 'src/features/profiles/profiles.utils.ts'.
2. Update the '/account' route loader to pre-fetch the user's leagues with members.
3. Update the 'AccountManagement' component to use the data from the loader and the new utility function.
4. Delete the 'useSoleCommissionerCheck' hook.
