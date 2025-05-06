import { BigFeatures } from "./BigFeatures";
import { useFlash } from "~/context/flash-context";
import { cn } from "~/utils/style";
import { FormField } from "~/components/ui/form-field/form-field";
import { Form, useActionData } from "@remix-run/react";
import { conform, useForm } from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { CreateContactActionType, EmailFormSchema } from "../../route";
import { useIsPending } from "~/utils/misc";
import { StatusButton } from "~/components/ui/status-button";

function HeroSection() {
  const actionData = useActionData<CreateContactActionType>();
  const isPending = useIsPending();
  const isSuccess = actionData?.status === "success";

  const { isHighlighted, targetRef } = useFlash();
  const [form, fields] = useForm({
    id: "email-form",
    constraint: getFieldsetConstraint(EmailFormSchema),
    lastSubmission: actionData?.submission,
    onValidate({ formData }) {
      return parse(formData, { schema: EmailFormSchema });
    },
  });

  return (
    <section className="container mx-auto pt-16 pb-16 lg:pt-24 lg:pb-32 lg:flex items-end lg:space-x-8">
      <div className="flex-1">
        <h1 className="text-primary font-bold text-4xl leading-[44px] lg:text-6xl lg:leading-[72px] tracking-[-1.2px]">
          <div className="hidden lg:block tracking-[1.2px]">
            <div className="mb-5">一堂課</div>
            帶你迎戰學測數學
          </div>
          <span className="lg:hidden">一堂課，帶你迎戰學測數學</span>
        </h1>
        <p className="text-text-tertiary text-xl leading-[31px] mt-6">
          多年暢銷參考書作者親自編授，助你勇奪高分的總複習課程
        </p>

        <div className="mt-8 lg:mt-12">
          <BigFeatures />
        </div>
      </div>

      <div
        ref={targetRef}
        className={cn(
          "mt-8 p-6 md:p-10 lg:px-10 lg:pt-8 lg:pb-7 rounded-[10px] transition-colors duration-500 ease-in-out",
          isHighlighted ? "bg-brand-100" : "bg-brand-50"
        )}
      >
        {isSuccess ? (
          <div className="lg:w-[300px] xl:w-[400px] space-y-3">
            <p className="font-medium">🎉 感謝你的訂閱！</p>
            <p className="text-gray-700">
              我們已成功收到你的 Email，非常高興你對本課程感興趣。
              之後，我們會寄送開課通知和相關總複習資料，請放心，我們不會發送任何垃圾郵件。
            </p>
          </div>
        ) : (
          <>
            <div>
              <div className="text-sm font-semibold text-gray-500">
                留下你的 Email，搶先拿到
              </div>
              <div className="text-lg font-semibold mt-0.5">
                早鳥價連結 + 定期總複習練習題
              </div>
            </div>

            <Form method="POST" className="mt-6" {...form.props}>
              <div className="space-y-3">
                <FormField
                  labelProps={{ children: "Email *" }}
                  inputProps={{
                    ...conform.input(fields.email),
                    placeholder: "abc@gmail.com",
                  }}
                  errors={fields.email.errors}
                  className="grid gap-1.5 lg:w-[300px] xl:w-[400px]"
                />
                <FormField
                  labelProps={{ children: "就讀學校 *" }}
                  inputProps={{
                    ...conform.input(fields.schoolName),
                    placeholder: "高雄市三民高中",
                  }}
                  errors={fields.schoolName.errors}
                  className="grid gap-1.5 lg:w-[300px] xl:w-[400px]"
                />
              </div>

              <StatusButton
                type="submit"
                status={
                  isPending
                    ? "pending"
                    : (actionData?.status as "success" | "error") ?? "idle"
                }
                disabled={isPending}
                className="mt-4 w-full lg:mt-6 lg:w-auto"
              >
                搶先卡位
              </StatusButton>
            </Form>
          </>
        )}
      </div>
    </section>
  );
}

export { HeroSection };
