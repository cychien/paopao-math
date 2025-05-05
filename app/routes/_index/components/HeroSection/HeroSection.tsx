import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { BigFeatures } from "./BigFeatures";
import { useFlash } from "~/context/flash-context";
import { cn } from "~/utils/style";

function HeroSection() {
  const { isHighlighted, targetRef } = useFlash();

  return (
    <section className="container mx-auto pt-16 pb-16 lg:pt-24 lg:pb-32 lg:flex items-end lg:space-x-8">
      <div className="flex-1">
        <h1 className="text-primary font-bold text-4xl leading-[44px] lg:text-6xl lg:leading-[72px] tracking-[-1.2px]">
          <div className="hidden lg:block tracking-[1.2px]">
            <div className="mb-5">一堂課</div>
            帶你迎戰學測數學
          </div>
          <span className="lg:hidden">一堂課，帶你完整複習高中數學</span>
        </h1>
        <p className="text-text-tertiary text-xl leading-[31px] mt-6">
          多年暢銷參考書作者親自編授，助你勇奪高分的總複習課程
        </p>

        <div className="mt-8 lg:mt-12">
          <BigFeatures />
        </div>
      </div>

      <div
        ref={targetRef}
        className={cn(
          "mt-8 p-6 md:p-10 lg:px-10 lg:pt-8 lg:pb-7 rounded-[10px] transition-colors duration-500 ease-in-out",
          isHighlighted ? "bg-brand-100" : "bg-brand-50"
        )}
      >
        <div>
          <div className="text-sm font-semibold text-gray-500">
            留下你的 Email，搶先拿到
          </div>
          <div className="text-lg font-semibold mt-0.5">
            早鳥價連結 + 定期總複習練習題
          </div>
        </div>

        <form className="mt-6">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <div className="text-sm text-gray-700 font-medium">Email *</div>
              <Input
                placeholder="abc@gmail.com"
                className="lg:w-[300px] xl:w-[400px]"
              />
            </div>
            <div className="space-y-1.5">
              <div className="text-sm text-gray-700 font-medium">
                就讀學校 *
              </div>
              <Input
                placeholder="高雄市三民高中"
                className="lg:w-[300px] xl:w-[400px]"
              />
            </div>
          </div>

          <Button className="mt-4 w-full lg:mt-6 lg:w-auto">搶先卡位</Button>
        </form>

        {/* <div className="flex lg:space-x-4">
          <Input placeholder="你的 email" className="lg:max-w-[360px]" />
        </div>
        <div className="mt-1.5 text-sm text-text-tertiary">
          加入預售名單，享早鳥優惠價，開課立刻通知你
        </div>
        <Button className="block lg:hidden mt-4 w-full py-3">搶先卡位</Button> */}
      </div>
    </section>
  );
}

export { HeroSection };
