import type { ReactNode } from "react";

export type IconName =
  | "search"
  | "sun"
  | "moon"
  | "arrow-right"
  | "arrow-left"
  | "arrow-up-right"
  | "calendar"
  | "mail"
  | "phone"
  | "pin"
  | "external"
  | "menu"
  | "close"
  | "book"
  | "file"
  | "users"
  | "flask"
  | "bolt"
  | "leaf"
  | "car"
  | "plug"
  | "shield"
  | "network"
  | "chart"
  | "graduation"
  | "clock"
  | "check"
  | "info";

const paths: Record<IconName, ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />,
  "arrow-right": <path d="M4 12h16m-6-6 6 6-6 6" />,
  "arrow-left": <path d="M20 12H4m6-6-6 6 6 6" />,
  "arrow-up-right": <path d="M7 17 17 7M8 7h9v9" />,
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="1" />
      <path d="M7.5 3v4M16.5 3v4M3.5 9.5h17M8 13h2M14 13h2M8 17h2M14 17h2" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="m3.5 6 8.5 7 8.5-7" />
    </>
  ),
  phone: <path d="M7.2 3.5 9 7.7 6.8 9.4c1.2 2.7 3.1 4.6 5.8 5.8l1.7-2.2 4.2 1.8v3.3c0 .9-.8 1.6-1.7 1.5C8.9 18.8 5.2 15.1 4.4 5.2c-.1-.9.6-1.7 1.5-1.7h1.3Z" />,
  pin: (
    <>
      <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  external: <path d="M14 4h6v6M20 4l-9 9M19 14v5.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 .5-.5H11" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22.5Z" />
      <path d="M4 5.5v17M8 7h8M8 11h8" />
    </>
  ),
  file: (
    <>
      <path d="M6 3h8l4 4v14H6Z" />
      <path d="M14 3v5h5M9 12h6M9 16h6" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0M16 5.5a3 3 0 0 1 0 5.8M17 14.5a5 5 0 0 1 3.5 5.5" />
    </>
  ),
  flask: (
    <>
      <path d="M9 3h6M10 3v6l-5 8.5A2 2 0 0 0 6.7 21h10.6a2 2 0 0 0 1.7-3.5L14 9V3" />
      <path d="M7.5 15h9" />
    </>
  ),
  bolt: <path d="m13 2-8 12h6l-1 8 9-13h-6Z" />,
  leaf: (
    <>
      <path d="M20 4C11 4 5 8 5 15c0 2 .7 3.7 2 5 6-1 12-6 13-16Z" />
      <path d="M4 21c2-6 7-10 13-13" />
    </>
  ),
  car: (
    <>
      <path d="m5 16 1.5-5.5A2 2 0 0 1 8.4 9h7.2a2 2 0 0 1 1.9 1.5L19 16" />
      <path d="M4 16h16v4H4zM7 20v1M17 20v1" />
      <circle cx="7.5" cy="18" r=".7" />
      <circle cx="16.5" cy="18" r=".7" />
    </>
  ),
  plug: (
    <>
      <path d="M9 3v5M15 3v5M7 8h10v3a5 5 0 0 1-10 0Z" />
      <path d="M12 16v5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4.5 6v5.5c0 4.7 3.2 8.1 7.5 9.5 4.3-1.4 7.5-4.8 7.5-9.5V6Z" />
      <path d="m8.5 12 2.3 2.3 4.7-4.7" />
    </>
  ),
  network: (
    <>
      <circle cx="12" cy="5" r="2.2" />
      <circle cx="5" cy="18" r="2.2" />
      <circle cx="19" cy="18" r="2.2" />
      <path d="M12 7.2V12M10.3 13.3 6.6 16.2M13.7 13.3l3.7 2.9" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V4M4 20h16" />
      <path d="M8 16v-4M12 16V8M16 16v-6M20 16V6" />
    </>
  ),
  graduation: (
    <>
      <path d="m3 9 9-5 9 5-9 5Z" />
      <path d="M7 11.5V16c2.7 1.8 7.3 1.8 10 0v-4.5M21 9v6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  check: <path d="m5 12.5 4.2 4.2L19 7" />,
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
};

export function Icon({
  name,
  size = 18,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
