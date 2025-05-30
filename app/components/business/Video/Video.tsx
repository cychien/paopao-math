import * as React from "react";
import { cn } from "~/utils/style";

type VideoProps = {
  videoId: string;
  width?: number | string;
  height?: number | string;
};

function Video({ videoId, width = "100%", height = "100%" }: VideoProps) {
  // 影片載入完成前先隱藏
  const [loaded, setLoaded] = React.useState(false);

  // iframe onLoad 觸發後切換 loaded
  const handleLoad = React.useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <div
      className={cn(
        "ring shadow-md rounded overflow-hidden ring-gray-200 transition-opacity duration-300",
        // loaded 後從 0 → 100% 透明度
        loaded ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="relative aspect-video">
        <iframe
          title={videoId}
          src={`https://player.vimeo.com/video/${videoId}`}
          width={width}
          height={height}
          allow="fullscreen; picture-in-picture"
          allowFullScreen
          onLoad={handleLoad} // 核心：iframe 載入完執行
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </div>
  );
}

export { Video };
