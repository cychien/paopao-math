import type { Route } from "./+types/login";
import { z } from "zod";
import { data, Form, useActionData, useNavigation, redirect } from "react-router";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Label } from "~/components/ui/label";
import { Loader2 } from "lucide-react";
import { prisma } from "~/services/database/prisma.server";
import { randomBytes, createHash as createHashCrypto } from "node:crypto";
import { getCustomerSession } from "~/services/customer-session.server";

const emailSchema = z
  .string("Email 不可為空")
  .trim()
  .min(1, "Email 不可為空")
  .email("Email 格式錯誤");

const loginFormSchema = z.object({
  email: emailSchema,
});

const MAX_EMAIL_PER_MINUTE = 5;
const CHALLENGE_TTL_MIN = 10;
const DEFAULT_APP_SLUG = "paopao-math";

function createHash(input: string) {
  return createHashCrypto("sha256").update(input).digest("base64url");
}

function nowPlus(minutes: number) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

export const handle = { pageId: "login" };

export function meta({ }: Route.MetaArgs) {
  return [{ title: "登入" }, { name: "description", content: "登入您的帳號" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  // Check if already logged in
  const { customerId } = await getCustomerSession(request);
  if (customerId) {
    return redirect("/learn");
  }
  return data({});
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");

  const result = loginFormSchema.safeParse({ email });

  if (!result.success) {
    const errors = result.error.flatten();
    return data(
      {
        status: "error" as const,
        fieldErrors: errors.fieldErrors as { email?: string[] },
        formErrors: errors.formErrors,
        email: typeof email === "string" ? email : "",
      },
      { status: 400 },
    );
  }

  const { email: validEmail } = result.data;

  // Check if app exists
  const app = await prisma.app.findUnique({
    where: { slug: DEFAULT_APP_SLUG },
    select: { id: true },
  });

  if (!app) {
    return data(
      {
        status: "error" as const,
        fieldErrors: { email: ["此課程不存在"] } as { email?: string[] },
        formErrors: [] as string[],
        email: validEmail,
      },
      { status: 400 },
    );
  }

  // Check if email exists in AppCustomer
  const customer = await prisma.appCustomer.findFirst({
    where: {
      appId: app.id,
      email: validEmail,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!customer) {
    return data(
      {
        status: "error" as const,
        fieldErrors: { email: ["此 Email 尚未購買此課程"] } as {
          email?: string[];
        },
        formErrors: [] as string[],
        email: validEmail,
      },
      { status: 400 },
    );
  }

  // Rate limiting: check recent email challenges
  const oneMinAgo = new Date(Date.now() - 60 * 1000);
  const recent = await prisma.emailChallenge.count({
    where: { email: validEmail, issuedAt: { gt: oneMinAgo } },
  });

  if (recent >= MAX_EMAIL_PER_MINUTE) {
    return data(
      {
        status: "error" as const,
        fieldErrors: {} as { email?: string[] },
        formErrors: ["登入過於頻繁，請稍後再試"],
        email: validEmail,
      },
      { status: 429 },
    );
  }

  // Create email challenge for customer login
  const token = randomBytes(32).toString("base64url");
  const tokenHash = createHash(token);
  const challenge = await prisma.emailChallenge.create({
    data: {
      email: validEmail,
      tokenHash,
      issuedAt: new Date(),
      expiresAt: nowPlus(CHALLENGE_TTL_MIN),
      status: "PENDING",
      appId: app.id,
    },
  });

  // Build magic link
  const url = new URL(request.url);
  const protocol =
    request.headers.get("x-forwarded-proto") || url.protocol.replace(":", "");
  const magicLink = `${protocol}://${url.host}/auth/verify?c=${challenge.id}&t=${token}`;

  // Send login verification email
  await sendLoginVerification({
    email: validEmail,
    username: customer.name ?? "",
    magicLink,
  });

  return data({
    status: "success" as const,
    email: validEmail,
  });
}

async function sendLoginVerification({
  email,
  username,
  magicLink,
}: {
  email: string;
  username: string;
  magicLink: string;
}) {
  const LOGIN_EMAIL_VERIFICATION_TEMPLATE_ID = "cmeld8mbi06r8360ic11c53zh";

  return await fetch("https://app.loops.so/api/v1/transactional", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
    },
    body: JSON.stringify({
      transactionalId: LOGIN_EMAIL_VERIFICATION_TEMPLATE_ID,
      email,
      dataVariables: {
        username,
        magic_link: magicLink,
      },
    }),
  })
    .then((res) => res.json())
    .then(() => {
      return { success: true };
    })
    .catch((error) => {
      throw new Error(error.message);
    });
}

export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  const screen = actionData?.status === "success" ? "challenge-sent" : "login";

  return (
    <div className="flex flex-1 justify-center max-md:mt-12 md:items-center">
      <div className="flex w-full max-w-sm flex-col items-center px-6">
        {screen === "challenge-sent" && (
          <>
            <h1 className="text-2xl font-semibold">驗證信已寄出！</h1>
            <p className="mt-3 text-center text-sm text-gray-600">
              請到{" "}
              <em className="leading-loose font-medium text-gray-950">
                {actionData?.email}
              </em>{" "}
              收信，並打開信中連結以登入
            </p>
          </>
        )}

        {screen === "login" && (
          <>
            <h1 className="text-2xl font-semibold">登入</h1>

            <div className="mt-8 w-full">
              <Form method="post" className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="輸入 Email"
                    className="h-10"
                    defaultValue={actionData?.email ?? ""}
                    aria-invalid={
                      actionData?.status === "error" &&
                        actionData.fieldErrors?.email
                        ? true
                        : undefined
                    }
                  />
                  {actionData?.status === "error" &&
                    actionData.fieldErrors?.email && (
                      <p className="text-sm text-red-500">
                        {actionData.fieldErrors.email[0]}
                      </p>
                    )}
                </div>

                {actionData?.status === "error" &&
                  actionData.formErrors.length > 0 && (
                    <ul className="list-inside list-disc rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                      {actionData.formErrors.map((error) => (
                        <li key={error}>
                          <span className="relative -left-[4px]">{error}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                <Button
                  type="submit"
                  className="h-10 w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                  使用 Email 登入
                </Button>
              </Form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
