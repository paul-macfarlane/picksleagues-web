---
id: task-003
title: Remove Member
status: To Do
assignee: []
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
