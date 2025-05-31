/**
 * 發送 Magic Link 郵件 - 使用 Loops transactional email API
 */
export async function sendMagicLinkEmail(
  email: string,
  magicLinkUrl: string,
  expiresAt: Date
): Promise<boolean> {
  try {
    // 檢查必要的環境變數
    const loopsApiKey = process.env.LOOPS_API_KEY;
    const loopsTransactionalId = process.env.LOOPS_MAGIC_LINK_TRANSACTIONAL_ID;

    if (!loopsApiKey || !loopsTransactionalId) {
      console.error("Missing required Loops environment variables");
      return false;
    }

    const expiryTime = expiresAt.toLocaleString("zh-TW", {
      timeZone: "Asia/Taipei",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    // 在開發環境中，也將郵件內容輸出到 console
    // if (process.env.NODE_ENV !== "production") {
    //   console.log("\n🔥 Magic Link Email - 準備發送:");
    //   console.log("==========================================");
    //   console.log(`To: ${email}`);
    //   console.log(`Magic Link: ${magicLinkUrl}`);
    //   console.log(`Expires: ${expiresAt.toISOString()}`);
    //   console.log("==========================================\n");
    // }

    // 發送 Loops transactional email
    const response = await fetch("https://app.loops.so/api/v1/transactional", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${loopsApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transactionalId: loopsTransactionalId,
        email: email,
        addToAudience: false, // Magic Link 是 transactional，不需要加入 audience
        dataVariables: {
          email: email,
          magicLinkUrl: magicLinkUrl,
          expiryTime: expiryTime,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Loops API 錯誤:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      return false;
    }

    const result = await response.json();

    if (result.success) {
      console.log(`✅ Magic Link 郵件成功發送到 ${email}`);
      return true;
    } else {
      console.error("Loops API 回應錯誤:", result);
      return false;
    }
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
  const requiredVars = [
    "APP_URL",
    "LOOPS_API_KEY",
    "LOOPS_MAGIC_LINK_TRANSACTIONAL_ID",
  ];

  const missingVars = [];
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    console.error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
    return false;
  }

  return true;
}

/**
 * 獲取郵件服務狀態
 */
export function getEmailServiceStatus() {
  const configured = validateEmailConfig();

  return {
    configured,
    provider: configured ? "Loops" : "Not Configured",
    supportedFeatures: ["magic-link"],
    apiKeyConfigured: !!process.env.LOOPS_API_KEY,
    transactionalIdConfigured: !!process.env.LOOPS_MAGIC_LINK_TRANSACTIONAL_ID,
  };
}

/**
 * 測試 Loops API 連接
 */
export async function testLoopsConnection(): Promise<boolean> {
  try {
    const loopsApiKey = process.env.LOOPS_API_KEY;

    if (!loopsApiKey) {
      console.error("LOOPS_API_KEY not configured");
      return false;
    }

    const response = await fetch("https://app.loops.so/api/v1/api-key", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${loopsApiKey}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        "Loops API 連接失敗:",
        response.status,
        response.statusText
      );
      return false;
    }

    const result = await response.json();

    if (result.success) {
      console.log("✅ Loops API 連接成功");
      return true;
    } else {
      console.error("Loops API 驗證失敗:", result);
      return false;
    }
  } catch (error) {
    console.error("測試 Loops 連接時發生錯誤:", error);
    return false;
  }
}
