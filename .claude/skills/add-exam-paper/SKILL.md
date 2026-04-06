---
name: add-exam-paper
description: This skill should be used when the user asks to "add an exam paper", "add a gsat paper", "add exam data", "新增考卷", "新增學測", "新增模擬考", or provides PDF URLs for exam papers to be added to the project. Automates downloading PDFs, creating metadata, and updating the index.
---

# Add Exam Paper

Automate the process of adding exam papers (學測、模擬考) to the data directory. This includes downloading PDFs, creating `meta.json`, and updating `_index.json`.

## Workflow

### Step 1: Gather Required Information

Collect the following from the user. If not explicitly provided, infer from context or ask:

| Field | Required | Example | Notes |
|-------|----------|---------|-------|
| **category** | Yes | `gsat` or `exams` | `gsat` = 學測, `exams` = 模擬考 |
| **paper PDF URL** | Yes | `https://...paper.pdf` | 題目 PDF |
| **solution PDF URL** | No | `https://...solution.pdf` | 詳解 PDF |
| **video URL** | No | `https://youtu.be/...` | YouTube 解題影片 |
| **year** | Yes | `2026` | 西元年 |
| **subject** | Yes | `math-a` or `math-b` | 數學 A 或 B |
| **exam date** | Yes | `2026-01-18` | ISO format |
| **description** | No | Auto-generate | 簡短描述考卷特色 |

### Step 2: Determine the Slug

Construct the slug based on category:

- **gsat**: `{ROC_YEAR}-{subject}` → e.g. `115-math-a`
  - ROC year = Western year - 1911
- **exams**: Use a descriptive slug → e.g. `mock-math-a-01`, `advanced-01`

### Step 3: Create Directory and Download PDFs

```
app/data/{category}/papers/{slug}/
├── meta.json
├── paper.pdf        (required)
├── solution.pdf     (optional)
```

Download PDFs using `curl -sL -o`:

```bash
mkdir -p app/data/{category}/papers/{slug}
curl -sL -o app/data/{category}/papers/{slug}/paper.pdf "{paper_url}"
curl -sL -o app/data/{category}/papers/{slug}/solution.pdf "{solution_url}"
```

Verify downloads by checking file sizes are non-zero.

### Step 4: Create meta.json

Write `meta.json` following the `ExamMeta` schema. Refer to `references/schema.md` for the full type definition and a concrete example.

Key rules:
- `slug` must match the directory name
- `title` format for gsat: `{ROC_YEAR} 學測數學 A` or `{ROC_YEAR} 學測數學 B`
- `subtitle` format for gsat: `{YEAR} 年度學科能力測驗`
- `tags` for gsat: `["數學 A", "學測"]` or `["數學 B", "學測"]`
- `duration`: `100` (minutes) for standard exams
- `assets.paper` is always `"paper.pdf"`
- Only include `assets.solution` / `assets.video` if the files/URLs are provided

### Step 5: Update _index.json

Read the existing `app/data/{category}/_index.json`, prepend the new slug to the `papers` array (newest first), and write back.

### Step 6: Verify

Confirm the following:
1. PDF files exist and have non-zero size
2. `meta.json` is valid JSON matching the schema
3. `_index.json` contains the new slug
4. No duplicate slugs in the index

## Batch Operations

When adding multiple papers at once, repeat Steps 3-5 for each paper, then do a single verification pass. Download PDFs in parallel when possible.

## Additional Resources

### Reference Files

- **`references/schema.md`** — Full TypeScript types and a concrete `meta.json` example
