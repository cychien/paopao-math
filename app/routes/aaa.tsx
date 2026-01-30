import { redirect, data } from "react-router";
import type { Route } from "./+types/_index.route";
import {
  HeroSection,
  SocialProofSection,
  FeaturesSection,
  TeacherSection,
  PricingSection,
  CallToActionSection,
  FooterSection,
} from "./_index/components/index.new";
import { parse } from "@conform-to/zod";
import { EmailSchema, SchoolNameSchema } from "~/utils/validation";
import { z } from "zod";
import { createContact } from "~/services/loop";
import { checkHoneypot } from "~/utils/honeypot.server";
import { checkIsCustomer } from "~/services/customer-session.server";

// Default app slug for single-tenant mode
const DEFAULT_APP_SLUG = "paopao-math";

export function meta() {
  return [
    { title: "寶哥高中數學 - 30 年教學精華，學測數學一次搞定" },
    {
      name: "description",
      content:
        "多年暢銷參考書作者親授，200+ 觀念精講影片，系統化重點統整，助你在最短時間內突破學測難關。早鳥優惠 NT$4,995，平均提升 4.2 級分。",
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
    <div className="overflow-hidden">
      <HeroSection />
      <SocialProofSection />
      <FeaturesSection />
      <TeacherSection />
      <PricingSection />
      <CallToActionSection />
      <FooterSection />
    </div>
  );
}
