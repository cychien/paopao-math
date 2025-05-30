import { EntranceExamData, EntranceExam } from "~/types/entrance-exam";
import entranceExamData from "~/data/entrance-exams.json";
import { PDF_ASSETS, PDFAssetKey } from "~/assets/entrance-exams";

// 解析資源 URL
function resolveAssetUrl(fileUrl?: string): string | undefined {
  if (!fileUrl) return undefined;

  // 如果是資源鍵，從 PDF_ASSETS 中獲取實際 URL
  if (fileUrl in PDF_ASSETS) {
    return PDF_ASSETS[fileUrl as PDFAssetKey];
  }

  // 否則直接返回（可能是完整 URL）
  return fileUrl;
}

// 獲取所有聯考題
export function getAllExams(): EntranceExam[] {
  const data = entranceExamData as EntranceExamData;
  return data.exams.map((exam) => ({
    ...exam,
    questions: exam.questions.map((q) => ({
      ...q,
      fileUrl: resolveAssetUrl(q.fileUrl),
    })),
  }));
}

// 根據 ID 獲取特定聯考題
export function getExamById(id: string): EntranceExam | null {
  const exams = getAllExams();
  return exams.find((exam) => exam.id === id) || null;
}

// 獲取考試列表（用於首頁）
export function getExamList() {
  return getAllExams().map((exam) => ({
    id: exam.id,
    title: exam.title,
    year: exam.year,
    subject: exam.subject,
    type: exam.type,
    description: exam.description,
    questionCount: exam.questions.length,
    answerCount: exam.answers.length,
  }));
}
