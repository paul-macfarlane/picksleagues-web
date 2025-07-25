---
id: task-005
title: Separate Account Management from Profile Management
status: Done
assignee: []
created_date: "2025-07-20"
updated_date: "2025-07-20"
labels: []
dependencies: []
---

## Description

Create a dedicated page for account management tasks, distinct from profile editing. The first feature on this page will be account deletion. This will improve separation of concerns and provide a home for future account-level settings like payment plans.

## Acceptance Criteria

- [x] A new route '/account' is created for account management.
- [x] The 'Delete Account' functionality is moved from the '/profile' page to the '/account' page.
- [x] The '/profile' page no longer contains the 'Delete Account' section.
- [x] A link to the new '/account' page is available in the user's profile dropdown menu.

## Implementation Plan

1. Create a new route file at 'src/routes/\_authenticated/account/index.tsx'.
2. Create a new component 'src/features/profiles/components/account-management.tsx' to house the 'Delete Account' functionality.
3. Move the 'Delete Account' UI and logic from 'src/features/profiles/components/profile-form.tsx' to the new 'account-management.tsx' component.
4. Update the 'app-layout.tsx' component to include a link to the new '/account' page in the user dropdown menu.
5. Remove the 'Delete Account' section from 'src/features/profiles/components/profile-form.tsx'.

## Implementation Notes

Created a new route and component for account management at '/account'. Moved the 'Delete Account' functionality from the profile page to the new account management page. Added a link to the new page in the user dropdown menu. Removed the 'Delete Account' section from the profile form.
