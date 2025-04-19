import featureIconSrc from "~/assets/featured.svg";

function FeaturesSection() {
  return (
    <section className="bg-bg-secondary py-16 lg:py-24">
      <div className="container mx-auto lg:flex lg:space-x-16">
        <div className="lg:w-[360px]">
          <img src={featureIconSrc} alt="Icon" className="size-14" />
          <h2 className="text-3xl lg:text-4xl leading-[38px] font-semibold lg:leading-[52px] mt-5">
            你唯一需要的
            <br className="hidden lg:inline" />
            總複習教材
          </h2>
          <p className="mt-4 lg:mt-5 text-lg lg:text-xl lg:leading-[30px] text-text-tertiary">
            用最少花費，換取最大收穫，在最短時間迅速提升數學實力，輕鬆邁向夢想學校
          </p>
        </div>
        <div className="mt-12 lg:mt-0 flex-1 grid gap-y-10 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-8">
          <div className="space-y-1">
            <div className="font-semibold text-lg leading-[28px]">
              重點觀念 + 秒懂例題
            </div>
            <div className="text-text-tertiary">
              必考觀念全面統整，高頻題型逐步拆解，迅速掌握核心解題思路與應試技巧
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-semibold text-lg leading-[28px]">
              文字搭配影片，難點秒解
            </div>
            <div className="text-text-tertiary">
              先掃條列重點，不懂即點短片深入，影片輔助難點馬上秒解，徹底避免卡關
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-semibold text-lg leading-[28px]">
              200+ 精講影片庫
            </div>
            <div className="text-text-tertiary">
              兩百餘支短片逐題解析，倍速播放與索引搜尋，隨時回放強化觀念，深度理解
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-semibold text-lg leading-[28px]">
              題庫持續更新
            </div>
            <div className="text-text-tertiary">
              每月新增最新試題與練習卷，附詳解與步驟，演練永遠同步考情，隨時挑戰
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-semibold text-lg leading-[28px]">
              隨時隨地自主學習
            </div>
            <div className="text-text-tertiary">
              全裝置離線支援，自訂進度，零碎時間也能高效複習，隨走隨看，不浪費任何時間
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-semibold text-lg leading-[28px]">
              名師親授，權威可靠
            </div>
            <div className="text-text-tertiary">
              暢銷參考書作者授課，精準掌握命題趨勢，考點命中率高，雙重保障成績
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { FeaturesSection };
