// 使用 Vite 的 import.meta.glob 動態導入所有 PDF 文件
const pdfModules = import.meta.glob("./*.pdf", {
  eager: true,
  import: "default",
});

// 將文件路徑轉換為簡潔的鍵名映射
export const PDF_ASSETS: Record<string, string> = {};

for (const [path, url] of Object.entries(pdfModules)) {
  // 從 './114a-single.pdf' 提取 '114a-single' 作為鍵
  const key = path.replace("./", "").replace(".pdf", "");
  PDF_ASSETS[key] = url as string;
}

export type PDFAssetKey = keyof typeof PDF_ASSETS;
