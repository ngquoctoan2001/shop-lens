"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/products";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  FlowerIcon,
  GiftIcon,
  HandmadeIcon,
  PaletteIcon,
  TruckIcon,
} from "./Icons";

type Props = {
  items: Product[];
  index: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
};

/** Bốn điểm cộng khoe trong popup — sửa chữ ở đây là đổi cả bốn ô */
const PERKS = [
  { Icon: HandmadeIcon, label: "Móc tay 100%" },
  { Icon: PaletteIcon, label: "Đổi màu tuỳ ý" },
  { Icon: GiftIcon, label: "Hợp làm quà tặng" },
  { Icon: TruckIcon, label: "Giao toàn quốc" },
];

/** Vuốt ngang quá bao nhiêu px thì tính là chuyển sang mẫu khác */
const SWIPE_X = 52;
/** Kéo tấm thẻ xuống quá bao nhiêu px rồi thả tay thì đóng luôn */
const DISMISS_Y = 118;

export default function Lightbox({ items, index, onClose, onNavigate }: Props) {
  const product = items[index];
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  /** true khi đang ở khổ điện thoại — chỉ khổ này mới cho kéo xuống để đóng */
  const [canDragClose, setCanDragClose] = useState(true);
  /** Số px người dùng đang kéo tấm thẻ xuống */
  const [dragY, setDragY] = useState(0);

  const touchStart = useRef<{ x: number; y: number } | null>(null);
  /** Khoá hướng vuốt từ vài px đầu: ngang thì đổi ảnh, dọc thì kéo tấm thẻ */
  const axis = useRef<"x" | "y" | null>(null);

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

  // Đưa con trỏ bàn phím vào popup ngay khi mở, và trả về chỗ cũ khi đóng.
  //
  // Thiếu vế trả về thì người dùng bàn phím bị bỏ rơi: popup biến mất kéo theo
  // cả nút đang focus, trình duyệt đành thả tiêu điểm về <body> — bấm Tab tiếp
  // là quay lại từ đầu trang, phải rà lại từng nút mới về được chỗ đang xem.
  useEffect(() => {
    const choCu = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => choCu?.focus?.();
  }, []);

  // Dưới 768px thì cho vuốt xuống để đóng; từ md trở lên đã có chuột nên thôi
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setCanDragClose(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Kéo dải ảnh nhỏ sao cho mẫu đang xem luôn nằm giữa tầm mắt
  useEffect(() => {
    const rail = railRef.current;
    const active = rail?.querySelector<HTMLElement>('[data-active="true"]');
    if (!rail || !active) return;
    rail.scrollTo({
      left: active.offsetLeft - rail.clientWidth / 2 + active.clientWidth / 2,
      behavior: "smooth",
    });
  }, [index]);

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

  /* ---- Cử chỉ chạm: vuốt ngang đổi mẫu, vuốt xuống đóng popup ------------ */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    axis.current = null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.touches[0].clientX - touchStart.current.x;
    const dy = e.touches[0].clientY - touchStart.current.y;
    if (!axis.current) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      axis.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }
    if (axis.current === "y" && canDragClose) setDragY(Math.max(0, dy));
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    const dir = axis.current;
    touchStart.current = null;
    axis.current = null;
    setDragY(0);

    if (dir === "x" && Math.abs(dx) > SWIPE_X) (dx > 0 ? goPrev : goNext)();
    else if (dir === "y" && canDragClose && dy > DISMISS_Y) onClose();
  };

  if (!product) return null;

  const many = items.length > 1;
  /** Kéo càng xa thì nền mờ càng nhạt, cho cảm giác tấm thẻ đang rời ra */
  const veil = 1 - Math.min(dragY / 340, 0.55);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-5 md:p-6"
      onKeyDown={onKeyDownTrap}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ten-san-pham-popup"
    >
      {/* Nền mờ — bấm ra ngoài là đóng. Để aria-hidden cho trình đọc màn hình
          khỏi đọc thêm một nút phủ kín màn hình: đã có nút Đóng thật và phím
          Esc rồi. */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={dragY ? { opacity: veil } : undefined}
        className="animate-fade-in absolute inset-0 cursor-zoom-out bg-bg-deep/72 backdrop-blur-md"
      />

      <div
        ref={panelRef}
        style={
          dragY
            ? { transform: `translateY(${dragY}px)`, transition: "none" }
            : undefined
        }
        className="animate-modal-in relative flex max-h-[88svh] w-full flex-col overflow-hidden rounded-[26px] bg-card shadow-[var(--shadow-l)] transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] sm:rounded-[30px] md:max-h-[86svh] md:min-h-[min(470px,86svh)] md:max-w-[940px] md:flex-row md:rounded-[34px]"
      >
        {/* Nút đóng — nằm ở góc trên bên phải của cả tấm thẻ, không nhét trong
            cột ảnh nữa, để trên máy tính nó ra hẳn mép ngoài */}
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute right-2 top-2 z-30 grid size-10 place-items-center rounded-full bg-card/95 text-ink shadow-[var(--shadow-m)] backdrop-blur transition-transform duration-200 hover:scale-110 md:right-4 md:top-4 md:size-11"
        >
          <CloseIcon className="size-[18px] md:size-5" />
        </button>

        {/* ===================== SÂN KHẤU ẢNH ===================== */}
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="relative shrink-0 touch-none bg-bg-alt p-3 md:w-[50%] md:touch-auto md:self-stretch md:p-6"
        >
          {/* Hai mảng màu loang cho nền đỡ phẳng */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-14 -top-16 size-52 rounded-full bg-[var(--blob-2)] opacity-75 blur-3xl"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -right-10 size-56 rounded-full bg-[var(--blob-1)] opacity-75 blur-3xl"
          />

          {/* Khung ảnh viền trắng như tấm hình dán.
              Ảnh sản phẩm có tấm vuông tấm dọc, nên dùng object-contain để lúc
              nào cũng thấy trọn con vật; chỗ trống hai bên lấp bằng chính tấm
              ảnh đó phóng to làm mờ, nhìn mềm hơn là để viền trắng trơ. */}
          {/* .khung-ti-le: ô vuông không cần aspect-ratio — xem globals.css.
              Ruột khung là hai tấm ảnh absolute (bản mờ làm nền + ảnh chính)
              nên cũng thuộc diện Safari cũ tính hụt chiều cao. */}
          <div className="khung-ti-le relative mx-auto w-full max-w-[min(33svh,320px)] overflow-hidden rounded-[22px] bg-bg-alt shadow-[var(--shadow-m)] ring-[3px] ring-white md:absolute md:left-6 md:right-6 md:top-1/2 md:max-h-[calc(100%-3rem)] md:w-auto md:max-w-none md:-translate-y-1/2 md:rounded-[26px]">
            <Image
              key={`nen-${product.imageMini}`}
              /* Bản mini 96px: đằng nào cũng làm mờ tịt nên bé tí là đủ.
                 Trước đây chỗ này trỏ vào ảnh gốc kèm sizes="64px" — nhưng
                 trang xuất web tĩnh thì sizes chẳng có tác dụng gì, nó vẫn
                 tải nguyên tấm mấy trăm KB về chỉ để bôi nhoè. */
              src={product.imageMini}
              alt=""
              aria-hidden="true"
              fill
              sizes="64px"
              className="scale-110 object-cover opacity-55 blur-xl"
            />
            <Image
              key={product.image}
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 767px) 320px, 470px"
              className="animate-photo-in object-contain"
              priority
            />
            {/* Đường khâu nét đứt, cho hợp tông với thẻ sản phẩm ngoài trang */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-2.5 rounded-[15px] border-2 border-dashed border-white/50 md:inset-3.5 md:rounded-[18px]"
            />
          </div>

          {many && (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Mẫu trước"
                className="absolute left-5 top-1/2 z-20 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-card/95 text-ink shadow-[var(--shadow-m)] backdrop-blur transition-transform duration-200 hover:scale-110 md:left-3 md:size-11"
              >
                <ChevronLeftIcon className="size-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Mẫu tiếp theo"
                className="absolute right-5 top-1/2 z-20 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-card/95 text-ink shadow-[var(--shadow-m)] backdrop-blur transition-transform duration-200 hover:scale-110 md:right-3 md:size-11"
              >
                <ChevronRightIcon className="size-5" />
              </button>

              <span className="absolute bottom-[26px] left-1/2 z-20 -translate-x-1/2 rounded-full bg-bg-deep/72 px-3 py-1 text-[11.5px] font-extrabold tabular-nums text-white backdrop-blur md:bottom-10">
                {index + 1} / {items.length}
              </span>
            </>
          )}
        </div>

        {/* ===================== THÔNG TIN ===================== */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
          <div className="px-5 pb-5 pt-4 sm:px-7 sm:pb-7 sm:pt-6">
            <span
              className={`cat-badge cat-${product.categorySlug} mb-3 inline-flex w-fit rounded-full px-3 py-1 text-[11px] font-extrabold sm:text-[11.5px]`}
            >
              {product.categoryName}
            </span>

            <h2
              id="ten-san-pham-popup"
              className="text-[23px] font-bold leading-tight sm:text-[28px] md:text-[30px]"
            >
              {product.name}
            </h2>
            <p className="mt-2 text-[14.5px] font-medium text-ink-soft sm:text-[15.5px]">
              {product.desc}
            </p>

            {/* Bốn ô điểm cộng */}
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {PERKS.map(({ Icon, label }) => (
                <li
                  key={label}
                  className="group/perk flex items-center gap-2.5 rounded-2xl border-2 border-border bg-bg/70 px-2.5 py-2 transition-[transform,border-color,background-color,box-shadow] duration-300 ease-[cubic-bezier(.22,.61,.36,1)] hover:-translate-y-0.5 hover:border-accent hover:bg-card hover:shadow-[var(--shadow-m)] sm:px-3 sm:py-2.5">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-card text-accent-3 shadow-[var(--shadow-s)] transition-[transform,background-color,color] duration-300 ease-[cubic-bezier(.34,1.4,.64,1)] group-hover/perk:-rotate-6 group-hover/perk:scale-110 group-hover/perk:bg-accent group-hover/perk:text-ink">
                    <Icon className="size-[17px]" />
                  </span>
                  <span className="text-[12px] font-extrabold leading-tight transition-colors duration-300 group-hover/perk:text-accent-3 sm:text-[13px]">
                    {label}
                  </span>
                </li>
              ))}
            </ul>

            {/* Ghi chú về giá */}
            <p className="mt-3 flex items-start gap-2.5 rounded-2xl border-2 border-dashed border-accent/60 bg-accent/10 px-3.5 py-3 text-[12.5px] font-bold text-accent-3 sm:text-[13.5px]">
              <FlowerIcon className="mt-[3px] size-3.5 shrink-0 text-accent" />
              <span>
                Nhắn shop để biết giá và thời gian làm nhé — mỗi bé đều được móc
                tay riêng.
              </span>
            </p>

            {/* Dải ảnh nhỏ để nhảy nhanh sang mẫu khác */}
            {many && (
              <div className="mt-5">
                <p className="mb-2 text-[11.5px] font-extrabold uppercase tracking-wider text-ink-soft">
                  Mẫu khác trong danh sách
                </p>
                <div
                  ref={railRef}
                  className="no-scrollbar relative -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:-mx-7 sm:px-7"
                >
                  {items.map((p, i) => (
                    <button
                      key={p.id}
                      type="button"
                      data-active={i === index}
                      onClick={() => onNavigate(i)}
                      aria-label={p.name}
                      aria-current={i === index}
                      className={`relative size-14 shrink-0 overflow-hidden rounded-[15px] border-2 transition-[border-color,transform,opacity] duration-200 sm:size-[60px] ${
                        i === index
                          ? "-translate-y-0.5 border-accent shadow-[var(--shadow-m)]"
                          : "border-border opacity-70 hover:opacity-100"
                      }`}
                    >
                      {/* Bản mini 96px. Chỗ này từng là điểm nặng nhất cả
                          trang: ô chỉ rộng 54px nhưng tải ảnh gốc 1440px, mà
                          ở tab "Tất cả" thì có tới 54 ô như vậy — kéo về gần
                          như trọn bộ thư viện ảnh chỉ để vẽ một dải tí hon. */}
                      <Image
                        src={p.imageMini}
                        alt=""
                        fill
                        loading="lazy"
                        sizes="60px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
