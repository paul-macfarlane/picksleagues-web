---
id: task-001
title: Delete Account
status: Done
assignee: []
created_date: '2025-07-20'
updated_date: '2025-07-20'
labels: []
dependencies: []
---

## Description

As a user, I can delete my account through a dedicated account management page. The UI will call the API to perform the deletion and handle any client-side validation and feedback, including preventing deletion if the user is the sole commissioner of a league. The data required for this check will be fetched efficiently.

## Acceptance Criteria

- [x] A dedicated '/account' page is created for account management.
- [x] The "Delete Account" functionality is available on the '/account' page.
- [x] UI presents a confirmation dialog before deleting an account.
- [x] UI calls the delete account API endpoint upon confirmation.
- [x] On successful deletion, the user is logged out and redirected.
- [x] UI displays an error message if the API call fails.
- [x] If the user is the sole commissioner of a league with other members, the UI prompts them to designate a new commissioner before deletion is allowed.
- [x] The data for the sole commissioner check is fetched efficiently in the route loader.
- [x] The business logic for the sole commissioner check is encapsulated in a utility function.

## Implementation Plan

1.  Create a new route file at `src/routes/_authenticated/account/index.tsx`.
2.  Create a new component `src/features/profiles/components/account-management.tsx` to house the "Delete Account" functionality.
3.  Create a new utility function `isSoleCommissioner` in a new file at `src/features/profiles/profiles.utils.ts`.
4.  Update the `/account` route loader to pre-fetch the user's leagues with members using a new `getMyLeagues` function.
5.  Implement the "Delete Account" UI and logic in the `account-management.tsx` component, using the data from the loader and the new utility function.
6.  Update the `app-layout.tsx` component to include a link to the new `/account` page in the user dropdown menu.
7.  Remove the "Delete Account" section from `src/features/profiles/components/profile-form.tsx`.
8.  Delete the `useSoleCommissionerCheck` hook.

## Implementation Notes

Created a dedicated '/account' page for account management and moved the "Delete Account" functionality there. Implemented a confirmation dialog, API call handling, and user feedback. The check to prevent deletion for sole commissioners is now performed using data pre-fetched in the route loader, with the business logic moved to a utility function for better separation of concerns and improved performance. The old `useSoleCommissionerCheck` hook was removed.
