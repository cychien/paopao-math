import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { BigFeatures } from "./BigFeatures";

function HeroSection() {
  return (
    <section className="container mx-auto pt-16 pb-16 lg:pt-24 lg:pb-32 flex lg:space-x-12">
      <div className="w-[768px]">
        <h1 className="text-primary font-bold text-4xl leading-[44px] lg:text-6xl lg:leading-[72px] tracking-[-1.2px]">
          <div className="hidden lg:block">
            <div className="mb-5">一堂課</div>
            帶你完整複習高中數學
          </div>
          <span className="lg:hidden">一堂課，帶你完整複習高中數學</span>
        </h1>
        <p className="text-text-tertiary text-xl leading-[31px] mt-6">
          多年暢銷參考書作者親自編授，濃縮高中三年數學精華，最快速有效的總複習課程
        </p>

        <div className="lg:hidden mt-8">
          <BigFeatures />
        </div>

        <div className="mt-8 lg:mt-12">
          <div className="flex lg:space-x-4">
            <Input placeholder="你的 email" className="lg:max-w-[360px]" />
            <Button className="hidden lg:block">搶先卡位</Button>
          </div>
          <div className="mt-1.5 text-sm text-text-tertiary">
            加入預售名單，享早鳥優惠價，開課立刻通知你
          </div>
          <Button className="block lg:hidden mt-4 w-full py-3">搶先卡位</Button>
        </div>
      </div>
      <div className="hidden xl:block flex-1 self-end pb-6">
        <BigFeatures />
      </div>
    </section>
  );
}

export { HeroSection };
