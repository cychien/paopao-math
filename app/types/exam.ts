export type Subject = "math-a" | "math-b";

export interface ExamAssets {
  paper: string;
  solution?: string;
  video?: string;
}

export interface ExamMeta {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  year: number;
  date: string;
  subject: Subject;
  tags: string[];
  duration: number;
  assets: ExamAssets;
}

export interface ExamIndex {
  title: string;
  subtitle: string;
  description: string;
  papers: string[];
}
