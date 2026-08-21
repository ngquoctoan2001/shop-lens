/**
 * Bộ icon SVG dùng chung. Tất cả đều là ảnh trang trí nên gắn aria-hidden —
 * phần chữ bên cạnh mới là thứ trình đọc màn hình đọc lên.
 */
type IconProps = { className?: string };

const base = "shrink-0";
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Cuộn len — logo của shop */
export function YarnIcon({ className = "size-6" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${base} ${className}`}
      aria-hidden="true"
      {...stroke}
      strokeWidth={1.9}
    >
      <path d="M4 15c3-7 13-7 16 0M7 9.5c1.6-3 8.4-3 10 0M9.5 5.5c1-1.4 4-1.4 5 0" />
    </svg>
  );
}

export function ChatIcon({ className = "size-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${base} ${className}`}
      aria-hidden="true"
      {...stroke}
    >
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-4.1-.9L3 20.5l1.6-4.6A8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4z" />
    </svg>
  );
}

export function MessengerIcon({ className = "size-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${base} ${className}`}
      aria-hidden="true"
      {...stroke}
    >
      <path d="M12 3C7 3 3 6.8 3 11.4c0 2.6 1.3 4.9 3.3 6.4V22l3-1.7c.8.2 1.7.3 2.7.3 5 0 9-3.8 9-8.4S17 3 12 3z" />
      <path d="m7.5 13.5 3-3.2 2.2 2 2.8-2.9-3 3.2-2.2-2z" />
    </svg>
  );
}

export function ArrowRightIcon({ className = "size-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${base} ${className}`}
      aria-hidden="true"
      {...stroke}
      strokeWidth={2.2}
    >
      <path d="M5 12h13m0 0-5-5m5 5-5 5" />
    </svg>
  );
}

export function ChevronLeftIcon({ className = "size-6" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${base} ${className}`}
      aria-hidden="true"
      {...stroke}
      strokeWidth={2.4}
    >
      <path d="m15 5-7 7 7 7" />
    </svg>
  );
}

export function ChevronRightIcon({ className = "size-6" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${base} ${className}`}
      aria-hidden="true"
      {...stroke}
      strokeWidth={2.4}
    >
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

export function CloseIcon({ className = "size-6" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${base} ${className}`}
      aria-hidden="true"
      {...stroke}
      strokeWidth={2.4}
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function MenuIcon({ className = "size-6" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${base} ${className}`}
      aria-hidden="true"
      {...stroke}
      strokeWidth={2.2}
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

/** Bông hoa nhỏ dùng làm dấu ngăn cách */
export function FlowerIcon({ className = "size-3" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${base} ${className}`}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M12 2c1.4 0 2.5 1.1 2.5 2.5 0 .5-.1.9-.3 1.3.4-.2.8-.3 1.3-.3 1.4 0 2.5 1.1 2.5 2.5S16.9 10.5 15.5 10.5c-.5 0-.9-.1-1.3-.3.2.4.3.8.3 1.3 0 1.4-1.1 2.5-2.5 2.5S9.5 12.9 9.5 11.5c0-.5.1-.9.3-1.3-.4.2-.8.3-1.3.3C7.1 10.5 6 9.4 6 8s1.1-2.5 2.5-2.5c.5 0 .9.1 1.3.3-.2-.4-.3-.8-.3-1.3C9.5 3.1 10.6 2 12 2z" />
      <path d="M11.2 14h1.6l.6 8h-2.8z" opacity=".55" />
    </svg>
  );
}
