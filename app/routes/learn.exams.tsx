import { Link, useLoaderData } from "react-router";
import { loadAllExams } from "~/data/loader.server";
import type { ExamMeta } from "~/types/exam";

export const loader = async () => {
  const { index, papers } = await loadAllExams("exams");
  return { index, papers };
};

export default function MockExamsPage() {
  const { index, papers } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 mb-8 sm:mb-12">
        <div className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-30">
            <div className="absolute inset-0 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:20px_20px] [--pattern-fg:var(--color-gray-900)]/5" />
          </div>

          <div className="px-8 py-6">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                {index.subtitle}
              </span>
              <h1 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
                {index.title}
              </h1>
              <p className="text-sm text-gray-600 max-w-xl leading-[1.7]">
                {index.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="pb-12 sm:pb-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {papers.map((paper) => (
              <PaperCard key={paper.slug} paper={paper} category="exams" />
            ))}
          </div>

          {papers.length === 0 && (
            <div className="text-center py-24 bg-white rounded-xl border border-gray-200 shadow-sm max-w-3xl mx-auto">
              <div className="text-gray-400 mb-4">
                <svg
                  className="size-12 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                目前沒有模擬試題
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PaperCard({
  paper,
  category,
}: {
  paper: ExamMeta;
  category: "gsat" | "exams";
}) {
  const hasVideo = Boolean(paper.assets.video);
  const hasSolution = Boolean(paper.assets.solution);

  return (
    <Link
      to={`/learn/${category}/${paper.slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-gray-300"
    >
      <div className="p-6 flex flex-col flex-1">
        <div className="flex flex-col gap-1 mb-3">
          <h2 className="text-base font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
            {paper.title}
          </h2>
          <p className="text-xs text-gray-500">{paper.subtitle}</p>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
          {paper.description}
        </p>

        <div className="flex items-center justify-between text-sm mb-4">
          <span className="text-gray-500">建議時間</span>
          <span className="font-medium text-gray-900">
            {paper.duration} 分鐘
          </span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex gap-2">
            {paper.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 text-gray-400">
            {hasSolution && (
              <svg
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                title="含解答 PDF"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            )}
            {hasVideo && (
              <svg
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                title="含解答影片"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
            )}
            <svg
              className="size-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
