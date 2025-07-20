---
id: task-001
title: Delete Account
status: To Do
assignee: []
created_date: '2025-07-20'
updated_date: '2025-07-20'
labels: []
dependencies: []
---

## Description

As a user, I can delete my account through the UI. The UI will call the API to perform the deletion and handle any client-side validation and feedback.
## Acceptance Criteria

- [ ] UI presents a confirmation dialog before deleting
- [ ] UI calls the delete account API endpoint upon confirmation
- [ ] On successful deletion
- [ ] the user is logged out and redirected
- [ ] UI displays an error message if the API call fails
- [ ] If the user is the sole commissioner of a league with other members
- [ ] the UI prompts them to designate a new commissioner before deletion is allowed
