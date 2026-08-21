"use client";

import type { ComponentType } from "react";
import { site } from "@/site.config";
import { useMucDangXem } from "@/lib/muc-dang-xem";
import { BagIcon, HomeIcon, MessageIcon, ShopIcon, YarnIcon } from "./Icons";

/**
 * Thanh điều hướng nổi ở đáy màn hình điện thoại — thay cho nút 3 gạch cũ.
 *
 * Bốn mục luôn nằm sẵn trong tầm ngón cái, không phải bấm mở rồi mới chọn.
 * Mục đang xem tự sáng lên theo lúc cuộn, dùng chung cách dò với menu máy
 * tính (xem lib/muc-dang-xem.ts) nên hai bên không bao giờ lệch nhau.
 *
 * Từ md trở lên thì ẩn hẳn — chỗ đó đã có menu ngang trên header.
 */

/** Icon của từng mục, tra theo href khai trong site.config */
const ICON: Record<string, ComponentType<{ className?: string }>> = {
  "#top": HomeIcon,
  "#san-pham": BagIcon,
  "#ve-shop": ShopIcon,
  "#lien-he": MessageIcon,
};

export default function BottomNav() {
  const active = useMucDangXem();

  return (
    // Lớp bọc không ăn chuột, chỉ mình thanh bên trong mới bấm được — nhờ vậy
    // phần trang lộ ra hai bên thanh vẫn cuộn/bấm bình thường.
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 md:hidden">
      <nav
        aria-label="Điều hướng nhanh"
        // Nền lấy từ lớp .nen-thanh-duoi trong globals.css — xem chú thích ở
        // đó về dòng dự phòng cho Safari cũ.
        className="nen-thanh-duoi pointer-events-auto mx-auto flex w-[min(100%-1.5rem,420px)] gap-1 rounded-[26px] border-2 border-border p-1.5 shadow-[var(--shadow-l)] backdrop-blur-xl"
        style={{
          // Chừa chỗ cho thanh vuốt của iPhone; máy không có thì lấy 12px
          marginBottom: "max(12px, env(safe-area-inset-bottom))",
        }}
      >
        {site.nav.map((item) => {
          const Icon = ICON[item.href] ?? YarnIcon;
          const on = active === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              aria-current={on ? "page" : undefined}
              className={`relative flex min-h-[52px] flex-1 basis-0 flex-col items-center justify-center gap-1 rounded-[20px] text-[11px] font-bold leading-none transition-colors duration-200 ${
                on ? "bg-accent text-bg-deep" : "text-ink-soft active:bg-bg-alt"
              }`}
            >
              {/* Nét khâu đứt trong viên đang sáng — cùng mô-típ với menu máy tính */}
              {on && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-[3px] rounded-[17px] border border-dashed border-bg-deep/30"
                />
              )}
              <Icon className="relative size-[22px]" />
              <span className="relative">{item.label}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}
