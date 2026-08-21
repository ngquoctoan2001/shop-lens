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

/** Cuộn len — icon trang trí dự phòng */
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

/**
 * Bong bóng chat đặc — dùng bên trong khuyên tròn màu mật ong của nút Zalo.
 * Vẽ đặc (fill) chứ không viền mảnh, nhìn ở cỡ nhỏ mới rõ. Ba chấm được
 * khoét theo màu nền khuyên tròn (--chip-bg) nên đổi màu khuyên là chấm
 * tự đổi theo.
 */
export function ChatIcon({ className = "size-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${base} ${className}`}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M12 3.2c-5.1 0-9.2 3.5-9.2 7.9 0 2.4 1.24 4.57 3.2 6.03l-.86 3.23a.5.5 0 0 0 .72.56l3.4-1.83c.87.2 1.79.31 2.74.31 5.1 0 9.2-3.5 9.2-7.9S17.1 3.2 12 3.2Z" />
      <circle cx="8.3" cy="11.1" r="1.15" fill="var(--chip-bg, #d9a441)" />
      <circle cx="12" cy="11.1" r="1.15" fill="var(--chip-bg, #d9a441)" />
      <circle cx="15.7" cy="11.1" r="1.15" fill="var(--chip-bg, #d9a441)" />
    </svg>
  );
}

/**
 * Tia chớp của Messenger. Đặt bên trong khuyên tròn phủ dải màu gradient
 * của Messenger — logo thật cũng là gradient + tia chớp trắng.
 */
export function MessengerIcon({ className = "size-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${base} ${className}`}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M4.6 15.98 9.9 10.3a.62.62 0 0 1 .87-.04l2.66 2.3 3.5-2.32a.5.5 0 0 1 .66.73l-5.3 5.68a.62.62 0 0 1-.87.04l-2.66-2.3-3.5 2.32a.5.5 0 0 1-.66-.73Z" />
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

/* --------------------------------------------------------------------------
   Bốn icon cho các ô "điểm cộng" trong popup chi tiết sản phẩm
   -------------------------------------------------------------------------- */

/** Trái tim có đường khâu — ý "móc tay thủ công" */
export function HandmadeIcon({ className = "size-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${base} ${className}`}
      aria-hidden="true"
      {...stroke}
      strokeWidth={1.9}
    >
      <path d="M12 20.4S3.9 15.3 3.9 9.7a4.35 4.35 0 0 1 8.1-2.3 4.35 4.35 0 0 1 8.1 2.3c0 5.6-8.1 10.7-8.1 10.7Z" />
      <path d="M8.4 11.1h7.2" strokeDasharray="2.1 2.4" strokeWidth={1.7} />
    </svg>
  );
}

/** Bảng màu — ý "đổi màu len theo ý bạn" */
export function PaletteIcon({ className = "size-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${base} ${className}`}
      aria-hidden="true"
      {...stroke}
      strokeWidth={1.9}
    >
      <path d="M12 3.2c-5 0-8.8 3.9-8.8 8.8s3.8 8.8 8.8 8.8c1 0 1.8-.8 1.8-1.8 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-1 .8-1.8 1.8-1.8h2.1c2.8 0 4.1-2 4.1-4.6 0-3.9-3.9-7-8.8-7Z" />
      <circle cx="7.7" cy="12.4" r="1.05" fill="currentColor" stroke="none" />
      <circle cx="9.9" cy="8.4" r="1.05" fill="currentColor" stroke="none" />
      <circle cx="14.4" cy="8.4" r="1.05" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Hộp quà thắt nơ — ý "hợp làm quà tặng" */
export function GiftIcon({ className = "size-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${base} ${className}`}
      aria-hidden="true"
      {...stroke}
      strokeWidth={1.9}
    >
      <path d="M4.4 11.5h15.2v7.6a1.5 1.5 0 0 1-1.5 1.5H5.9a1.5 1.5 0 0 1-1.5-1.5Z" />
      <path d="M3.2 7.8h17.6v3.7H3.2zM12 7.8v12.8" />
      <path d="M12 7.8H9a2.3 2.3 0 1 1 0-4.6c2.1 0 3 4.6 3 4.6Zm0 0h3a2.3 2.3 0 1 0 0-4.6c-2.1 0-3 4.6-3 4.6Z" />
    </svg>
  );
}

/** Xe giao hàng — ý "giao toàn quốc" */
export function TruckIcon({ className = "size-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${base} ${className}`}
      aria-hidden="true"
      {...stroke}
      strokeWidth={1.9}
    >
      <path d="M2.6 6.6h10.9v10H2.6zM13.5 10.2h3.6l3.3 3.2v3.2h-6.9z" />
      <circle cx="7" cy="18.4" r="1.85" />
      <circle cx="17" cy="18.4" r="1.85" />
    </svg>
  );
}

/** Tạm dừng — dùng cho nút bật/tắt tự chạy của dải banner */
export function PauseIcon({ className = "size-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${base} ${className}`}
      aria-hidden="true"
      fill="currentColor"
    >
      <rect x="6.5" y="5" width="3.6" height="14" rx="1.6" />
      <rect x="13.9" y="5" width="3.6" height="14" rx="1.6" />
    </svg>
  );
}

/** Chạy tiếp */
export function PlayIcon({ className = "size-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${base} ${className}`}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M8.4 5.2a1.3 1.3 0 0 1 1.98-1.11l8.1 5.05a2.2 2.2 0 0 1 0 3.73l-8.1 5.05A1.3 1.3 0 0 1 8.4 16.8Z" />
    </svg>
  );
}
