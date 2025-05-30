import { json, redirect, useLoaderData } from "@remix-run/react";
import { getSyllabus } from "~/utils/course.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { canUserAccessPath } from "~/services/auth/permissions";
import { safeRedirect } from "remix-utils/safe-redirect";
import { Lesson } from "./components/Lesson";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const path = url.pathname;

  const canAccess = await canUserAccessPath(request, path);
  if (!canAccess) {
    return redirect(safeRedirect("/"));
  }

  const syllabus = getSyllabus();
  return json({ syllabus });
}

export default function Page() {
  const { syllabus } = useLoaderData<typeof loader>();

  return (
    <div className="divide-y-1 divide-gray-200">
      <div className="pb-6">
        {/* <h1 className="text-sm text-gray-500">課程</h1> */}
        <h1 className="text-xl font-semibold">課程</h1>
      </div>

      <div className="py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 max-w-7xl items-start">
          {syllabus.map((lesson, index) => (
            <div
              key={lesson.slug}
              className="bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="p-4">
                <Lesson lesson={lesson} index={index} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
