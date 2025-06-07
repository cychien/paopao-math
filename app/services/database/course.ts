import { prisma } from "./client";

export type LessonWithDetails = {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  chapters: ChapterWithDetails[];
};

export type ChapterWithDetails = {
  id: string;
  name: string;
  slug: string;
  order: number;
  teachings: TeachingDetails[];
  exams: ExamDetails[];
  createdAt: Date;
  updatedAt: Date;
};

export type TeachingDetails = {
  id: string;
  videoId: string;
  duration: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ExamDetails = {
  id: string;
  videoId: string;
  duration: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * 獲取所有課程及其完整內容
 */
export async function getAllLessonsWithDetails(): Promise<LessonWithDetails[]> {
  try {
    return await prisma.lesson.findMany({
      include: {
        chapters: {
          include: {
            teachings: {
              orderBy: { order: "asc" },
            },
            exams: {
              orderBy: { order: "asc" },
            },
          },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("獲取課程列表失敗:", error);
    throw new Error("獲取課程數據失敗");
  }
}

/**
 * 根據 ID 獲取特定課程
 */
export async function getLessonById(
  id: string
): Promise<LessonWithDetails | null> {
  try {
    return await prisma.lesson.findUnique({
      where: { id },
      include: {
        chapters: {
          include: {
            teachings: {
              orderBy: { order: "asc" },
            },
            exams: {
              orderBy: { order: "asc" },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });
  } catch (error) {
    console.error("獲取課程失敗:", error);
    throw new Error("獲取課程數據失敗");
  }
}

/**
 * 獲取課程統計信息
 */
export async function getCourseStats() {
  try {
    const [lessonCount, chapterCount, teachingCount, examCount] =
      await Promise.all([
        prisma.lesson.count(),
        prisma.chapter.count(),
        prisma.teaching.count(),
        prisma.exam.count(),
      ]);

    return {
      lessons: lessonCount,
      chapters: chapterCount,
      teachings: teachingCount,
      exams: examCount,
    };
  } catch (error) {
    console.error("獲取課程統計失敗:", error);
    throw new Error("獲取統計數據失敗");
  }
}

/**
 * 根據 slug 獲取課程
 */
export async function getLessonBySlug(
  slug: string
): Promise<LessonWithDetails | null> {
  try {
    return await prisma.lesson.findUnique({
      where: { slug },
      include: {
        chapters: {
          include: {
            teachings: {
              orderBy: { order: "asc" },
            },
            exams: {
              orderBy: { order: "asc" },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });
  } catch (error) {
    console.error("獲取課程失敗:", error);
    throw new Error("獲取課程數據失敗");
  }
}

/**
 * 根據課程 slug 和章節 slug 獲取章節詳情
 */
export async function getChapterBySlug(
  lessonSlug: string,
  chapterSlug: string
) {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { slug: lessonSlug },
      include: {
        chapters: {
          include: {
            teachings: {
              orderBy: { order: "asc" },
            },
            exams: {
              orderBy: { order: "asc" },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!lesson) {
      return null;
    }

    const chapter = lesson.chapters.find((c) => c.slug === chapterSlug);
    if (!chapter) {
      return null;
    }

    // 找到當前章節的索引
    const currentIndex = lesson.chapters.findIndex(
      (c) => c.slug === chapterSlug
    );
    const nextChapter =
      currentIndex + 1 < lesson.chapters.length
        ? lesson.chapters[currentIndex + 1]
        : null;

    return {
      ...chapter,
      lessonMeta: {
        name: lesson.name,
        slug: lesson.slug,
        chapters: lesson.chapters.map((c) => ({
          name: c.name,
          slug: c.slug,
        })),
      },
      nextChapter: nextChapter
        ? {
            name: nextChapter.name,
            slug: nextChapter.slug,
          }
        : null,
    };
  } catch (error) {
    console.error("獲取章節失敗:", error);
    throw new Error("獲取章節數據失敗");
  }
}
