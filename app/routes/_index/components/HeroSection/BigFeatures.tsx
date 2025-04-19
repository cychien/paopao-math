import checkIconSrc from "~/assets/check.svg";

function BigFeatures() {
  return (
    <div className="space-y-4 lg:space-y-5">
      <div className="flex space-x-3 items-center">
        <img
          src={checkIconSrc}
          alt="check icon"
          className="w-7 h-7 lg:w-8 lg:h-8 flex-shrink-0"
        />
        <span className="text-text-tertiary text-lg">獨家重點整理及例題</span>
      </div>
      <div className="flex space-x-3 items-center">
        <img
          src={checkIconSrc}
          alt="check icon"
          className="w-7 h-7 lg:w-8 lg:h-8 flex-shrink-0"
        />
        <span className="text-text-tertiary text-lg">
          <span className="font-inter">200+</span> 精講影片，觀念拆解更透徹
        </span>
      </div>
      <div className="flex space-x-3 items-center">
        <img
          src={checkIconSrc}
          alt="check icon"
          className="w-7 h-7 lg:w-8 lg:h-8 flex-shrink-0"
        />
        <span className="text-text-tertiary text-lg">
          隨時隨地學，自主掌控學習進度
        </span>
      </div>
    </div>
  );
}

export { BigFeatures };
