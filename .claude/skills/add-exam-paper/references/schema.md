# Exam Data Schema

## TypeScript Types

Source: `app/types/exam.ts`

```typescript
export type Subject = "math-a" | "math-b";

export interface ExamAssets {
  paper: string;        // always "paper.pdf"
  solution?: string;    // "solution.pdf" if provided
  video?: string;       // YouTube URL if provided
}

export interface ExamMeta {
  slug: string;         // directory name, e.g. "115-math-a"
  title: string;        // display title, e.g. "115 學測數學 A"
  subtitle: string;     // e.g. "2026 年度學科能力測驗"
  description: string;  // brief description of the exam
  year: number;         // Western year, e.g. 2026
  date: string;         // ISO date, e.g. "2026-01-18"
  subject: Subject;     // "math-a" or "math-b"
  tags: string[];       // e.g. ["數學 A", "學測"]
  duration: number;     // in minutes, typically 100
  assets: ExamAssets;
}

export interface ExamIndex {
  title: string;
  subtitle: string;
  description: string;
  papers: string[];     // array of slugs, newest first
}
```

## Directory Structure

```
app/data/{category}/
├── _index.json
└── papers/
    └── {slug}/
        ├── meta.json
        ├── paper.pdf
        └── solution.pdf  (optional)
```

Categories: `gsat` (學測), `exams` (模擬考)

## Example: meta.json (gsat)

```json
{
  "slug": "115-math-a",
  "title": "115 學測數學 A",
  "subtitle": "2026 年度學科能力測驗",
  "description": "完整收錄 115 學年度學測數學 A 考科全部題目與詳細解析，涵蓋多選題、選填題等多元題型，適合考前複習與實力檢測。",
  "year": 2026,
  "date": "2026-01-18",
  "subject": "math-a",
  "tags": ["數學 A", "學測"],
  "duration": 100,
  "assets": {
    "paper": "paper.pdf",
    "solution": "solution.pdf"
  }
}
```

## Example: _index.json (gsat)

```json
{
  "title": "歷屆學測試題",
  "subtitle": "完整收錄",
  "description": "收錄近年學測數學 A、數學 B 完整試題與詳細解析，幫助你掌握考試趨勢與命題重點。",
  "papers": [
    "115-math-a"
  ]
}
```

## Example: _index.json (exams)

```json
{
  "title": "仿真模擬考題",
  "subtitle": "實戰演練",
  "description": "完全依照學測規格設計的全真模擬試題，提前適應考試節奏與時間壓力。",
  "papers": []
}
```

## Slug Conventions

- **gsat**: `{ROC_YEAR}-{subject}` — e.g. `115-math-a`, `114-math-b`
  - ROC year = Western year - 1911
- **exams**: descriptive slug — e.g. `mock-math-a-01`, `advanced-01`

## Asset Serving

Assets are served via the route `api.data.$category.$slug.$filename.tsx`:
- URL pattern: `/api/data/{category}/{slug}/{filename}`
- Supported: `.pdf`, `.png`, `.jpg`, `.jpeg`
- Cache: `public, max-age=3600`
