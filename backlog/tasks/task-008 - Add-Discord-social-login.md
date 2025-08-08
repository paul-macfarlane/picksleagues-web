---
id: task-008
title: Add Discord social login
status: To Do
assignee: []
created_date: '2025-08-08'
labels: []
dependencies: []
---

## Description

Users can log into Picks Leagues using the following Social Login Providers: Google, Apple, Discord. Users can sign in with multiple social providers that have the same email. When existing users log in, they are redirected to home. When new users log in, they are redirected to setting up their profile.

## Acceptance Criteria

- [ ] Login page shows Google
- [ ] Apple
- [ ] and Discord sign-in options
- [ ] Discord OAuth completes and authenticates the user
- [ ] Signing in with a second provider using the same email logs into the same account (no duplicate user)
- [ ] Existing users are redirected to home after login
- [ ] New users are redirected to profile setup after first login
- [ ] Type-checks and lints pass
