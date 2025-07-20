---
id: task-001
title: Delete Account
status: In Progress
assignee: []
created_date: '2025-07-20'
updated_date: '2025-07-20'
labels: []
dependencies: []
---

## Description

As a user, I can delete my account through the UI. The UI will call the API to perform the deletion and handle any client-side validation and feedback.

## Acceptance Criteria

- [x] UI presents a confirmation dialog before deleting an account.
- [x] UI calls the delete account API endpoint upon confirmation.
- [x] On successful deletion, the user is logged out and redirected.
- [x] UI displays an error message if the API call fails.
- [x] If the user is the sole commissioner of a league with other members, the UI prompts them to designate a new commissioner before deletion is allowed.

## Implementation Plan

1. Create the UI for the 'Delete Account' section. This will likely be on the user's profile page and will include a 'Delete Account' button.
2. Implement the confirmation dialog. When the user clicks the 'Delete Account' button, a dialog will appear warning them of the consequences and asking for confirmation.
3. Implement the API call. Upon confirmation, the UI will call the DELETE /api/users/me endpoint.
4. Handle successful deletion. If the API call is successful, the user will be logged out and redirected to the homepage.
5. Handle API errors. If the API call fails, an error message will be displayed to the user.
6. Handle the sole commissioner case. Before showing the confirmation dialog, check if the user is the sole commissioner of a league with other members. If so, display a message instructing them to designate a new commissioner and disable the delete button.

## Implementation Notes

Created the UI for the 'Delete Account' section on the user's profile page. Implemented a confirmation dialog to warn users before account deletion. Added an API call to the delete account endpoint. On successful deletion, the user is logged out and redirected to the homepage. Implemented error handling for the API call. Added a check to prevent a user from deleting their account if they are the sole commissioner of a league with other members.
