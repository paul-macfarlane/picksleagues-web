---
id: task-003
title: Remove Member
status: In Progress
assignee:
  - AI
created_date: '2025-07-20'
updated_date: '2025-07-20'
labels: []
dependencies: []
---

## Description

As a league commissioner, I can use the UI to remove a league member. The UI will call the API to perform the removal and provide necessary warnings and feedback.
## Acceptance Criteria

- [ ] UI presents a confirmation dialog before removing a member.
- [ ] UI calls the remove member API endpoint upon confirmation.
- [ ] UI displays a success message upon successful removal.
- [ ] UI displays an error message if the API call fails.
- [ ] The UI prevents a member from being removed during an active season by disabling the option or showing a validation message.
- [ ] The UI prevents a commissioner from removing themselves.

## Implementation Plan

1.  **API Function and Mutation Hook**: Create a `removeMember` function in `src/features/leagueMembers/leagueMembers.api.ts` to handle the `DELETE` request. I'll also create a `useRemoveMember` mutation hook that will call this function and handle cache invalidation.
2.  **Update Members List UI**: I will modify the `src/features/leagueMembers/components/members-list.tsx` component to include a confirmation dialog (`AlertDialog`) for the 'Remove Member' action.
3.  **Implement Removal Logic**: The dialog will trigger the `useRemoveMember` mutation. I'll add logic to prevent a member from being removed if they are the acting commissioner or if the season is active.
4.  **User Feedback**: I will add success and error notifications using `sonner` to provide feedback to the user after the removal attempt.
