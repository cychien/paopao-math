import { prisma } from "./client";
import { withCache, cacheKeys } from "~/services/cache/redis";

export type EntranceExamWithDetails = {
  id: string;
  title: string;
  year: number;
  subject: string;
  type: string;
  description: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  questions: ExamQuestionWithDetails[];
};

export type ExamQuestionWithDetails = {
  id: string;
  title: string;
  fileType: string;
  fileUrl: string | null;
  downloadFilename: string | null;
  questionType: string;
  order: number;
  answers: ExamAnswerDetails[];
  createdAt: Date;
  updatedAt: Date;
};

export type ExamAnswerDetails = {
  id: string;
  title: string;
  fileType: string;
  videoId: string | null;
  duration: number | null;
  fileUrl: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * 獲取所有入學考試及詳細資料
 */
export async function getAllEntranceExamsWithDetails(): Promise<
  EntranceExamWithDetails[]
> {
  return withCache(
    cacheKeys.entranceExamsWithDetails(),
    async () => {
      return await prisma.entranceExam.findMany({
        include: {
          questions: {
            include: {
              answers: {
                orderBy: { order: "asc" },
              },
            },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      });
    },
    300 // 5分鐘緩存
  );
}

/**
 * 根據 ID 獲取特定入學考試及詳細資料
 */
export async function getEntranceExamById(
  id: string
): Promise<EntranceExamWithDetails | null> {
  return withCache(
    cacheKeys.entranceExamById(id),
    async () => {
      return await prisma.entranceExam.findUnique({
        where: { id },
        include: {
          questions: {
            include: {
              answers: {
                orderBy: { order: "asc" },
              },
            },
            orderBy: { order: "asc" },
          },
        },
      });
    },
    300 // 5分鐘緩存
  );
}

/**
 * 獲取入學考試統計資料
 */
export async function getEntranceExamStats() {
  return withCache(
    cacheKeys.entranceExamStats(),
    async () => {
      const [exams, questions, answers] = await Promise.all([
        prisma.entranceExam.count(),
        prisma.examQuestion.count(),
        prisma.examAnswer.count(),
      ]);

      return {
        exams,
        questions,
        answers,
      };
    },
    300 // 5分鐘緩存
  );
}

/**
 * 創建入學考試
 */
export async function createEntranceExam(data: {
  title: string;
  year: number;
  subject: string;
  type: string;
  description?: string;
}) {
  // 獲取最大的order值
  const maxOrderExam = await prisma.entranceExam.findFirst({
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const newOrder = (maxOrderExam?.order ?? 0) + 1;

  return await prisma.entranceExam.create({
    data: {
      ...data,
      order: newOrder,
    },
  });
}

/**
 * 更新入學考試
 */
export async function updateEntranceExam(
  id: string,
  data: {
    title: string;
    year: number;
    subject: string;
    type: string;
    description?: string;
  }
) {
  return await prisma.entranceExam.update({
    where: { id },
    data,
  });
}

/**
 * 刪除入學考試
 */
export async function deleteEntranceExam(id: string) {
  return await prisma.entranceExam.delete({
    where: { id },
  });
}

/**
 * 創建考試題目
 */
export async function createExamQuestion(data: {
  title: string;
  fileType: string;
  fileUrl?: string;
  downloadFilename?: string;
  questionType: string;
  examId: string;
}) {
  // 獲取同一考試下的最大order值
  const maxOrderQuestion = await prisma.examQuestion.findFirst({
    where: { examId: data.examId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const newOrder = (maxOrderQuestion?.order ?? 0) + 1;

  return await prisma.examQuestion.create({
    data: {
      ...data,
      order: newOrder,
    },
  });
}

/**
 * 更新考試題目
 */
export async function updateExamQuestion(
  id: string,
  data: {
    title: string;
    fileType: string;
    fileUrl?: string;
    downloadFilename?: string;
    questionType: string;
  }
) {
  return await prisma.examQuestion.update({
    where: { id },
    data,
  });
}

/**
 * 刪除考試題目
 */
export async function deleteExamQuestion(id: string) {
  return await prisma.examQuestion.delete({
    where: { id },
  });
}

/**
 * 創建考試答案
 */
export async function createExamAnswer(data: {
  title: string;
  fileType: string;
  videoId?: string;
  duration?: number;
  fileUrl?: string;
  questionId: string;
}) {
  // 獲取同一題目下的最大order值
  const maxOrderAnswer = await prisma.examAnswer.findFirst({
    where: { questionId: data.questionId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const newOrder = (maxOrderAnswer?.order ?? 0) + 1;

  return await prisma.examAnswer.create({
    data: {
      ...data,
      order: newOrder,
    },
  });
}

/**
 * 更新考試答案
 */
export async function updateExamAnswer(
  id: string,
  data: {
    title: string;
    fileType: string;
    videoId?: string;
    duration?: number;
    fileUrl?: string;
  }
) {
  return await prisma.examAnswer.update({
    where: { id },
    data,
  });
}

/**
 * 刪除考試答案
 */
export async function deleteExamAnswer(id: string) {
  return await prisma.examAnswer.delete({
    where: { id },
  });
}

/**
 * 批量更新排序
 */
export async function reorderEntranceExams(
  updates: Array<{ id: string; order: number }>
) {
  await prisma.$transaction(
    updates.map(({ id, order }) =>
      prisma.entranceExam.update({
        where: { id },
        data: { order },
      })
    )
  );
}

export async function reorderExamQuestions(
  updates: Array<{ id: string; order: number }>
) {
  await prisma.$transaction(
    updates.map(({ id, order }) =>
      prisma.examQuestion.update({
        where: { id },
        data: { order },
      })
    )
  );
}

export async function reorderExamAnswers(
  updates: Array<{ id: string; order: number }>
) {
  await prisma.$transaction(
    updates.map(({ id, order }) =>
      prisma.examAnswer.update({
        where: { id },
        data: { order },
      })
    )
  );
}
