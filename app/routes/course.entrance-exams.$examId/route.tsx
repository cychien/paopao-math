import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { AttachmentCard } from "~/components/business/AttachmentCard";
import { PDF } from "~/components/icons/PDF";
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
        return <span className="text-2xl">🎥</span>;
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
      <div className="pb-6">
        <h2 className="text-xl font-semibold">{exam.title}</h2>
        <p className="text-gray-600 mt-1">{exam.description}</p>
      </div>

      <div className="pt-6 space-y-8">
        {/* 題目區 */}
        {exam.questions.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-4">題目</h3>
            <div className="grid grid-cols-[repeat(auto-fill,_minmax(min(250px,_100%),_1fr))] gap-3">
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

        {/* 解答區 */}
        {exam.answers.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-4">解答</h3>
            <div className="grid grid-cols-[repeat(auto-fill,_minmax(min(250px,_100%),_1fr))] gap-3">
              {exam.answers.map((answer) => (
                <AttachmentCard
                  key={answer.id}
                  icon={getFileIcon(answer.type)}
                  title={answer.title}
                  type={answer.type as AttachmentType}
                  fileUrl={answer.fileUrl}
                  downloadFilename={answer.downloadFilename}
                />
              ))}
            </div>
          </div>
        )}

        {/* 如果沒有任何內容 */}
        {exam.questions.length === 0 && exam.answers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            此考試暫無可用資源
          </div>
        )}
      </div>
    </div>
  );
}
