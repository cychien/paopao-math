interface EmailTemplate {
  subject: string;
  text: string;
  html: string;
}

/**
 * 生成 Magic Link 郵件模板
 */
export function generateMagicLinkEmail(
  email: string,
  magicLinkUrl: string,
  expiresAt: Date
): EmailTemplate {
  const expiryTime = expiresAt.toLocaleString("zh-TW", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const subject = "🔐 寶哥高中數學 - 登入連結";

  const text = `
親愛的同學，

歡迎使用 寶哥高中數學！

請點擊以下連結登入您的帳戶：
${magicLinkUrl}

此連結將於 ${expiryTime} 到期，請儘快使用。

如果您沒有申請登入連結，請忽略此郵件。

祝您學習愉快！
寶哥高中數學團隊
  `.trim();

  const html = `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>寶哥高中數學 - 登入連結</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 2px solid #f0f0f0;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #2563eb;
    }
    .content {
      padding: 30px 0;
    }
    .button {
      display: inline-block;
      background-color: #2563eb;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
      margin: 20px 0;
    }
    .button:hover {
      background-color: #1d4ed8;
    }
    .expiry {
      background-color: #fef3c7;
      border: 1px solid #f59e0b;
      border-radius: 6px;
      padding: 12px;
      margin: 20px 0;
      font-size: 14px;
    }
    .footer {
      border-top: 1px solid #e5e7eb;
      padding-top: 20px;
      font-size: 14px;
      color: #6b7280;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">🎯 寶哥高中數學</div>
  </div>
  
  <div class="content">
    <h2>🔐 登入連結</h2>
    
    <p>親愛的同學，</p>
    
    <p>歡迎使用 寶哥高中數學！請點擊下方按鈕登入您的帳戶：</p>
    
    <div style="text-align: center;">
      <a href="${magicLinkUrl}" class="button">🚀 立即登入</a>
    </div>
    
    <div class="expiry">
      ⏰ <strong>注意事項：</strong>此連結將於 <strong>${expiryTime}</strong> 到期，請儘快使用。
    </div>
    
    <p>如果您沒有申請登入連結，請忽略此郵件。</p>
    
    <p>如果按鈕無法點擊，請複製以下連結到瀏覽器：</p>
    <p style="word-break: break-all; background-color: #f3f4f6; padding: 8px; border-radius: 4px; font-family: monospace; font-size: 12px;">
      ${magicLinkUrl}
    </p>
  </div>
  
  <div class="footer">
    <p>祝您學習愉快！<br>
    <strong>寶哥高中數學團隊</strong></p>
  </div>
</body>
</html>
  `.trim();

  return { subject, text, html };
}

/**
 * 發送 Magic Link 郵件 (目前僅 console log，可擴展為實際郵件服務)
 */
export async function sendMagicLinkEmail(
  email: string,
  magicLinkUrl: string,
  expiresAt: Date
): Promise<boolean> {
  try {
    const emailTemplate = generateMagicLinkEmail(
      email,
      magicLinkUrl,
      expiresAt
    );

    // 在開發環境中，將郵件內容輸出到 console
    if (process.env.NODE_ENV !== "production") {
      console.log("\n🔥 Magic Link Email Generated:");
      console.log("==========================================");
      console.log(`To: ${email}`);
      console.log(`Subject: ${emailTemplate.subject}`);
      console.log(`Magic Link: ${magicLinkUrl}`);
      console.log(`Expires: ${expiresAt.toISOString()}`);
      console.log("==========================================\n");
    }

    // TODO: 在生產環境中整合實際的郵件服務 (如 Supabase Auth, SendGrid, AWS SES 等)
    if (process.env.NODE_ENV === "production") {
      // 這裡可以整合：
      // 1. Supabase Auth (推薦)
      // 2. SendGrid
      // 3. AWS SES
      // 4. Resend
      // 5. 其他 SMTP 服務

      console.log(`TODO: 實際發送郵件到 ${email}`);
    }

    return true;
  } catch (error) {
    console.error("發送 Magic Link 郵件失敗:", error);
    return false;
  }
}

/**
 * 驗證郵件服務配置
 */
export function validateEmailConfig(): boolean {
  // 檢查必要的環境變數
  const requiredVars = ["APP_URL"];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      console.error(`Missing required environment variable: ${varName}`);
      return false;
    }
  }

  return true;
}

/**
 * 獲取郵件服務狀態
 */
export function getEmailServiceStatus() {
  return {
    configured: validateEmailConfig(),
    provider:
      process.env.NODE_ENV === "production" ? "TODO: Configure" : "Console",
    supportedFeatures: ["magic-link"],
  };
}
