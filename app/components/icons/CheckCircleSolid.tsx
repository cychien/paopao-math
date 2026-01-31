import { SvgProps } from "./types";

function CheckCircleSolid({ className }: SvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 7.72a.75.75 0 00-1.06-1.06l-4.72 4.72-1.97-1.97a.75.75 0 00-1.06 1.06l2.5 2.5a.75.75 0 001.06 0l5.25-5.25z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export { CheckCircleSolid };
