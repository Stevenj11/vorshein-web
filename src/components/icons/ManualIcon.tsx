import type { ReactNode } from "react";

const PATHS: Record<string, ReactNode> = {
  "01": (
    <path d="M3 8c2 2 4 2 6 0s4-2 6 0 4 2 6 0M3 16c2 2 4 2 6 0s4-2 6 0 4 2 6 0" />
  ),
  "02": <path d="M2 12h4l2-7 4 14 3-10 2 3h5" />,
  "03": (
    <>
      <path d="M12 3v11" />
      <path d="M7 8c-2 1-3 3-3 5a4 4 0 0 0 8 0" />
      <path d="M17 8c2 1 3 3 3 5a4 4 0 0 1-8 0" />
    </>
  ),
  "04": (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
    </>
  ),
  "05": <path d="M4 12h6M12 6l8 6-8 6" />,
  "06": (
    <>
      <path d="M4 8c2.5 1.5 5 1.5 8 0s5.5-1.5 8 0" />
      <path d="M12 8v13" />
      <path d="M9 17l3 4 3-4" />
    </>
  ),
  "07": <path d="M20 12a8 8 0 1 1-3-6.2M20 3v5h-5" />,
  "08": (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </>
  ),
  "09": (
    <>
      <path d="M8 3h8M8 21h8" />
      <path d="M8 3c0 5 4 6 4 9s-4 4-4 9" />
      <path d="M16 3c0 5-4 6-4 9s4 4 4 9" />
    </>
  ),
  "10": (
    <>
      <path d="M6 4h12v4a6 6 0 0 1-12 0V4Z" />
      <path d="M6 6H3v2a3 3 0 0 0 3 3M18 6h3v2a3 3 0 0 1-3 3" />
      <path d="M12 14v4M9 21h6" />
    </>
  ),
};

export function ManualIcon({ n, className }: { n: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {PATHS[n] ?? <circle cx="12" cy="12" r="8" />}
    </svg>
  );
}
