# Quick Start Guide: OTP and Google OAuth Login

## 🚀 Setup (5 minutes)

### 1. Add Environment Variables

Add to your `.env` file:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Loops.so OTP Email
LOOPS_OTP_TRANSACTIONAL_ID=your_loops_transactional_id_here
```

### 2. Run Database Migration

```bash
npx prisma migrate dev --name add_otp_fields
```

### 3. Done! 🎉

The login page is ready to use at `/auth/login`.

---

## 📧 Setting Up Loops.so Email Template

1. Log in to [Loops.so](https://loops.so)
2. Go to **Transactional** → **Create template**
3. Add these variables to your template:
   - `{{otp}}` - The 6-digit code
   - `{{expiryMinutes}}` - Expiry time (usually "10")
   - `{{email}}` - Recipient email

**Example Email Template:**

```
Hi there! 👋

Your verification code is: {{otp}}

This code will expire in {{expiryMinutes}} minutes.

If you didn't request this code, please ignore this email.

---
Paopao Math Class
```

4. Copy the **Transactional ID** to `LOOPS_OTP_TRANSACTIONAL_ID` in your `.env`

---

## 🔐 Setting Up Google OAuth

### Development

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select project → **APIs & Services** → **Credentials**
3. Create **OAuth 2.0 Client ID** (Web application)
4. Add authorized redirect URI:
   ```
   http://localhost:3000/auth/callback/google
   ```
5. Copy **Client ID** and **Client Secret** to `.env`

### Production

Add your production redirect URI:
```
https://yourdomain.com/auth/callback/google
```

---

## 🧪 Testing in Development

### Without Loops.so configured:
- OTP codes will be **printed to the console**
- You can still test the full flow

### With Loops.so configured:
- Real emails will be sent
- Check spam folder if not received

### Testing Google OAuth:
- Works immediately after adding credentials
- Make sure the test email exists in `AppCustomer` table

---

## 🔒 Security Features

✅ Rate limiting: 3 attempts per 15 minutes  
✅ OTP expires in 10 minutes  
✅ Hashed storage (SHA-256)  
✅ One-time use codes  
✅ IP-based tracking  
✅ Purchase verification (must be in AppCustomer table)

---

## 🐛 Troubleshooting

### "此信箱尚未購買課程"
→ Email not found in `AppCustomer` table. They need to purchase first.

### "驗證碼錯誤次數過多"
→ Rate limit hit. Wait 15 minutes or restart server to clear Redis cache in dev.

### "郵件發送失敗"
→ Check `LOOPS_API_KEY` and `LOOPS_OTP_TRANSACTIONAL_ID` are set correctly.

### Google OAuth "invalid_oauth_callback"
→ Redirect URI mismatch. Check Google Console settings match your app URL.

### OTP not received
→ In development without Loops configured, check console logs for OTP code.

---

## 📱 User Experience

### Email + OTP Flow (< 30 seconds)
1. User enters email
2. Receives 6-digit code
3. Enters code (auto-submits)
4. Logged in! ✨

### Google OAuth Flow (< 10 seconds)
1. Click "使用 Google 登入"
2. Authorize on Google
3. Logged in! ✨

---

## 📚 More Information

- **Full setup guide:** `ENV_SETUP.md`
- **Implementation details:** `IMPLEMENTATION_SUMMARY.md`
- **Code files:**
  - OTP service: `app/services/auth/otp.server.ts`
  - Google OAuth: `app/services/auth/google-oauth.server.ts`
  - Login page: `app/routes/auth.login.tsx`

---

## 💡 Tips

- Test both flows before deploying
- OTP codes are case-insensitive (all digits)
- Google OAuth updates customer name automatically
- Rate limits reset after 15 minutes
- OTP emails include expiry time in email
- Both methods verify against the same `AppCustomer` table

---

Need help? Check the error messages in the console logs for detailed debugging info.
