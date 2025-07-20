---
id: task-006
title: Refactor useSoleCommissionerCheck to use a single API call
status: In Progress
assignee: []
created_date: '2025-07-20'
updated_date: '2025-07-20'
labels: []
dependencies: []
---

## Description

The useSoleCommissionerCheck hook currently makes a large number of API calls to determine if a user is a sole commissioner of any leagues. This should be refactored to use a new, more efficient API endpoint at '/api/v1/users/me/leagues' which can return all of a user's leagues and their members in a single request.

## Acceptance Criteria

- [ ] A new API function is created to fetch data from '/api/v1/users/me/leagues?include=members'.
- [ ] The useSoleCommissionerCheck hook is updated to use this new API function.
- [ ] The useSoleCommissionerCheck hook makes only one API call to fetch all necessary league and member data.
- [ ] The hook correctly determines if the user is a sole commissioner based on the new data structure.
- [ ] The old
- [ ] inefficient data fetching logic is removed.
