import fs from "node:fs/promises";
import path from "node:path";
import type { LoaderFunctionArgs } from "react-router";

const MIME_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { category, slug, filename } = params;

  if (!category || !slug || !filename) {
    throw new Response("Not found", { status: 404 });
  }

  // Prevent path traversal
  if (
    category.includes("..") ||
    slug.includes("..") ||
    filename.includes("..")
  ) {
    throw new Response("Forbidden", { status: 403 });
  }

  const filePath = path.join(
    process.cwd(),
    "app/data",
    category,
    "papers",
    slug,
    filename
  );

  try {
    const file = await fs.readFile(filePath);
    const ext = path.extname(filename).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    return new Response(file, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    throw new Response("Not found", { status: 404 });
  }
};
