import { prisma } from "./prisma.server";

/**
 * 根據 courseId、moduleSlug 和 lessonSlug 獲取課程內容
 */
export async function getLessonBySlug(
  courseId: string,
  moduleSlug: string,
  lessonSlug: string
) {
  // 首先找到課程
  const lesson = await prisma.courseLesson.findFirst({
    where: {
      slug: lessonSlug,
      isDraft: false,
      module: {
        courseId,
        slug: moduleSlug,
        isDraft: false,
      },
    },
    select: {
      id: true,
      title: true,
      summary: true,
      slug: true,
      contentHtml: true,
      durationSec: true,
      isPublic: true,
      order: true,
      moduleId: true,
      module: {
        select: {
          id: true,
          title: true,
          slug: true,
          isPublic: true,
          courseId: true,
          // 取得同模組的所有課程列表
          lessons: {
            where: {
              isDraft: false,
            },
            orderBy: {
              order: "asc",
            },
            select: {
              id: true,
              title: true,
              slug: true,
              order: true,
              isPublic: true,
            },
          },
        },
      },
    },
  });

  if (!lesson) {
    return null;
  }

  // 找到下一課
  const nextLesson = await prisma.courseLesson.findFirst({
    where: {
      moduleId: lesson.moduleId,
      isDraft: false,
      order: { gt: lesson.order },
    },
    orderBy: { order: "asc" },
    select: {
      id: true,
      title: true,
      slug: true,
      isPublic: true,
    },
  });

  return {
    ...lesson,
    moduleMeta: {
      id: lesson.module.id,
      title: lesson.module.title,
      slug: lesson.module.slug,
      isPublic: lesson.module.isPublic,
      lessons: lesson.module.lessons,
    },
    nextLesson: nextLesson || undefined,
  };
}
