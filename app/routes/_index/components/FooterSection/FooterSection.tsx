import logoSrc from "~/assets/logo.svg";

function FooterSection() {
  return (
    <section className="pt-16 pb-12">
      <div className="container mx-auto flex flex-col items-center">
        <img src={logoSrc} alt="Logo" className="w-12" />
        <p className="text-3xl font-semibold mt-7">數學考試交給寶哥</p>
        <p className="mt-4 text-text-tertiary text-xl">
          超過 100 位高中生已報名，一起衝刺高分！
        </p>

        <div className="h-px mt-16 mb-8 bg-border-secondary w-full" />

        <p className="text-text-quaternary font-inter">
          © 2025 寶哥高中數學. All rights reserved.
        </p>
      </div>
    </section>
  );
}

export { FooterSection };
