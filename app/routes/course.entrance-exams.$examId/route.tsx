import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { ArrowLeft, Target, Clock, FileBadge, VideoIcon } from "lucide-react";
import { AttachmentCard } from "~/components/business/AttachmentCard";
import { PDF } from "~/components/icons/PDF";
import { Video } from "~/components/business/Video";
import { getExamById } from "~/utils/entrance-exam.server";
import { AttachmentType } from "~/components/business/AttachmentCard/AttachmentCard";
import { canUserAccessPath } from "~/services/auth/permissions";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { examId } = params;

  if (!examId) {
    throw new Response("Exam ID is required", { status: 400 });
  }

  // 權限檢查
  const url = new URL(request.url);
  const path = url.pathname;
  const canAccess = await canUserAccessPath(request, path);

  if (!canAccess) {
    return json({ notAccess: true, exam: null });
  }

  const exam = getExamById(examId);

  if (!exam) {
    throw new Response("Exam not found", { status: 404 });
  }

  return json({ exam, notAccess: false });
}

export default function ExamPage() {
  const data = useLoaderData<typeof loader>();

  if (data.notAccess || !data.exam) {
    return <div>無權限訪問</div>;
  }

  const exam = data.exam;

  // 動態選擇圖標
  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <PDF className="w-full h-full" />;
      case "video":
        return <VideoIcon className="w-full h-full" />;
      case "image":
        return <span className="text-2xl">📸</span>;
      case "document":
        return <span className="text-2xl">📝</span>;
      default:
        return <span className="text-2xl">📄</span>;
    }
  };

  return (
    <div className="divide-y-1 divide-gray-200">
      {/* 頁面標題和導航 */}
      <div className="pb-6">
        {/* 返回導航 */}
        <div className="mb-4">
          <Link
            to="/course/entrance-exams"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors w-fit"
          >
            <ArrowLeft className="size-4" />
            <span className="text-sm font-medium">返回歷屆聯考題</span>
          </Link>
        </div>

        {/* 考試標題卡片 */}
        <div>
          <h1 className="text-xl font-semibold mb-2">{exam.title}</h1>
          <p className="text-gray-600">{exam.description}</p>
        </div>
      </div>

      <div className="py-6 space-y-8">
        {/* 題目區 */}
        {exam.questions.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-brand-100 text-brand-600 rounded-lg flex items-center justify-center">
                <FileBadge className="size-4" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">題目檔案</h2>
              <div className="text-sm text-gray-500">
                {exam.questions.length} 個檔案
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {exam.questions.map((question) => (
                <AttachmentCard
                  key={question.id}
                  icon={getFileIcon(question.type)}
                  title={question.title}
                  type={question.type as AttachmentType}
                  fileUrl={question.fileUrl}
                  downloadFilename={question.downloadFilename}
                />
              ))}
            </div>
          </div>
        )}

        {/* 解答區 - 左右排列 */}
        {exam.answers.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-brand-100 text-brand-600 rounded-lg flex items-center justify-center">
                <VideoIcon className="size-4" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">詳解影片</h2>
              <div className="text-sm text-gray-500">
                {exam.answers.length} 個詳解
              </div>
            </div>

            {/* 左右排列容器 */}
            <div className="flex gap-8 xl:gap-12">
              {/* 左側：詳解影片內容 */}
              <div className="flex-1 max-w-4xl space-y-6">
                {exam.answers.map((answer) => (
                  <div key={answer.id} id={`answer-${answer.id}`}>
                    {answer.type === "video" && answer.videoId ? (
                      // 影片類型 - 使用 Video 組件
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {answer.title}
                        </h3>
                        <div className="pt-2">
                          <Video videoId={answer.videoId} />
                        </div>
                      </div>
                    ) : (
                      // 其他類型 - 使用 AttachmentCard
                      <AttachmentCard
                        icon={getFileIcon(answer.type)}
                        title={answer.title}
                        type={answer.type as AttachmentType}
                        fileUrl={answer.fileUrl}
                        downloadFilename={answer.downloadFilename}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* 右側：目錄 */}
              <div className="hidden xl:block w-80">
                <div className="sticky top-8">
                  <div className="bg-white border border-gray-200 rounded-md shadow-sm py-5 px-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-1 h-5 bg-brand-500 rounded-full" />
                      <h3 className="font-semibold text-gray-900">詳解目錄</h3>
                    </div>

                    <div className="space-y-1">
                      {exam.answers.map((answer) => (
                        <Link
                          key={answer.id}
                          to={`#answer-${answer.id}`}
                          className="block py-2 px-3 rounded-lg text-sm transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate">{answer.title}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 空狀態 */}
        {exam.questions.length === 0 && exam.answers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <Target className="size-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              內容準備中
            </h3>
            <p className="text-gray-600">
              此考試的題目和解答正在準備中，請稍後再來查看
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
