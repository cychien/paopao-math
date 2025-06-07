import { useState, useRef } from "react";
import { Upload, X, File, Image, FileText } from "lucide-react";
import { Button } from "./Button";

interface FileUploadProps {
  name: string;
  accept?: string;
  maxSize?: number; // in MB
  onFileSelect?: (file: File | null) => void;
  className?: string;
  disabled?: boolean;
  currentFile?: {
    name: string;
    url?: string;
    type: string;
  } | null;
}

export function FileUpload({
  name,
  accept = "image/*,.pdf,.doc,.docx",
  maxSize = 10,
  onFileSelect,
  className = "",
  disabled = false,
  currentFile,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled) return;

    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    setError("");

    // 檢查檔案大小
    if (file.size > maxSize * 1024 * 1024) {
      setError(`檔案大小不能超過 ${maxSize}MB`);
      return;
    }

    // 檢查檔案類型
    const acceptedTypes = accept.split(",").map((type) => type.trim());
    const isAccepted = acceptedTypes.some((type) => {
      if (type.startsWith(".")) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      if (type.includes("*")) {
        const baseType = type.split("/")[0];
        return file.type.startsWith(baseType);
      }
      return file.type === type;
    });

    if (!isAccepted) {
      setError("不支援的檔案類型");
      return;
    }

    setSelectedFile(file);

    // 將文件設置到隱藏的 input 元素中
    if (fileInputRef.current) {
      // 創建一個新的 FileList 並設置到 input
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
    }

    onFileSelect?.(file);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setError("");
    onFileSelect?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.files = null;
    }
  };

  const onButtonClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onButtonClick();
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="w-6 h-6" />;
    if (type === "application/pdf") return <FileText className="w-6 h-6" />;
    return <File className="w-6 h-6" />;
  };

  const displayFile = selectedFile || currentFile;

  return (
    <div className={`w-full ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        name={name}
        accept={accept}
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />

      {!displayFile ? (
        <button
          type="button"
          className={`
            w-full relative border-2 border-dashed rounded-lg p-6 transition-colors
            ${dragActive ? "border-brand-500 bg-brand-50" : "border-gray-300"}
            ${
              disabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-brand-400 hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            }
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-label="點擊或拖拽檔案進行上傳"
        >
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <p className="text-sm text-gray-600">點擊上傳或拖拽檔案到這裡</p>
              <p className="text-xs text-gray-500 mt-1">
                支援 PDF、圖片、Word 文檔，最大 {maxSize}MB
              </p>
            </div>
          </div>
        </button>
      ) : (
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getFileIcon(selectedFile?.type || currentFile?.type || "")}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {selectedFile?.name || currentFile?.name}
                </p>
                {selectedFile && (
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
                {currentFile?.url && !selectedFile && (
                  <a
                    href={currentFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand-600 hover:text-brand-700 block"
                  >
                    查看檔案
                  </a>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onButtonClick}
                disabled={disabled}
              >
                更換檔案
              </Button>
              {selectedFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleRemove}
                  disabled={disabled}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
