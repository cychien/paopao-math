import type { MetaFunction } from "@remix-run/node";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { TeacherSection } from "./components/TeacherSection";
import { PricingSection } from "./components/PricingSection";
import { CallToActionSection } from "./components/CallToActionSection";
import { FooterSection } from "./components/FooterSection";

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
