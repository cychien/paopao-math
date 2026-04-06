---
name: add-whitelist-email
description: Use when the user asks to "add whitelist email", "新增白名單", "加白名單", "whitelist user", or provides emails for users who purchased privately and should bypass AppCustomer verification.
---

# Add Whitelist Email

Add emails to `app/data/whitelist.ts` so these users can log in without an AppCustomer record from a payment provider. An AppCustomer is auto-created on their first login.

## Workflow

### Step 1: Collect Emails

Get one or more email addresses from the user. Normalize to lowercase.

### Step 2: Edit whitelist.ts

File: `app/data/whitelist.ts`

Add emails to the `whitelistedEmails` array:

```ts
const whitelistedEmails: string[] = [
  "existing@example.com",
  "new-email@example.com",  // <-- add here
];
```

### Step 3: Verify

1. No duplicate emails in the array
2. All emails are lowercase
3. TypeScript compiles without errors (`npx tsc --noEmit` on the file)

## Quick Reference

| Item | Value |
|------|-------|
| File | `app/data/whitelist.ts` |
| Array | `whitelistedEmails` |
| Format | Lowercase email strings |
| Auth paths affected | OTP login, Google OAuth |
| Effect | Auto-creates AppCustomer on first login |
