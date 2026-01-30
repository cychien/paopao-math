function PoweredByBadge() {
  return (
    <div className="text-sm sm:text-base flex items-baseline gap-1">
      <span className="text-xs sm:text-sm sm:text-gray-500 text-gray-600 group-hover:text-gray-800 font-lato font-[400] subpixel-antialiased italic">
        powered by
      </span>{" "}
      <span className="font-medium text-gray-700 font-lato italic">
        MinuteSite
      </span>
    </div>
  );
  // return (
  //   <a
  //     href="https://minutesite.app"
  //     target="_blank"
  //     rel="noopener noreferrer"
  //     className="block relative rounded-full border border-gray-500/16 shadow-sm overflow-hidden bg-clip-padding group cursor-pointer hover:border-gray-500/30 transition-colors"
  //   >
  //     <div className="absolute inset-0 bg-[linear-gradient(to_right,_#FF5159,_#D048FF,_#6C73FF,_#407CFF,_#54FF9C,_#FFE23C)] opacity-40 -mask-linear-50 mask-linear-from-60% mask-linear-to-80% group-hover:opacity-60 group-hover:mask-linear-to-100% transition-all" />
  //     <div className="bg-white/60 backdrop-blur-sm text-sm py-1.5 px-3">
  //       <span className="text-gray-600 group-hover:text-gray-800 font-lato font-[400] subpixel-antialiased italic">
  //         powered by
  //       </span>{" "}
  //       MinuteSite
  //     </div>
  //   </a>
  // );
}

export { PoweredByBadge };
