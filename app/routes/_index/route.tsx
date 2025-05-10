import {
  json,
  type ActionFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
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

export const meta: MetaFunction = () => {
  return [
    { title: "寶哥高中數學" },
    {
      name: "description",
      content:
        "一堂課帶你高效總複習高一 ～ 高三數學，200+ 精講影片、系統化重點筆記與持續更新題庫，買斷全年內容，多裝置離線學習，助你快速提分。",
    },
  ];
};

export const EmailFormSchema = z.object({
  email: EmailSchema,
  schoolName: SchoolNameSchema,
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  await checkHoneypot(formData);
  const submission = await parse(formData, { schema: EmailFormSchema });

  if (Object.keys(submission.error).length > 0) {
    return json({ status: "error", submission } as const, {
      status: 400,
    });
  }

  const result = await createContact({
    email: submission.value!.email,
    schoolName: submission.value!.schoolName,
    subscribed: true,
  });

  if (!result.success) {
    return json({ status: "error", submission } as const, {
      status: 500,
    });
  }

  return json({ status: "success", submission });
}

export type CreateContactActionType = typeof action;

export default function Index() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <TeacherSection />
      <PricingSection />
      <CallToActionSection />
      <FooterSection />
    </>
  );
}
