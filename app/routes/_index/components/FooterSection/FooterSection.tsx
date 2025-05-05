import logoSrc from "~/assets/logo.png";

function FooterSection() {
  return (
    <section className="pt-16 pb-12">
      <div className="container mx-auto flex flex-col items-center">
        <img src={logoSrc} alt="Logo" className="w-12" />
        <p className="text-2xl lg:text-3xl font-semibold mt-7">
          數學考試交給寶哥
        </p>
        <p className="mt-4 text-text-tertiary text-lg lg:text-xl">
          加入預售行列，開啟你的高分之路！
        </p>

        <div className="h-px mt-16 mb-8 bg-border-secondary w-full" />

        <p className="text-text-quaternary font-inter text-center">
          © 2025 寶哥高中數學. All rights reserved.
        </p>
      </div>
    </section>
  );
}

export { FooterSection };
