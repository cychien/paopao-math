import * as React from "react";
import { EyeIcon, X } from "lucide-react";
import { cn } from "~/utils/style";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "~/components/ui/Dialog";

type AttachmentType = "pdf" | "image" | "video" | "document" | "custom";

// 類型到顏色的映射
const TYPE_COLORS: Record<
  AttachmentType,
  { bgColor: string; iconColor: string }
> = {
  pdf: {
    bgColor: "bg-[#FCF1F1]",
    iconColor: "text-[#CF3C34]",
  },
  image: {
    bgColor: "bg-brand-50",
    iconColor: "text-brand-600",
  },
  video: {
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
  },
  document: {
    bgColor: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
  custom: {
    bgColor: "bg-gray-50",
    iconColor: "text-gray-600",
  },
};

type AttachmentCardProps = {
  icon: React.ReactNode;
  title: string;
  className?: string;

  // 統一的檔案處理
  type?: AttachmentType;
  fileUrl?: string;
  downloadFilename?: string;

  // 自定義點擊處理（會覆蓋所有內建處理）
  onClick?: () => void;
};

// 檢測是否為手機設備
const isMobileDevice = () => {
  if (typeof window === "undefined") return false;
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth <= 768
  );
};

// 內建的附件處理邏輯
const handleAttachmentClick = (type: AttachmentType, url: string) => {
  switch (type) {
    case "pdf":
      // PDF 由 Dialog 處理，這裡不會被調用
      break;
    case "image":
      // 可以打開圖片預覽或下載
      window.open(url, "_blank");
      break;
    case "video":
      // 打開影片播放器
      window.open(url, "_blank");
      break;
    case "document": {
      // 下載文件
      const link = document.createElement("a");
      link.href = url;
      link.download = "";
      link.click();
      break;
    }
    default:
      console.log("Unknown attachment type:", type);
  }
};

// 手機端 PDF 處理
const handleMobilePdfClick = (fileUrl: string, downloadFilename?: string) => {
  // 優化策略：先嘗試直接在瀏覽器中打開 PDF
  // 不使用 download 屬性，讓瀏覽器決定最佳處理方式
  try {
    // 方法1: 使用 window.open 直接打開（通常會在瀏覽器內預覽）
    const opened = window.open(fileUrl, "_blank", "noopener,noreferrer");

    // 如果 window.open 被阻擋，使用備用方案
    if (!opened) {
      // 方法2: 創建臨時鏈接但不強制下載
      const link = document.createElement("a");
      link.href = fileUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      // 不設置 download 屬性，讓瀏覽器嘗試預覽
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error("Error opening PDF:", error);
    // 如果都失敗，則回到下載方式
    const link = document.createElement("a");
    link.href = fileUrl;
    link.target = "_blank";
    if (downloadFilename) {
      link.download = downloadFilename;
    }
    link.click();
  }
};

const AttachmentCard = React.forwardRef<
  React.ElementRef<"div">,
  AttachmentCardProps
>(
  (
    {
      icon,
      title,
      className,
      type = "custom",
      fileUrl,
      downloadFilename,
      onClick,
    },
    ref
  ) => {
    const colors = TYPE_COLORS[type];
    const isMobile = isMobileDevice();
    const isPdfPreview = type === "pdf" && fileUrl && !isMobile; // 只在桌面版啟用 Dialog 預覽
    const isMobilePdf = type === "pdf" && fileUrl && isMobile; // 手機 PDF 處理

    const handleClick = () => {
      if (onClick) {
        // 優先使用自定義的 onClick
        onClick();
      } else if (isMobilePdf) {
        // 手機 PDF 直接處理
        handleMobilePdfClick(fileUrl!, downloadFilename);
      } else if (type && fileUrl) {
        // 使用內建的處理邏輯
        handleAttachmentClick(type, fileUrl);
      }
    };

    const isClickable = Boolean(onClick || (type && fileUrl));

    const CardContent = (
      <div
        ref={ref}
        className={cn(
          "inline-flex bg-white p-1.5 shadow-xs border border-gray-200 rounded-lg items-center w-full",
          (isClickable || isPdfPreview) &&
            "cursor-pointer hover:shadow-sm transition-shadow",
          className
        )}
        onClick={
          !isPdfPreview ? (isClickable ? handleClick : undefined) : undefined
        }
        role={!isPdfPreview && isClickable ? "button" : undefined}
        tabIndex={!isPdfPreview && isClickable ? 0 : undefined}
        onKeyDown={
          !isPdfPreview && isClickable
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleClick();
                }
              }
            : undefined
        }
      >
        <div
          className={cn(
            "size-14 flex items-center justify-center rounded-lg",
            colors.bgColor
          )}
        >
          <div className={cn("size-10", colors.iconColor)}>{icon}</div>
        </div>
        <div className="text-sm font-medium ml-2.5 truncate flex-1">
          {title}
        </div>
        {/* 手機端顯示下載/查看提示 */}
        {isMobilePdf && (
          <div className="flex items-center text-xs text-gray-500 ml-2">
            <EyeIcon className="w-4 h-4 mr-1" />
            預覽
          </div>
        )}
      </div>
    );

    // 如果是桌面版 PDF 且有 fileUrl，包裝在 Dialog 中
    if (isPdfPreview) {
      return (
        <Dialog>
          <DialogTrigger asChild>{CardContent}</DialogTrigger>

          <DialogContent className="fixed top-1/2 left-1/2 w-[90vw] max-w-5xl h-[85vh] -translate-x-1/2 translate-y-[calc(-50%+12px)] rounded-lg p-0 bg-transparent border-none">
            <object
              title={`PDF Preview: ${title}`}
              type="application/pdf"
              data={fileUrl}
              className="w-full h-full"
            >
              Sorry, your browser doesn&apos;t support PDF preview.{" "}
              <a href={fileUrl} download={downloadFilename || `${title}.pdf`}>
                Download
              </a>
            </object>
            <DialogClose className="absolute right-0 -top-9 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground cursor-pointer">
              <div className="p-1.5 rounded-full flex items-center justify-center bg-gray-50">
                <X className="h-4 w-4" />
              </div>
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogContent>
        </Dialog>
      );
    }

    return CardContent;
  }
);

AttachmentCard.displayName = "AttachmentCard";

export { AttachmentCard, type AttachmentCardProps, type AttachmentType };
