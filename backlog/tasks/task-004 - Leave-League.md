---
id: task-004
title: Leave League
status: Done
assignee:
  - AI
created_date: '2025-07-20'
updated_date: '2025-07-21'
labels: []
dependencies: []
---

## Description

As a league member, I can leave a league directly from the members list. The UI will call the API to handle this action and will manage any required pre-conditions and user feedback.
## Acceptance Criteria

- [ ] UI provides a 'Leave League' option in the user's action menu on the members list.
UI presents a confirmation dialog before leaving.
UI calls the leave league API endpoint upon confirmation.
If the user is the sole member
- [ ] the UI warns that the league will be deleted.
If the user is the sole commissioner
- [ ] they cannot leave the league.
UI displays an error message if the API call fails.
UI prevents a member from leaving during an active season by disabling the option or showing a validation message.
## Implementation Plan

1.  **API Function and Mutation Hook**: Create a `leaveLeague` function in `src/features/leagueMembers/leagueMembers.api.ts` to handle the `DELETE` request to `/v1/leagues/:leagueId/members/me`. Also create a `useLeaveLeague` mutation hook that will call this function and handle cache invalidation.
2.  **Update Members List UI**: Add a 'Leave League' option to the dropdown menu in the `src/features/leagueMembers/components/members-list.tsx` component. This option is only visible for the current user.
3.  **Implement Leave League Logic**: The 'Leave League' option triggers a confirmation dialog. The dialog will handle the cases where the user is the sole member or the sole commissioner.
4.  **User Feedback**: Add success and error notifications using `sonner` to provide feedback to the user after the leave league attempt.
5.  **Refactor Settings Page**: Remove the 'Leave League' button and all related logic from the `src/features/leagues/components/league-settings-form.tsx` component.
## Implementation Notes

Implemented the ability for members to leave a league. Added a new API function and a mutation hook to handle the action. The UI now features a 'Leave League' button on the league settings page, which triggers a confirmation dialog. Logic has been added to handle cases where the user is the sole member or the sole commissioner. User feedback is provided via success and error notifications.

Moved the 'Leave League' functionality from the league settings page to the members list for a more intuitive user experience. The 'Leave League' option is now available in the dropdown menu for the current user. The implementation includes a confirmation dialog with checks for sole commissioner and sole member scenarios. Refactored the settings page to remove the now-redundant 'Leave League' button.
