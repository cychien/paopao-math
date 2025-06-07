import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { VideoIcon, FileBadge } from "lucide-react";
import { canUserAccessPath } from "~/services/auth/permissions";
import { getExamList } from "~/utils/entrance-exam.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const path = url.pathname;

  const canAccess = await canUserAccessPath(request, path);
  if (!canAccess) {
    return json({ notAccess: true, examList: [] });
  }

  const examList = await getExamList();
  return json({ notAccess: false, examList });
}

export default function EntranceExamsIndexPage() {
  const data = useLoaderData<typeof loader>();

  if (data.notAccess) {
    return <div>無權限訪問</div>;
  }

  // 按年分分組考試
  const examsByYear = data.examList.reduce((acc, exam) => {
    if (!acc[exam.year]) {
      acc[exam.year] = [];
    }
    acc[exam.year].push(exam);
    return acc;
  }, {} as Record<number, typeof data.examList>);

  const years = Object.keys(examsByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="divide-y-1 divide-gray-200">
      <div className="pb-6">
        <div>
          <h1 className="text-xl font-semibold">歷屆聯考題</h1>
        </div>
      </div>

      <div className="py-6 space-y-8">
        {years.map((year) => (
          <div key={year} className="space-y-4">
            {/* 年份標題 */}
            <div className="flex items-center space-x-3">
              <div className="w-1 h-6 bg-brand-500 rounded-full" />
              <h2 className="text-lg font-semibold text-gray-900">{year} 年</h2>
              <div className="text-sm text-gray-500">
                {examsByYear[Number(year)].length} 份考卷
              </div>
            </div>

            {/* 考試卡片網格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {examsByYear[Number(year)].map((exam) => (
                <Link
                  key={exam.id}
                  to={`/course/entrance-exams/${exam.id}`}
                  className="group"
                >
                  <div className="bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md hover:border-brand-300 transition-all duration-200 overflow-hidden h-full">
                    <div className="p-4">
                      {/* 考試標題區域 */}
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-base group-hover:text-brand-700 transition-colors">
                            {exam.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {exam.description}
                          </p>
                        </div>
                      </div>

                      {/* 統計信息 */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex space-x-4">
                          <div className="flex items-center space-x-1">
                            <FileBadge className="size-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {exam.questionCount} 題目
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <VideoIcon className="size-4 text-gray-400 translate-y-px" />
                            <span className="text-sm text-gray-600">
                              {exam.answerCount} 詳解影片
                            </span>
                          </div>
                        </div>

                        {/* 完成狀態指示器 */}
                        <div className="flex space-x-1">
                          {exam.answerCount > 0 && (
                            <div
                              className="w-2 h-2 bg-green-400 rounded-full"
                              title="有解答影片"
                            />
                          )}
                          {exam.questionCount > 0 && (
                            <div
                              className="w-2 h-2 bg-brand-400 rounded-full"
                              title="有題目檔案"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
