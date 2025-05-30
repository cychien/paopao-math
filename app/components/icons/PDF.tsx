import { SvgProps } from "./types";

function PDF({ className }: SvgProps) {
  return (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      height="200px"
      width="200px"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M10 8v8h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-2z"></path>
      <path d="M3 12h2a2 2 0 1 0 0 -4h-2v8"></path>
      <path d="M17 12h3"></path>
      <path d="M21 8h-4v8"></path>
    </svg>
  );
}

export { PDF };
