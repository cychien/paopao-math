import checkIconSrc from "~/assets/check.svg";

function BigFeatures() {
  return (
    <div className="space-y-4 lg:space-y-5">
      <div className="flex space-x-4 items-center">
        <div className="flex-shrink-0 bg-brand-100/50 rounded-full p-1.5">
           <img
            src={checkIconSrc}
            alt="check icon"
            className="w-5 h-5 lg:w-6 lg:h-6 text-brand-600"
          />
        </div>
        <span className="text-gray-700 text-lg font-semibold">附贈實體學習參考書</span>
      </div>
      <div className="flex space-x-4 items-center">
        <div className="flex-shrink-0 bg-brand-100/50 rounded-full p-1.5">
           <img
            src={checkIconSrc}
            alt="check icon"
            className="w-5 h-5 lg:w-6 lg:h-6 text-brand-600"
          />
        </div>
        <span className="text-gray-700 text-lg font-semibold">
          <span className="font-bold text-brand-700">200+</span> 觀念精講 & 例題詳解影片
        </span>
      </div>
      <div className="flex space-x-4 items-center">
         <div className="flex-shrink-0 bg-brand-100/50 rounded-full p-1.5">
           <img
            src={checkIconSrc}
            alt="check icon"
            className="w-5 h-5 lg:w-6 lg:h-6 text-brand-600"
          />
        </div>
        <span className="text-gray-700 text-lg font-semibold">
          隨時隨地學，自主掌控學習進度
        </span>
      </div>
      <div className="flex space-x-4 items-center">
         <div className="flex-shrink-0 bg-brand-100/50 rounded-full p-1.5">
           <img
            src={checkIconSrc}
            alt="check icon"
            className="w-5 h-5 lg:w-6 lg:h-6 text-brand-600"
          />
        </div>
        <span className="text-gray-700 text-lg font-semibold">
          All in One 學習資源：總複習講義、模擬測驗、歷屆試題講解
        </span>
      </div>
    </div>
  );
}

export { BigFeatures };
