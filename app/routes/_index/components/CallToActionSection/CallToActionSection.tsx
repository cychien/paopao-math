import { Button } from "~/components/ui/Button";
import { useFlash } from "~/context/flash-context";

function CallToActionSection() {
  const { flash, targetRef } = useFlash();

  const handleClick = () => {
    if (!targetRef.current) return;

    // 1️⃣ 監聽目標進入視窗
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => flash(), 120); // 2️⃣ 進入視窗 → 閃一下
          io.disconnect(); // 只做一次就好
        }
      },
      { threshold: 0.6 } // 區塊 60 % 出現在畫面才算可視
    );

    io.observe(targetRef.current);

    // 3️⃣ 平滑捲動到目標
    targetRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center", // 視窗置中，可按需求改 'nearest'
    });
  };

  return (
    <section className="bg-bg-brand-section py-24">
      <div className="container mx-auto flex flex-col lg:items-center">
        <h3 className="font-semibold text-text-primary-on-brand text-4xl leading-[44px]">
          加入預售名單，鎖定早鳥優惠
        </h3>
        <p className="mt-5 text-xl text-text-tertiary-on-brand">
          搶先享早鳥價，並獲取定期總複習練習題，讓你穩握學習主動權！
        </p>
        <div className="mt-8">
          <Button
            className="w-full bg-bg-brand-secondary text-text-primary hover:enabled:bg-bg-brand-secondary-hover lg:w-auto"
            onClick={handleClick}
          >
            搶先卡位
          </Button>
        </div>
      </div>
    </section>
  );
}

export { CallToActionSection };
