"use client";

import { useEffect, useState } from "react";
import { zaloLink } from "@/site.config";
import Logo from "./Logo";
import { ChatIcon, CloseIcon, MenuIcon } from "./Icons";

const NAV = [
  { label: "Trang chủ", href: "#top" },
  { label: "Sản phẩm", href: "#san-pham" },
  { label: "Về shop", href: "#ve-shop" },
  { label: "Liên hệ", href: "#lien-he" },
];

export default function Header() {
  const [stuck, setStuck] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Đổi viền + đổ bóng cho header khi người dùng cuộn xuống
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Đang mở menu mà bấm Esc thì đóng lại
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-xl transition-[border-color,box-shadow] duration-250 ${
        stuck
          ? "border-b border-border shadow-[var(--shadow-s)]"
          : "border-b border-transparent"
      }`}
      style={{ background: "color-mix(in srgb, var(--bg) 82%, transparent)" }}
    >
      <div className="mx-auto flex h-[74px] w-[min(100%-2.5rem,1180px)] items-center gap-4">
        <Logo className="mr-auto" />

        <nav className="hidden md:flex md:gap-1" aria-label="Điều hướng chính">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2.5 text-[15px] font-bold text-ink-soft transition-colors hover:bg-bg-alt hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href={zaloLink}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden min-h-11 items-center gap-2 rounded-full bg-ink px-6 py-3 text-[15px] font-extrabold text-bg shadow-[var(--shadow-m)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[var(--shadow-l)] md:inline-flex"
        >
          <ChatIcon />
          Nhắn shop
        </a>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="menu-dien-thoai"
          aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
          className="grid size-11 place-items-center rounded-[14px] border-2 border-border bg-card text-ink transition-colors hover:border-ink-soft md:hidden"
        >
          {menuOpen ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
        </button>
      </div>

      {/* Menu thả xuống trên điện thoại */}
      {menuOpen && (
        <div
          id="menu-dien-thoai"
          className="animate-fade-up border-t border-border bg-bg px-5 pb-5 pt-3 md:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Điều hướng điện thoại">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex min-h-12 items-center rounded-2xl px-4 text-base font-bold text-ink transition-colors hover:bg-bg-alt"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href={zaloLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 font-extrabold text-bg"
          >
            <ChatIcon />
            Nhắn shop qua Zalo
          </a>
        </div>
      )}
    </header>
  );
}
