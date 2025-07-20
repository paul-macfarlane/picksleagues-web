---
id: task-002
title: Change Member Roles
status: To Do
assignee: []
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
