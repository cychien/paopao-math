import fs from "node:fs/promises";
import path from "node:path";
import type { ExamIndex, ExamMeta } from "~/types/exam";

const DATA_DIR = path.join(process.cwd(), "app/data");

export async function loadExamIndex(
  category: "gsat" | "exams"
): Promise<ExamIndex> {
  const raw = await fs.readFile(
    path.join(DATA_DIR, category, "_index.json"),
    "utf-8"
  );
  return JSON.parse(raw);
}

export async function loadExamMeta(
  category: "gsat" | "exams",
  slug: string
): Promise<ExamMeta> {
  const raw = await fs.readFile(
    path.join(DATA_DIR, category, "papers", slug, "meta.json"),
    "utf-8"
  );
  return JSON.parse(raw);
}

export async function loadAllExams(
  category: "gsat" | "exams"
): Promise<{ index: ExamIndex; papers: ExamMeta[] }> {
  const index = await loadExamIndex(category);
  const papers = await Promise.all(
    index.papers.map((slug) => loadExamMeta(category, slug))
  );
  return { index, papers };
}

export function getAssetUrl(
  category: "gsat" | "exams",
  slug: string,
  filename: string
): string {
  return `/api/data/${category}/${slug}/${filename}`;
}
