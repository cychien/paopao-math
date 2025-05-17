import * as React from "react";

type VideoProps = {
  videoId: string;
  width?: number | string;
  height?: number | string;
};

function Video({ videoId, width = "100%", height = "100%" }: VideoProps) {
  const videoElementId = `video-${React.useId()}`;
  const iframeId = `iframe-${React.useId()}`;

  return (
    <div
      id={videoElementId}
      className="ring shadow-md rounded overflow-hidden ring-gray-200 opacity-0"
    >
      <div className="relative aspect-video">
        <iframe
          id={iframeId}
          title={videoId}
          src={`https://player.vimeo.com/video/${videoId}`}
          width={width}
          height={height}
          allow="fullscreen; picture-in-picture"
          allowFullScreen
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function () {
              const video = document.getElementById('${videoElementId}');
              const iframe = document.getElementById('${iframeId}');
              if (iframe.complete) {
                video.classList.remove('opacity-0');
              } else {
                iframe.onload = function () {
                  video.classList.remove('opacity-0');
                }; 
              }
            })();  
            `,
          }}
        />
      </div>
    </div>
  );
}

export { Video };
