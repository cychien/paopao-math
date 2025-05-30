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
    <div className="divide-y-1 divide-gray-100">
      <div className="pb-6">
        {/* <h1 className="text-sm text-gray-500">課程</h1> */}
        <h2 className="text-xl font-semibold">課程總覽</h2>
      </div>
      <div className="pt-6 space-y-8">
        {syllabus.map((lesson, index) => (
          <Lesson key={lesson.slug} lesson={lesson} index={index} />
        ))}
      </div>
    </div>
  );
}
