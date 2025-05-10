import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { ActionFunctionArgs } from "@remix-run/node";
import { Form, json, redirect, useActionData } from "@remix-run/react";
import { z } from "zod";
import { FormField } from "~/components/ui/form-field/form-field";
import { StatusButton } from "~/components/ui/status-button";
import { TempPasswordSchema } from "~/utils/validation";
import { TEMP_PASSWORD } from "./constants";
import { sessionStorage } from "~/utils/session.server";
import { safeRedirect } from "remix-utils/safe-redirect";
import { useIsPending } from "~/utils/misc";

const PasswordFormSchema = z.object({
  password: TempPasswordSchema,
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = await parse(formData, {
    schema: PasswordFormSchema.transform((data, ctx) => {
      if (data.password !== TEMP_PASSWORD) {
        ctx.addIssue({
          path: ["password"],
          code: z.ZodIssueCode.custom,
          message: "密碼錯誤",
        });
        return z.NEVER;
      }

      return data;
    }),
  });

  if (Object.keys(submission.error).length > 0) {
    return json({ status: "error", submission } as const, {
      status: 400,
    });
  }

  const cookieSession = await sessionStorage.getSession(
    request.headers.get("cookie")
  );

  cookieSession.set("granted", true);

  return redirect(safeRedirect("/course"), {
    headers: {
      "set-cookie": await sessionStorage.commitSession(cookieSession),
    },
  });
}

export default function Page() {
  const actionData = useActionData<typeof action>();
  const isPending = useIsPending();

  const [form, fields] = useForm({
    id: "password-form",
    constraint: getFieldsetConstraint(PasswordFormSchema),
    lastSubmission: actionData?.submission,
    onValidate({ formData }) {
      return parse(formData, { schema: PasswordFormSchema });
    },
  });

  return (
    <div className="bg-gray-50 h-full">
      <section className="container mx-auto flex justify-center items-center h-full">
        <div className="w-full p-6 sm:w-[480px] lg:py-8 lg:px-6 border border-brand-100 bg-brand-50 rounded-lg">
          <h1 className="text-2xl font-semibold">登入</h1>

          <p className="mt-4 text-gray-500">請輸入密碼以登入</p>

          <Form method="POST" className="mt-8" {...form.props}>
            <FormField
              labelProps={{ children: "密碼 *" }}
              inputProps={{
                ...conform.input(fields.password),
                type: "password",
                autoFocus: true,
                className: "font-inter",
              }}
              errors={fields.password.errors}
              className="grid gap-1.5 w-full"
            />

            <StatusButton
              type="submit"
              status={
                isPending
                  ? "pending"
                  : (actionData?.status as "success" | "error") ?? "idle"
              }
              disabled={isPending}
              className="mt-4 w-full"
            >
              登入
            </StatusButton>
          </Form>
        </div>
      </section>
    </div>
  );
}
