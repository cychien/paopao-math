import type { ActionFunctionArgs } from "react-router";
import { redirect, Form, Link, useActionData, useNavigation, useSearchParams, useLoaderData } from "react-router";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/Button";
import { getOptionalUser } from "~/services/auth/session";
import Icon from "~/components/ui/icon";
import { CancelCircleIcon, Mail01Icon } from "@hugeicons/core-free-icons";
import { InputGroup, InputGroupAddon, InputGroupInput } from "~/components/ui/input-group";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "~/components/ui/input-otp";
import { createOTPChallenge } from "~/services/auth/otp.server";
import { sendOTPEmail } from "~/services/email/otp-email";
import { getOriginUrl } from "~/utils/misc";

// Social Icons
const GoogleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <title>Google</title>
    <path
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
      fill="currentColor"
    />
  </svg>
);

type ActionData =
  | { error: string; success: false }
  | { success: true; message: string; challengeId: string; email: string };

export const loader = async ({ request }: { request: Request }) => {
  // 檢查用戶是否已登入並有課程訪問權限
  const user = await getOptionalUser(request);

  if (
    user?.purchases.some(
      (purchase) => purchase.status === "ACTIVE" && purchase.hasLifetimeAccess
    )
  ) {
    throw redirect("/learn");
  }

  // Build Google OAuth URL for client
  // Use getOriginUrl to ensure correct protocol (https) in production
  const origin = getOriginUrl(request);
  const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
  const redirectUri = `${origin}/auth/callback/google`;

  return { googleClientId, redirectUri };
};

export const action = async ({
  request,
}: ActionFunctionArgs): Promise<Response> => {
  try {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();

    // 驗證 email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return Response.json(
        { error: "請輸入有效的電子郵件地址", success: false } as const,
        { status: 400 }
      );
    }

    // 獲取客戶端 IP 和 User Agent
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    try {
      // 生成 OTP 並創建 challenge
      const { challengeId, otp, expiresAt } = await createOTPChallenge(email, ipAddress);

      // 發送 OTP 郵件
      const emailSent = await sendOTPEmail(email, otp, expiresAt);

      if (!emailSent) {
        return Response.json(
          { error: "郵件發送失敗，請稍後再試", success: false } as const,
          { status: 500 }
        );
      }

      return Response.json({
        success: true,
        message: `驗證碼已發送到 ${email}，請檢查您的信箱`,
        challengeId,
        email,
      } as const);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "系統錯誤";
      return Response.json(
        { error: errorMessage, success: false } as const,
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("登入處理失敗:", error);
    return Response.json(
      { error: "系統錯誤，請稍後再試", success: false } as const,
      {
        status: 500,
      }
    );
  }
};

export default function LoginPage() {
  const actionData = useActionData<ActionData>();
  const loaderData = useLoaderData<{ googleClientId: string; redirectUri: string }>();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();

  // Get error from URL params (from verify redirect)
  const urlError = searchParams.get("error");
  const urlChallengeId = searchParams.get("c");
  const redirectTo = searchParams.get("redirectTo");
  // const urlEmail = searchParams.get("email");

  // Initialize state based on URL params to avoid flash
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTPInput, setShowOTPInput] = useState(!!urlChallengeId);
  const [challengeId, setChallengeId] = useState(urlChallengeId || "");
  const isSubmitting = navigation.state === "submitting";

  // Map error codes to user-friendly messages
  const getErrorMessage = (error: string) => {
    const errorMessages: Record<string, string> = {
      no_purchase: "此信箱尚未購買課程。請先購買課程後再登入。",
      invalid_otp: "驗證碼錯誤或已過期，請重新輸入",
      expired: "驗證碼已過期，請重新發送",
    };
    return errorMessages[error] || decodeURIComponent(error);
  };

  // Handle action data changes
  useEffect(() => {
    if (actionData?.success) {
      setShowOTPInput(true);
      setChallengeId(actionData.challengeId);
      setEmail(actionData.email);
    }
  }, [actionData]);

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (otp.length === 6 && challengeId) {
      // Redirect to verify with OTP and preserve redirectTo
      const params = new URLSearchParams({
        c: challengeId,
        otp: otp,
      });
      if (redirectTo) {
        params.set("redirectTo", redirectTo);
      }
      const verifyUrl = `/auth/verify?${params.toString()}`;
      window.location.href = verifyUrl;
    }
  }, [otp, challengeId, redirectTo]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value.trim());
  };

  const handleEmailPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    setTimeout(() => {
      const target = e.target as HTMLInputElement;
      setEmail(target.value.trim());
    }, 10);
  };

  const handleGoogleLogin = () => {
    if (!loaderData.googleClientId) {
      console.error("Google OAuth not configured");
      return;
    }

    const params = new URLSearchParams({
      client_id: loaderData.googleClientId,
      redirect_uri: loaderData.redirectUri,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    window.location.href = authUrl;
  };

  const handleResend = () => {
    setShowOTPInput(false);
    setOtp("");
    setChallengeId("");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans selection:bg-brand-100 selection:text-brand-900">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-10 w-24 h-24 border-2 border-dashed border-gray-200 rounded-full hidden lg:block animate-[pulse_3s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-10 w-16 h-16 bg-brand-100/40 rounded-lg transform rotate-12 hidden lg:block" />

        {/* Login Card */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200 relative z-10">
          <div className="flex flex-col items-center text-center space-y-3 mb-8">
            <h1 className="text-3xl font-bold tracking-tight">學員登入</h1>
            <p className="text-gray-500 text-sm max-w-[280px] mt-0.5">
              {showOTPInput
                ? "請輸入寄送到您信箱的 6 位數驗證碼"
                : "請輸入您的購買信箱，我們將發送驗證碼給您"}
            </p>
          </div>

          {showOTPInput ? (
            // Step 2: OTP Input
            <div className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  disabled={isSubmitting}
                  containerClassName="w-full"
                >
                  <InputOTPGroup className="h-12 w-full!">
                    <InputOTPSlot index={0} className='h-12 w-full!' />
                    <InputOTPSlot index={1} className='h-12 w-full!' />
                    <InputOTPSlot index={2} className='h-12 w-full!' />
                    <InputOTPSlot index={3} className='h-12 w-full!' />
                    <InputOTPSlot index={4} className='h-12 w-full!' />
                    <InputOTPSlot index={5} className='h-12 w-full!' />
                  </InputOTPGroup>
                </InputOTP>

                {urlError && (
                  <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-sm text-red-600 flex items-center gap-2 w-full">
                    <Icon icon={CancelCircleIcon} className="size-4 shrink-0" />
                    {getErrorMessage(urlError)}
                  </div>
                )}

                <div className="text-center space-y-2 w-full">
                  {/* <p className="text-sm text-gray-500">
                    驗證碼已發送到 <strong>{email}</strong>
                  </p> */}
                  <Button
                    variant="ghost"
                    onClick={handleResend}
                    className="text-brand-600 hover:text-brand-700 text-sm hover:bg-gray-100"
                    type="button"
                  >
                    重新發送驗證碼
                  </Button>
                </div>
              </div>

              <div className="bg-brand-50/50 border border-brand-100 rounded-xl p-4 text-left">
                <div className="flex gap-3">
                  <p className="text-sm text-brand-700">
                    提示：請檢查您的<strong>垃圾郵件</strong>或
                    <strong>促銷內容</strong>資料夾。驗證碼有效期為 10 分鐘。
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Step 1: Email Input
            <>
              {((actionData && !actionData.success) || (urlError && !showOTPInput)) && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-6 text-red-600 flex items-center gap-1">
                  <span className='h-5 self-start flex items-center'><Icon icon={CancelCircleIcon} className="size-4 shrink-0" /></span>
                  <p className="text-sm">
                    {actionData && !actionData.success
                      ? actionData.error
                      : urlError
                        ? getErrorMessage(urlError)
                        : null}
                  </p>
                </div>
              )}
              <Form method="post" className="space-y-4">
                <div className="space-y-1">
                  <InputGroup className="h-12 rounded-lg border border-brand-100 hover:bg-gray-50/50 hover:border-brand-500/30 focus:bg-white">
                    <InputGroupInput
                      id="email"
                      name="email"
                      type="email"
                      placeholder="輸入電子信箱"
                      value={email}
                      onChange={handleEmailChange}
                      onPaste={handleEmailPaste}
                      required
                      disabled={isSubmitting}
                    />
                    <InputGroupAddon align="inline-start">
                      <Icon icon={Mail01Icon} className="size-4.5 translate-y-[0.5px] text-gray-400" />
                    </InputGroupAddon>
                  </InputGroup>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-lg text-base font-medium mt-2 shadow-lg shadow-brand-600/10 bg-primary text-white"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>發送中...</span>
                    </div>
                  ) : (
                    "發送驗證碼"
                  )}
                </Button>
              </Form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-[13px] uppercase">
                  <span className="bg-white px-2 text-gray-400">
                    或使用以下方式登入
                  </span>
                </div>
              </div>

              <div className="grid">
                <Button
                  variant="outline"
                  className="h-12 rounded-xl bg-gray-50! hover:bg-gray-100 border-gray-200 hover:border-gray-300 text-gray-600 gap-3"
                  type="button"
                  onClick={handleGoogleLogin}
                >
                  <GoogleIcon className="size-5" />
                  <span className="font-medium">使用 Google 登入</span>
                </Button>
              </div>

              <div className="mt-8 text-center text-[13px] text-gray-500">
                登入遇到問題？{" "}
                <Link
                  to="/contact"
                  className="font-medium text-brand-600 hover:underline"
                >
                  聯繫客服
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
