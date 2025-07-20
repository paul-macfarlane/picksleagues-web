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
