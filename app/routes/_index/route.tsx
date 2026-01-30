import { redirect, data } from "react-router";
import type { Route } from "./+types/_index.route";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { TeacherSection } from "./components/TeacherSection";
import { PricingSection } from "./components/PricingSection";
import { CallToActionSection } from "./components/CallToActionSection";
import { FooterSection } from "./components/FooterSection";
import { parse } from "@conform-to/zod";
import { EmailSchema, SchoolNameSchema } from "~/utils/validation";
import { z } from "zod";
import { createContact } from "~/services/loop";
import { checkHoneypot } from "~/utils/honeypot.server";
// import { AuroraBackground } from "~/components/aurora-background";
import { checkIsCustomer } from "~/services/customer-session.server";

// Default app slug for single-tenant mode
const DEFAULT_APP_SLUG = "paopao-math";

export function meta() {
  return [
    { title: "寶哥高中數學" },
    {
      name: "description",
      content:
        "一堂課帶你高效總複習高一 ～ 高三數學，200+ 精講影片、系統化重點筆記與持續更新題庫，買斷全年內容，多裝置離線學習，助你快速提分。",
    },
  ];
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  // 檢查用戶是否已是客戶
  const isCustomer = await checkIsCustomer({
    slug: DEFAULT_APP_SLUG,
    request,
  });

  if (isCustomer) {
    throw redirect("/course/overview");
  }

  return data({
    isCustomer,
  });
};

export const EmailFormSchema = z.object({
  email: EmailSchema,
  schoolName: SchoolNameSchema,
});

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  await checkHoneypot(formData);
  const submission = await parse(formData, { schema: EmailFormSchema });

  if (Object.keys(submission.error).length > 0) {
    return data({ status: "error", submission } as const, {
      status: 400,
    });
  }

  const result = await createContact({
    email: submission.value!.email,
    schoolName: submission.value!.schoolName,
    subscribed: true,
  });

  if (!result.success) {
    return data({ status: "error", submission } as const, {
      status: 500,
    });
  }

  return data({ status: "success", submission });
}

export type CreateContactActionType = typeof action;

export default function Index() {
  return (
    <>
      {/* <AuroraBackground className="isolate w-full -mt-[73px] pt-[73px]"> */}
      <div className="w-full z-10">
        <HeroSection />
      </div>
      {/* </AuroraBackground> */}
      <FeaturesSection />
      <TeacherSection />
      <PricingSection />
      <CallToActionSection />
      <FooterSection />
    </>
  );
}
