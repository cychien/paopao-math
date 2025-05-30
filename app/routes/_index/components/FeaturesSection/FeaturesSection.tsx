import featureIconSrc from "~/assets/featured.svg";

function FeaturesSection() {
  return (
    <section className="bg-gray-100 py-16 lg:py-24">
      <div className="container mx-auto lg:flex lg:space-x-16">
        <div className="lg:w-[360px]">
          <img src={featureIconSrc} alt="Icon" className="size-14" />
          <h2 className="text-3xl lg:text-4xl leading-[38px] font-semibold lg:leading-[52px] mt-5">
            你唯一需要的
            <br className="hidden lg:inline" />
            總複習教材
          </h2>
          <p className="mt-4 lg:mt-5 text-lg lg:text-xl lg:leading-[30px] text-text-tertiary">
            用更彈性的時間與更少的費用，搞懂更多觀念，拿到更高分數
          </p>
        </div>
        <div className="mt-12 lg:mt-0 flex-1 grid gap-y-10 lg:grid-rows-3 lg:gap-x-16 lg:gap-y-8 lg:grid-flow-col">
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
              200+ 精講影片
            </div>
            <div className="text-text-tertiary">
              兩百餘支短片逐題解析，倍速播放與索引搜尋，隨時回放強化觀念，深度理解
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-semibold text-lg leading-[28px]">
              模擬測驗及精選試題
            </div>
            <div className="text-text-tertiary">
              全真模考 +
              重點題庫不定期推送，隨時演練考場實戰，持續拓展數學思維與應試實力
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-semibold text-lg leading-[28px]">
              更省的價格
            </div>
            <div className="text-text-tertiary">
              不需花上萬元補習，一樣從頭到尾完整複習，知識一次打包帶走
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-semibold text-lg leading-[28px]">
              隨時隨地自主學習
            </div>
            <div className="text-text-tertiary">
              支援手機、平板與電腦，自訂進度，零碎時間也能高效複習，隨走隨看，不浪費任何時間
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-semibold text-lg leading-[28px]">
              名師親授，權威可靠
            </div>
            <div className="text-text-tertiary">
              最懂學測的暢銷參考書作者授課，精準掌握命題趨勢，考點命中率高，雙重保障成績
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { FeaturesSection };
