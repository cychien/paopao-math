import { AttachmentCard } from "./AttachmentCard";
import { PDF } from "~/components/icons/PDF";

// Example usage of the refactored AttachmentCard
export const AttachmentCardExamples = () => {
  return (
    <div className="space-y-4 p-4">
      {/* 方式一：PDF 預覽（自動啟用） */}
      <AttachmentCard
        icon={<PDF className="w-full h-full" />}
        title="114 年學測數學 A 單選"
        type="pdf"
        fileUrl="/files/math-exam-114.pdf"
        downloadFilename="114A-math-exam.pdf"
      />

      {/* 方式二：圖片預覽 */}
      <AttachmentCard
        icon={<span>📸</span>}
        title="課堂照片 - 第一章"
        type="image"
        fileUrl="/images/class-photo-ch1.jpg"
      />

      {/* 方式三：影片預覽 */}
      <AttachmentCard
        icon={<span>🎥</span>}
        title="數學教學影片 - 二次函數"
        type="video"
        fileUrl="/videos/quadratic-function.mp4"
        className="border-green-200 hover:border-green-300"
      />

      {/* 方式四：文件下載 */}
      <AttachmentCard
        icon={<span>📝</span>}
        title="作業說明文件"
        type="document"
        fileUrl="/files/homework-instructions.docx"
      />

      {/* 方式五：自定義點擊處理（會覆蓋所有內建處理） */}
      <AttachmentCard
        icon={<span>⚙️</span>}
        title="特殊操作附件"
        type="custom"
        onClick={() => {
          // 自定義邏輯：可能是打開 modal、導航到其他頁面等
          console.log("執行自定義邏輯");
          alert("這是自定義的點擊處理！");
        }}
      />

      {/* 無點擊功能的附件（純展示） */}
      <AttachmentCard
        icon={<span>📋</span>}
        title="只供查看的資料"
        type="custom"
      />
    </div>
  );
};
