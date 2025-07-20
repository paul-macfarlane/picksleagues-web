---
id: task-002
title: Change Member Roles
status: In Progress
assignee:
  - AI
created_date: '2025-07-20'
updated_date: '2025-07-20'
labels: []
dependencies: []
---

## Description

As a league commissioner, I can use the UI to edit other league member roles. The UI will call the appropriate API endpoint to change the role and provide feedback to the user.
## Acceptance Criteria

- [ ] UI provides an interface for a commissioner to change another member's role.
- [ ] UI calls the change member role API endpoint with the correct member ID and new role.
- [ ] UI displays a success message upon successful role change.
- [ ] UI displays an error message if the API call fails.
- [ ] The UI prevents a commissioner from changing their own role to 'member' unless another commissioner exists
- [ ] by disabling the option or showing a validation message.

## Implementation Plan

1.  **API Function and Mutation Hook**: Create a `changeMemberRole` function in `src/features/leagueMembers/leagueMembers.api.ts` to handle the `PATCH` request. I'll also create a `useChangeMemberRole` mutation hook that will call this function and handle cache invalidation.
2.  **Update Members List UI**: I will modify the `src/features/leagueMembers/components/members-list.tsx` component to include a dropdown menu for each member, allowing a commissioner to change their role.
3.  **Implement Role Change Logic**: The dropdown will trigger the `useChangeMemberRole` mutation. I'll add logic to disable the option for a commissioner to change their own role if they are the sole commissioner.
4.  **User Feedback**: I will add success and error notifications using `sonner` to provide feedback to the user after the role change attempt.
