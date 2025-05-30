import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { trialPermissions } from "~/data/permission";
import { canAccess } from "~/utils/permission";
import { getExamList } from "~/utils/entrance-exam.server";

export function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const path = url.pathname;
  const ok = canAccess({
    permissions: trialPermissions,
    pathname: path,
  });
  if (!ok) {
    return json({ notAccess: true, examList: [] });
  }

  const examList = getExamList();
  return json({ notAccess: false, examList });
}

export default function EntranceExamsIndexPage() {
  const data = useLoaderData<typeof loader>();

  if (data.notAccess) {
    return <div>無權限訪問</div>;
  }

  return (
    <div className="divide-y-1 divide-gray-100">
      <div className="pb-6">
        <h2 className="text-xl font-semibold">歷屆聯考題</h2>
      </div>
      <div className="pt-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.examList.map((exam) => (
            <Link key={exam.id} to={`/course/entrance-exams/${exam.id}`}>
              <div className="bg-white border border-gray-200 rounded-md shadow-xs p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="aspect-square w-16 bg-gray-100 rounded text-lg font-semibold font-inter flex items-center justify-center tracking-wide text-gray-500">
                    {exam.year} {exam.type}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium text-gray-900">{exam.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {exam.description}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>題目 {exam.questionCount} 份</span>
                  <span>解答 {exam.answerCount} 份</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
