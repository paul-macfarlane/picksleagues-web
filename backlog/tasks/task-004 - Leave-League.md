---
id: task-004
title: Leave League
status: In Progress
assignee:
  - AI
created_date: '2025-07-20'
updated_date: '2025-07-20'
labels: []
dependencies: []
---

## Description

As a league member, I can use the UI to leave a league. The UI will call the API to handle this action and will manage any required pre-conditions and user feedback.

## Acceptance Criteria

- [ ] UI provides a 'Leave League' button.
- [ ] UI presents a confirmation dialog before leaving.
- [ ] UI calls the leave league API endpoint upon confirmation.
- [ ] If the user is the sole member, the UI warns that the league will be deleted.
- [ ] If the user is the sole commissioner, the UI prompts them to designate a new one before allowing them to leave.
- [ ] UI displays an error message if the API call fails.
- [ ] UI prevents a member from leaving during an active season by disabling the option or showing a validation message.

## Implementation Plan

1.  **API Function and Mutation Hook**: Create a `leaveLeague` function in `src/features/leagues/leagues.api.ts` to handle the `DELETE` request to `/v1/leagues/:leagueId/members/me`. I'll also create a `useLeaveLeague` mutation hook that will call this function and handle cache invalidation.
2.  **Update League Settings UI**: I will add a 'Leave League' button to the `src/features/leagues/components/league-settings-form.tsx` component.
3.  **Implement Leave League Logic**: The button will trigger the `useLeaveLeague` mutation within a confirmation dialog. I'll add logic to handle the cases where the user is the sole member or the sole commissioner.
4.  **User Feedback**: I will add success and error notifications using `sonner` to provide feedback to the user after the leave league attempt.
