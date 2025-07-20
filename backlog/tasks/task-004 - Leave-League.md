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
