import {
  getAllEntranceExamsWithDetails,
  getEntranceExamById,
} from "~/services/database/entrance-exams";
import type { EntranceExamWithDetails } from "~/services/database/entrance-exams";

// 轉換資料庫結構為前端所需的格式
function transformExamData(exam: EntranceExamWithDetails) {
  // 將所有答案平鋪成一個陣列，而不是按題目分組
  const allAnswers = exam.questions.flatMap((question) =>
    question.answers.map((answer) => ({
      id: answer.id,
      title: answer.title,
      type: answer.fileType,
      videoId: answer.videoId || undefined,
      duration: answer.duration || undefined,
      fileUrl: answer.fileUrl || undefined,
    }))
  );

  return {
    id: exam.id,
    title: exam.title,
    year: exam.year,
    subject: exam.subject,
    type: exam.type,
    description: exam.description || "",
    questions: exam.questions.map((question) => ({
      id: question.id,
      title: question.title,
      type: question.fileType,
      fileUrl: question.fileUrl || undefined,
      downloadFilename: question.downloadFilename || undefined,
      questionType: question.questionType,
    })),
    answers: allAnswers,
  };
}

// 獲取所有聯考題
export async function getAllExams() {
  const exams = await getAllEntranceExamsWithDetails();
  return exams.map(transformExamData);
}

// 根據 ID 獲取特定聯考題
export async function getExamById(id: string) {
  const exam = await getEntranceExamById(id);
  if (!exam) {
    return null;
  }
  return transformExamData(exam);
}

// 獲取考試列表（用於首頁）
export async function getExamList() {
  const exams = await getAllEntranceExamsWithDetails();
  return exams.map((exam) => {
    const totalAnswers = exam.questions.reduce(
      (sum, question) => sum + question.answers.length,
      0
    );

    return {
      id: exam.id,
      title: exam.title,
      year: exam.year,
      subject: exam.subject,
      type: exam.type,
      description: exam.description || "",
      questionCount: exam.questions.length,
      answerCount: totalAnswers,
    };
  });
}
