"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import type { Product } from "@/lib/products";
import { fbLink, zaloDisplay, zaloLink } from "@/site.config";
import {
  ChatIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  MessengerIcon,
} from "./Icons";

type Props = {
  items: Product[];
  index: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
};

export default function Lightbox({ items, index, onClose, onNavigate }: Props) {
  const product = items[index];
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);

  const goPrev = useCallback(
    () => onNavigate((index - 1 + items.length) % items.length),
    [index, items.length, onNavigate],
  );
  const goNext = useCallback(
    () => onNavigate((index + 1) % items.length),
    [index, items.length, onNavigate],
  );

  // Phím tắt: Esc đóng, mũi tên trái/phải chuyển ảnh
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, goPrev, goNext]);

  // Khoá cuộn trang nền trong lúc popup đang mở
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, []);

  // Đưa con trỏ bàn phím vào popup ngay khi mở
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Giữ tiêu điểm bàn phím quẩn quanh trong popup, không lọt ra trang nền
  const onKeyDownTrap = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusables = panelRef.current.querySelectorAll<HTMLElement>(
      'button, a[href], [tabindex]:not([tabindex="-1"])',
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  // Vuốt trái/phải trên điện thoại để chuyển ảnh
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 55) (dx > 0 ? goPrev : goNext)();
    touchStartX.current = null;
  };

  if (!product) return null;

  return (
    <div
      className="animate-fade-in fixed inset-0 z-[100] flex items-center justify-center overscroll-contain bg-bg-deep/72 p-3 backdrop-blur-md sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={onKeyDownTrap}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ten-san-pham-popup"
    >
      <div
        ref={panelRef}
        className="animate-fade-up relative flex max-h-[94svh] w-full max-w-[880px] flex-col overflow-hidden rounded-[28px] bg-card shadow-[var(--shadow-l)] sm:rounded-[36px] md:flex-row"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute right-3 top-3 z-20 grid size-11 place-items-center rounded-full bg-card/92 text-ink shadow-[var(--shadow-m)] backdrop-blur transition-transform hover:scale-105"
        >
          <CloseIcon className="size-5" />
        </button>

        {/* Ảnh */}
        <div className="relative aspect-square w-full shrink-0 bg-bg-alt md:aspect-auto md:w-[52%] md:self-stretch">
          <Image
            key={product.image}
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 460px"
            className="animate-fade-in object-cover"
            priority
          />
        </div>

        {/* Thông tin + nút liên hệ */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-5 sm:p-7">
          <span className="mb-3 inline-flex w-fit items-center rounded-full bg-bg-alt px-3.5 py-1.5 text-[11.5px] font-extrabold uppercase tracking-wider text-accent-3">
            {product.categoryName}
          </span>

          <h2
            id="ten-san-pham-popup"
            className="text-[26px] font-semibold sm:text-[32px]"
          >
            {product.name}
          </h2>
          <p className="mt-2.5 font-medium text-ink-soft">{product.desc}</p>

          <ul className="mt-5 space-y-2 border-t-2 border-dashed border-border pt-5 text-[14.5px] font-semibold text-ink-soft">
            <li className="flex gap-2">
              <span className="text-accent">✿</span> Móc tay thủ công 100%
            </li>
            <li className="flex gap-2">
              <span className="text-accent">✿</span> Đổi màu len theo ý bạn
            </li>
            <li className="flex gap-2">
              <span className="text-accent">✿</span> Nhắn shop để biết giá và thời gian làm
            </li>
          </ul>

          <div className="mt-auto flex flex-col gap-2.5 pt-6">
            <a
              href={zaloLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0068FF] px-6 font-extrabold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.02]"
            >
              <ChatIcon />
              Nhắn Zalo · {zaloDisplay}
            </a>
            <a
              href={fbLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-border bg-card px-6 font-extrabold transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-ink-soft"
            >
              <MessengerIcon />
              Nhắn Messenger
            </a>
          </div>

          {/* Chuyển ảnh trước / sau */}
          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <button
              type="button"
              onClick={goPrev}
              className="inline-flex min-h-11 items-center gap-1 rounded-full px-3 font-extrabold text-ink-soft transition-colors hover:bg-bg-alt hover:text-ink"
            >
              <ChevronLeftIcon className="size-5" />
              Trước
            </button>
            <span className="text-[13px] font-bold tabular-nums text-ink-soft">
              {index + 1} / {items.length}
            </span>
            <button
              type="button"
              onClick={goNext}
              className="inline-flex min-h-11 items-center gap-1 rounded-full px-3 font-extrabold text-ink-soft transition-colors hover:bg-bg-alt hover:text-ink"
            >
              Tiếp
              <ChevronRightIcon className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
