# OTP and Google OAuth Login Implementation Summary

## Overview
Successfully implemented OTP-based email login and Google OAuth login as replacements for the magic link authentication system.

## What Was Implemented

### 1. Database Schema Changes
**File:** `prisma/schema.prisma`
- Added `otp` field to `EmailChallenge` model to store hashed 6-digit codes
- Added `attempts` field to track verification attempts (default: 0)
- Added `lockedUntil` field for rate limiting lockouts

### 2. OTP Service
**File:** `app/services/auth/otp.server.ts`
- `generateOTP()` - Generates cryptographically secure 6-digit codes
- `createOTPChallenge()` - Creates challenge with customer verification
- `verifyOTP()` - Verifies OTP with rate limiting (3 attempts / 15 min)
- `checkRateLimit()` - Rate limit checking via Redis
- `cleanupExpiredOTPChallenges()` - Cleanup utility

**Rate Limiting:**
- Max 3 verification attempts per email/IP
- 15-minute lockout after exceeded attempts
- 10-minute OTP expiry time
- Uses Redis cache + database persistence

### 3. OTP Email Service
**File:** `app/services/email/otp-email.ts`
- `sendOTPEmail()` - Sends OTP via Loops.so transactional API
- `validateOTPEmailConfig()` - Validates environment variables
- Development mode fallback: logs OTP to console

**Loops.so Integration:**
- Uses transactional email API
- Required variables: `email`, `otp`, `expiryMinutes`
- Template ID: `LOOPS_OTP_TRANSACTIONAL_ID`

### 4. Google OAuth Service
**File:** `app/services/auth/google-oauth.server.ts`
- `getGoogleAuthUrl()` - Generates OAuth authorization URL
- `exchangeCodeForTokens()` - Exchanges code for access token
- `getGoogleUserInfo()` - Fetches user email from Google API
- `validateGoogleOAuthConfig()` - Config validation
- `getGoogleOAuthStatus()` - Status checking

### 5. Updated Login Page
**File:** `app/routes/auth.login.tsx`
- Two-step authentication flow:
  1. **Step 1:** Email input → Send OTP
  2. **Step 2:** 6-digit OTP input → Auto-submit on completion
- Google login button with OAuth redirect
- Error handling from verification redirects
- Rate limit error messages
- Resend OTP functionality

**UI Components Used:**
- `InputOTP` - 6-slot OTP input with auto-focus
- `InputGroup` - Email input with icon
- Google login button with SVG icon

### 6. Google OAuth Callback Route
**File:** `app/routes/auth.callback.google.tsx`
- Handles OAuth callback from Google
- Exchanges authorization code for tokens
- Gets user email from Google
- Verifies email exists in `AppCustomer` table
- Creates `CustomerSession` and redirects to `/learn`
- Updates customer name if not set

### 7. Updated Verify Route
**File:** `app/routes/auth.verify.tsx`
- Handles OTP verification (replaces magic link verification)
- Accepts `c` (challengeId) and `otp` parameters
- Implements rate limiting checks
- Creates customer session on success
- Redirects with error messages on failure

## Environment Variables Required

```bash
# Google OAuth (new)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Loops.so OTP Template (new)
LOOPS_OTP_TRANSACTIONAL_ID=

# Existing (already configured)
LOOPS_API_KEY=
APP_URL=
SESSION_SECRET=
DATABASE_URL=
DIRECT_URL=
REDIS_URL=
```

## Security Features

### Rate Limiting
- 3 attempts per email/IP combination
- 15-minute lockout on exceeded attempts
- Uses Redis for performance + database for persistence
- IP address tracking from headers

### OTP Security
- Cryptographically secure random generation
- SHA-256 hashing before storage
- 10-minute expiry time
- One-time use (marked as CONSUMED)
- Challenge locked after max attempts

### Google OAuth Security
- Uses official Google OAuth 2.0 flow
- Validates verified_email from Google
- Checks against AppCustomer records (purchase verification)
- Secure token exchange server-side only

## User Flow

### Email + OTP Login
1. User enters email on login page
2. System verifies email exists in `AppCustomer`
3. Generates 6-digit OTP, creates challenge
4. Sends OTP via Loops.so email
5. User enters OTP in 6-slot input
6. Auto-submits when complete
7. Verifies OTP with rate limiting
8. Creates customer session, redirects to `/learn`

### Google OAuth Login
1. User clicks "使用 Google 登入" button
2. Redirects to Google OAuth consent screen
3. User authorizes access
4. Google redirects to callback with code
5. Server exchanges code for access token
6. Fetches user email from Google API
7. Verifies email exists in `AppCustomer`
8. Creates customer session, redirects to `/learn`

## Error Handling

### OTP Errors
- Invalid/expired OTP
- Too many attempts (with lockout message)
- Email not purchased
- Email sending failure

### Google OAuth Errors
- OAuth authorization failed
- Token exchange failed
- User info fetch failed
- Email not purchased (redirects with email param)

## Database Migration

Run this to apply schema changes:
```bash
npx prisma migrate dev --name add_otp_fields
```

## Testing Checklist

- [ ] Email OTP flow works end-to-end
- [ ] OTP expires after 10 minutes
- [ ] Rate limiting triggers after 3 failed attempts
- [ ] 15-minute lockout enforced
- [ ] Google OAuth flow works end-to-end
- [ ] Google OAuth verifies purchase status
- [ ] Error messages display correctly
- [ ] Resend OTP functionality works
- [ ] Development mode logs OTP to console
- [ ] Production mode sends email via Loops.so

## Files Modified/Created

### Created (7 files)
1. `app/services/auth/otp.server.ts`
2. `app/services/email/otp-email.ts`
3. `app/services/auth/google-oauth.server.ts`
4. `app/routes/auth.callback.google.tsx`
5. `ENV_SETUP.md`
6. `IMPLEMENTATION_SUMMARY.md` (this file)

### Modified (3 files)
1. `prisma/schema.prisma` - Added OTP fields
2. `app/routes/auth.login.tsx` - Complete rewrite for OTP flow
3. `app/routes/auth.verify.tsx` - Updated for OTP verification

### Removed Functionality
- Magic link generation and verification (replaced by OTP)
- Email magic link service (replaced by OTP email)

## Notes

- The old magic link infrastructure (EmailChallenge table) is reused for OTP
- `tokenHash` field still exists but now stores a dummy value for backwards compatibility
- OTP is stored as SHA-256 hash in the `otp` field
- Rate limiting uses both Redis (for speed) and database (for persistence)
- Development mode works without Loops.so configured (logs to console)
- Google OAuth requires proper redirect URI configuration in Google Cloud Console

## Next Steps

1. Configure environment variables (see `ENV_SETUP.md`)
2. Create Loops.so transactional email template for OTP
3. Set up Google Cloud Console OAuth credentials
4. Run database migration
5. Test both authentication flows
6. Deploy to production
7. Update Loops.so redirect URIs for production domain
