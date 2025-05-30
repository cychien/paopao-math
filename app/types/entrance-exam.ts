export interface ExamFile {
  id: string;
  title: string;
  type: "pdf" | "video" | "image" | "document";
  fileUrl?: string; // For non-video files
  downloadFilename?: string;
  // Video specific fields (Vimeo)
  videoId?: string;
  duration?: number; // in seconds
}

export interface EntranceExam {
  id: string;
  title: string;
  year: number;
  subject: string;
  type: string; // A, B, etc.
  description: string;
  questions: ExamFile[];
  answers: ExamFile[];
}

export interface EntranceExamData {
  exams: EntranceExam[];
}
