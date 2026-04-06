import { useState } from "react";
import { Link, useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { loadExamMeta, getAssetUrl } from "~/data/loader.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const slug = params.slug;
  if (!slug) throw new Response("Not found", { status: 404 });

  const paper = await loadExamMeta("exams", slug);
  const paperUrl = getAssetUrl("exams", slug, paper.assets.paper);
  const solutionUrl = paper.assets.solution
    ? getAssetUrl("exams", slug, paper.assets.solution)
    : null;

  return { paper, paperUrl, solutionUrl };
};

export default function ExamsDetailPage() {
  const { paper, paperUrl, solutionUrl } = useLoaderData<typeof loader>();
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-stone-50">
      {/* Header Bar — fixed at top, never overlapped */}
      <div className="shrink-0 bg-stone-900 border-b border-stone-800 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              to="/learn/exams"
              className="shrink-0 flex items-center gap-1.5 text-stone-400 hover:text-stone-200 transition-colors text-sm"
            >
              <svg
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
              返回
            </Link>
            <div className="h-4 w-px bg-stone-700 shrink-0" />
            <div className="min-w-0">
              <h1 className="text-sm font-semibold text-stone-100 truncate">
                {paper.title}
              </h1>
              <p className="text-xs text-stone-500 truncate">{paper.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-500">
              <svg
                className="size-3.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <span>{paper.duration} 分鐘</span>
            </div>

            {paper.tags.map((tag) => (
              <span
                key={tag}
                className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-stone-800 text-stone-400 border border-stone-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable content area — independent scroll context */}
      <div className="flex-1 overflow-y-auto">
        {/* PDF Viewer */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-4">
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
            <iframe
              title={`${paper.title} 題目`}
              src={paperUrl}
              className="w-full border-0"
              style={{ height: "calc(100vh - 160px)", minHeight: "600px" }}
            />
          </div>
        </div>

        {/* Answer Reveal Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
          {!revealed ? (
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-stone-200/50 to-stone-300/30 blur-xl" />
              <div className="relative bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
                <div className="px-6 py-10 sm:py-14 flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="size-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center">
                      <svg
                        className="size-7 text-amber-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                        />
                      </svg>
                    </div>
                    <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center">
                      <svg
                        className="size-2.5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0 1 10 0v2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-stone-900 mb-1.5">
                    做完了嗎？
                  </h3>
                  <p className="text-sm text-stone-500 mb-6 max-w-md leading-relaxed">
                    確認完成作答後，點擊下方按鈕查看詳解與解答影片。
                    <br />
                    建議先獨立完成再對答案，效果最好。
                  </p>

                  <button
                    onClick={() => setRevealed(true)}
                    className="group relative inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold text-white bg-amber-600 rounded-xl hover:bg-amber-500 active:bg-amber-700 transition-all duration-200 shadow-md shadow-amber-600/20 hover:shadow-lg hover:shadow-amber-500/25 cursor-pointer"
                  >
                    <svg
                      className="size-4 transition-transform group-hover:scale-110"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                      />
                    </svg>
                    查看答案與詳解
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="size-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <svg
                    className="size-4 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-stone-900">
                  答案與詳解
                </h3>
              </div>

              {solutionUrl && (
                <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
                  <div className="px-5 py-3 border-b border-stone-100 flex items-center gap-2">
                    <svg
                      className="size-4 text-stone-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-stone-700">
                      解答 PDF
                    </span>
                  </div>
                  <iframe
                    title={`${paper.title} 解答`}
                    src={solutionUrl}
                    className="w-full border-0"
                    style={{ height: "calc(100vh - 200px)", minHeight: "500px" }}
                  />
                </div>
              )}

              {paper.assets.video && (
                <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
                  <div className="px-5 py-3 border-b border-stone-100 flex items-center gap-2">
                    <svg
                      className="size-4 text-stone-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-stone-700">
                      解答影片
                    </span>
                  </div>
                  <div className="aspect-video">
                    <iframe
                      src={toEmbedUrl(paper.assets.video)}
                      title={`${paper.title} 解答影片`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {!solutionUrl && !paper.assets.video && (
                <div className="bg-white rounded-xl border border-stone-200 shadow-sm px-6 py-10 text-center">
                  <p className="text-sm text-stone-500">
                    這份考卷的詳解正在製作中，敬請期待。
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function toEmbedUrl(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  if (match) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url;
}
