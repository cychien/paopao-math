import type { MetaFunction } from "@remix-run/node";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { TeacherSection } from "./components/TeacherSection";
import { PricingSection } from "./components/PricingSection";
import { CallToActionSection } from "./components/CallToActionSection";
import { FooterSection } from "./components/FooterSection";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
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
