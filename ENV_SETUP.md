# Environment Variables Configuration

This file documents the environment variables needed for OTP and Google OAuth login features.

## Required Environment Variables

### Google OAuth
```bash
# Google OAuth Client ID (from Google Cloud Console)
GOOGLE_CLIENT_ID=

# Google OAuth Client Secret (from Google Cloud Console)
GOOGLE_CLIENT_SECRET=
```

### Loops.so Email Service
```bash
# Loops.so API Key
LOOPS_API_KEY=

# Loops.so Transactional Email ID for OTP emails
# You need to create a transactional email template in Loops.so with these variables:
# - email: recipient email
# - otp: 6-digit verification code
# - expiryMinutes: expiry time in minutes
LOOPS_OTP_TRANSACTIONAL_ID=
```

### Existing Required Variables
```bash
# Application URL (already configured)
APP_URL=

# Session secret (already configured)
SESSION_SECRET=

# Database URLs (already configured)
DATABASE_URL=
DIRECT_URL=

# Redis for rate limiting (already configured)
REDIS_URL=
```

## Setup Instructions

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: "Web application"
6. Add authorized redirect URIs:
   - Development: `http://localhost:3000/auth/callback/google`
   - Production: `https://your-domain.com/auth/callback/google`
7. Copy the Client ID and Client Secret to your `.env` file

### 2. Loops.so OTP Template Setup

1. Go to [Loops.so](https://loops.so) dashboard
2. Create a new "Transactional Email" template
3. Add the following data variables in the template:
   - `email` - The recipient's email address
   - `otp` - The 6-digit verification code
   - `expiryMinutes` - Expiry time in minutes (e.g., "10")
4. Example email content:
   ```
   您的驗證碼是：{{otp}}
   
   此驗證碼將在 {{expiryMinutes}} 分鐘後過期。
   
   如果您沒有要求此驗證碼，請忽略此郵件。
   ```
5. Copy the Transactional ID to your `.env` file as `LOOPS_OTP_TRANSACTIONAL_ID`
6. Add your Loops API key to `LOOPS_API_KEY`

## Development Mode

In development mode without Loops configured:
- OTP codes will be logged to the console for testing
- The email service will return `true` to allow login flow to proceed

## Database Migration

After adding the environment variables, run the Prisma migration:

```bash
npx prisma migrate dev --name add_otp_fields
```

## Rate Limiting

The OTP verification is protected with rate limiting:
- **Max attempts:** 3 verification attempts
- **Lockout duration:** 15 minutes
- **OTP expiry:** 10 minutes

Rate limiting is handled via Redis cache and persisted in the database.

## Testing

1. Try email login flow with OTP
2. Try Google OAuth login flow
3. Verify rate limiting works after 3 failed attempts
4. Verify OTP expires after 10 minutes
