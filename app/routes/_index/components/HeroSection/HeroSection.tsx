import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import checkIconSrc from "~/assets/check.svg";

function HeroSection() {
  return (
    <section className="container mx-auto pt-24 pb-32 flex space-x-12">
      <div className="w-[768px]">
        <h1 className="text-primary font-bold text-6xl leading-[72px] tracking-[-1.2px]">
          <div className="mb-5">一堂課</div>
          帶你完整複習高中數學
        </h1>
        <p className="text-text-tertiary text-xl leading-[31px] mt-6">
          多年暢銷參考書作者親自編授，濃縮高中三年數學精華，最快速有效的總複習課程
        </p>

        <div className="mt-12">
          <div className="flex space-x-4">
            <Input placeholder="你的 email" className="w-[360px]" />
            <Button>搶先卡位</Button>
          </div>
          <div className="mt-1.5 text-sm text-text-tertiary">
            加入預售名單，享早鳥優惠價，開課立刻通知你
          </div>
        </div>
      </div>
      <div className="flex-1 self-end space-y-5 pb-6">
        <div className="flex space-x-3 items-center">
          <img
            src={checkIconSrc}
            alt="check icon"
            className="w-8 h-8 flex-shrink-0"
          />
          <span className="text-text-tertiary text-lg">獨家重點整理及例題</span>
        </div>
        <div className="flex space-x-3 items-center">
          <img
            src={checkIconSrc}
            alt="check icon"
            className="w-8 h-8 flex-shrink-0"
          />
          <span className="text-text-tertiary text-lg">
            <span className="font-inter">200+</span> 精講影片，觀念拆解更透徹
          </span>
        </div>
        <div className="flex space-x-3 items-center">
          <img
            src={checkIconSrc}
            alt="check icon"
            className="w-8 h-8 flex-shrink-0"
          />
          <span className="text-text-tertiary text-lg">
            隨時隨地學，自主掌控學習進度
          </span>
        </div>
      </div>
    </section>
  );
}

export { HeroSection };
