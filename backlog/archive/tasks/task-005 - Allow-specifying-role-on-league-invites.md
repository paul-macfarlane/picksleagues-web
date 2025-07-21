---
id: task-005
title: Allow specifying role on league invites
status: Done
assignee: []
created_date: "2025-07-20"
updated_date: "2025-07-20"
labels: []
dependencies: []
---

## Description

As a league commissioner, I should be able to specify the role (e.g., 'member' or 'commissioner') of a user when sending a direct invite or creating an invite link. This provides more granular control over league management.

## Acceptance Criteria

- [x] The direct-invite-form.tsx includes a dropdown to select a role for the invitee.
- [x] The create-invite-link-form.tsx includes a dropdown to select a role for the invite link.
- [x] The selected role is correctly sent to the API when creating an invite.
- [x] The default role for new invites is 'member'.

## Implementation Plan

1. Add a 'role' dropdown to the DirectInviteFormComponent.
2. Add a 'role' dropdown to the CreateInviteLinkFormComponent.
3. Update the form schemas to include the 'role' field.
4. Ensure the selected role is passed to the 'createInvite' mutation.

## Implementation Notes

Added a role selection dropdown to both the direct invite and create invite link forms. The selected role is now included in the form submission data and sent to the API. The default role is 'member'. The layout of the forms was also adjusted for better usability.
