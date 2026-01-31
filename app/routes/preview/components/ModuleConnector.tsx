import React from "react";

interface ModuleConnectorProps {
  index: number;
  total: number;
}

export function ModuleConnector({ index, total }: ModuleConnectorProps) {
  // 最後一個模組不需要連接線
  if (index === total - 1) return null;

  const isEven = index % 2 === 0;

  return (
    <>
      {/* Mobile Connector (Vertical Down) */}
      <div className="lg:hidden absolute left-1/2 -bottom-12 w-px h-12 -translate-x-1/2 z-0 flex flex-col items-center justify-center">
        <div className="h-full border-l-2 border-dashed border-brand-200" />
      </div>

      {/* Desktop Connector */}
      {isEven ? (
        // Left -> Right Connector (Horizontal)
        <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 z-0 pointer-events-none">
          <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-8 h-px">
            <div className="w-full border-t-2 border-dashed border-brand-200" />
          </div>
        </div>
      ) : (
        // Right -> Left (Next Row) Connector (Diagonal)
        // Connects Bottom-Left of current card to Top-Right of next card
        <div className="hidden lg:block absolute bottom-0 z-0 pointer-events-none">
          <div className="absolute top-full -left-8 w-8 h-12">
            <svg width="100%" height="100%" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line
                x1="32" y1="0"
                x2="0" y2="48"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="6 6"
                className="text-brand-200"
              />
            </svg>
          </div>
        </div>
      )}
    </>
  );
}
