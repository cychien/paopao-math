/**
 * 發送 OTP 郵件 - 使用 Loops transactional email API
 */
export async function sendOTPEmail(
  email: string,
  otp: string,
  expiresAt: Date
): Promise<boolean> {
  try {
    // 檢查必要的環境變數
    const loopsApiKey = process.env.LOOPS_API_KEY;
    const loopsOTPTransactionalId = process.env.LOOPS_OTP_TRANSACTIONAL_ID;

    if (!loopsApiKey || !loopsOTPTransactionalId) {
      console.error("Missing required Loops environment variables for OTP");
      // In development, log the OTP to console
      if (process.env.NODE_ENV !== "production") {
        console.log("\n🔐 OTP Email - Development Mode:");
        console.log("==========================================");
        console.log(`To: ${email}`);
        console.log(`OTP: ${otp}`);
        console.log(`Expires: ${expiresAt.toISOString()}`);
        console.log("==========================================\n");
        return true; // Allow development without Loops configured
      }
      return false;
    }

    const expiryMinutes = Math.ceil((expiresAt.getTime() - Date.now()) / 60000);

    // 發送 Loops transactional email
    const response = await fetch("https://app.loops.so/api/v1/transactional", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${loopsApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transactionalId: loopsOTPTransactionalId,
        email: email,
        addToAudience: false, // OTP 是 transactional，不需要加入 audience
        dataVariables: {
          email: email,
          code: otp, // Loops template expects 'code' variable
          expiryMinutes: expiryMinutes.toString(),
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
      console.log(`✅ OTP 郵件成功發送到 ${email}`);
      return true;
    } else {
      console.error("Loops API 回應錯誤:", result);
      return false;
    }
  } catch (error) {
    console.error("發送 OTP 郵件失敗:", error);
    return false;
  }
}

/**
 * 驗證 OTP 郵件服務配置
 */
export function validateOTPEmailConfig(): boolean {
  // 檢查必要的環境變數
  const requiredVars = [
    "APP_URL",
    "LOOPS_API_KEY",
    "LOOPS_OTP_TRANSACTIONAL_ID",
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
