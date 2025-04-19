import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";

function CallToActionSection() {
  return (
    <section className="bg-bg-brand-section py-24">
      <div className="container mx-auto flex flex-col lg:items-center">
        <h3 className="font-semibold text-text-primary-on-brand text-4xl leading-[44px]">
          加入預售名單，鎖定早鳥優惠
        </h3>
        <p className="mt-5 text-xl text-text-tertiary-on-brand">
          搶先享早鳥價，並不定期寄送重點導讀、練習題與考試秘笈，讓你穩握學習主動權！
        </p>
        <div className="mt-8">
          <div className="lg:flex lg:space-x-4">
            <Input placeholder="你的 email" className="w-full lg:w-[360px]" />
            <Button className="hidden lg:inline-block bg-bg-brand-secondary text-text-primary hover:enabled:bg-bg-brand-secondary-hover">
              搶先卡位
            </Button>
          </div>
          <div className="mt-1.5 text-sm text-text-tertiary-on-brand">
            加入預售名單，享早鳥優惠價，開課立刻通知你
          </div>
          <Button className="lg:hidden mt-4 w-full bg-bg-brand-secondary text-text-primary hover:enabled:bg-bg-brand-secondary-hover">
            搶先卡位
          </Button>
        </div>
      </div>
    </section>
  );
}

export { CallToActionSection };
