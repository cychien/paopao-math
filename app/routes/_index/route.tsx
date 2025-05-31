import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
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
import { getOptionalUser } from "~/services/auth/session";
import { AuroraBackground } from "~/components/aurora-background";

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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // 檢查用戶是否已登入並有課程訪問權限
  const user = await getOptionalUser(request);

  if (
    user?.purchases.some(
      (purchase) => purchase.status === "ACTIVE" && purchase.hasLifetimeAccess
    )
  ) {
    throw redirect("/course/overview");
  }

  return json({
    user: user
      ? {
          id: user.id,
          email: user.email,
          name: user.name,
          hasCourseAccess: user.purchases.some(
            (purchase) =>
              purchase.status === "ACTIVE" && purchase.hasLifetimeAccess
          ),
        }
      : null,
  });
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
      <AuroraBackground className="isolate w-full -mt-[73px] pt-[73px]">
        <div className="w-full z-10">
          <HeroSection />
        </div>
      </AuroraBackground>
      <FeaturesSection />
      <TeacherSection />
      <PricingSection />
      <CallToActionSection />
      <FooterSection />
    </>
  );
}
