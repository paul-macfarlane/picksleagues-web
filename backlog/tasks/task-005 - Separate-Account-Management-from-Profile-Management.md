---
id: task-005
title: Separate Account Management from Profile Management
status: In Progress
assignee: []
created_date: '2025-07-20'
updated_date: '2025-07-20'
labels: []
dependencies: []
---

## Description

Create a dedicated page for account management tasks, distinct from profile editing. The first feature on this page will be account deletion. This will improve separation of concerns and provide a home for future account-level settings like payment plans.

## Acceptance Criteria

- [ ] A new route '/account' is created for account management.
- [ ] The 'Delete Account' functionality is moved from the '/profile' page to the '/account' page.
- [ ] The '/profile' page no longer contains the 'Delete Account' section.
- [ ] A link to the new '/account' page is available in the user's profile dropdown menu.
