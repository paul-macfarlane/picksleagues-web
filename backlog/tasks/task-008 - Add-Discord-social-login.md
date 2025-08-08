---
id: task-008
title: Add Discord social login
status: Done
assignee:
  - '@assistant'
created_date: '2025-08-08'
updated_date: '2025-08-08'
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

## Implementation Plan

1) Add Discord provider button to login card\n2) Wire up auth client to call social sign-in with provider 'discord' and callback to /api/v1/profiles/onboard\n3) Add Discord logo asset and styling consistent with existing buttons\n4) Verify redirects: existing users -> home, new users -> profile setup\n5) Ensure multiple providers with same email map to the same account at auth backend (assumed configured)\n6) Type-check and lint

## Implementation Notes

Implementation completed:\n\n1. Added Discord SVG logo asset to src/assets/discord.svg\n2. Updated login-card.tsx to add Discord sign-in button with consistent styling\n3. Integrated with authClient.signIn.social using 'discord' provider and /api/v1/profiles/onboard callback\n4. Verified build and lint checks pass\n5. Reuses existing redirect logic: new users -> profile setup, existing users -> home\n\nModified files:\n- src/assets/discord.svg (new)\n- src/features/auth/components/login-card.tsx
