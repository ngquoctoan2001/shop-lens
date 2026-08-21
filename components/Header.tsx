"use client";

import { useEffect, useRef, useState } from "react";
import { site, zaloLink } from "@/site.config";
import { useMucDangXem } from "@/lib/muc-dang-xem";
import Logo from "./Logo";
import { ChatIcon } from "./Icons";

export default function Header() {
  const [stuck, setStuck] = useState(false);
  /** Toạ độ viên thuốc trượt sau menu — null nghĩa là chưa đo được */
  const [thuoc, setThuoc] = useState<{ left: number; width: number } | null>(
    null,
  );
  const navRef = useRef<HTMLElement>(null);
  /** Mục menu đang tô sáng — dùng chung cách dò với thanh nổi trên điện thoại */
  const active = useMucDangXem();

  // Cuộn khỏi mép trên thì header đổ bóng, tách khỏi nội dung phía sau.
  useEffect(() => {
    const capNhat = () => setStuck(window.scrollY > 8);

    capNhat();
    window.addEventListener("scroll", capNhat, { passive: true });
    return () => window.removeEventListener("scroll", capNhat);
  }, []);

  // Đo xem mục đang sáng nằm ở đâu, rộng bao nhiêu, để viên thuốc trượt tới
  // đúng chỗ. Phải đo bằng JS vì mỗi mục một bề rộng chữ khác nhau.
  useEffect(() => {
    const doThuoc = () => {
      const muc = navRef.current?.querySelector<HTMLAnchorElement>(
        'a[aria-current="page"]',
      );
      // Màn hình nhỏ thì menu này bị ẩn, bề rộng đo ra 0 — lúc đó giấu viên
      // thuốc đi, không vẽ một cục méo mó ở góc.
      if (!muc || muc.offsetWidth === 0) return setThuoc(null);
      setThuoc({ left: muc.offsetLeft, width: muc.offsetWidth });
    };

    doThuoc();
    // Font Quicksand tải xong thì chữ đổi bề rộng, phải đo lại
    document.fonts?.ready.then(doThuoc);
    window.addEventListener("resize", doThuoc, { passive: true });
    return () => window.removeEventListener("resize", doThuoc);
  }, [active]);

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-xl transition-[border-color,box-shadow] duration-250 ${
        stuck
          ? "border-b border-border shadow-[var(--shadow-header)]"
          : "border-b border-transparent"
      }`}
      style={{ background: "color-mix(in srgb, var(--bg) 82%, transparent)" }}
    >
      {/* Chiều cao lấy từ --cao-header trong globals.css chứ không ghi thẳng
          74px ở đây: chỗ nhảy tới mục menu (.neo-muc) và chỗ dò mục đang xem
          đều phải biết header cao bao nhiêu. Ba nơi cùng đọc một biến thì sửa
          một chỗ là khớp hết, khỏi lo quên. */}
      <div className="mx-auto flex h-[var(--cao-header,74px)] w-[min(100%-2.5rem,1180px)] items-center gap-4">
        <Logo className="mr-auto" priority />

        <nav
          ref={navRef}
          className="relative hidden md:flex md:gap-1"
          aria-label="Điều hướng chính"
        >
          {/* Viên thuốc hồng trượt từ mục này sang mục kia. Nằm dưới chữ nên
              chỉ cần một cái cho cả thanh menu, không phải mỗi mục một cái. */}
          {thuoc && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 z-0 rounded-full bg-accent shadow-[var(--shadow-m)] transition-[left,width] duration-[420ms] ease-[cubic-bezier(.34,1.4,.64,1)]"
              style={{ left: thuoc.left, width: thuoc.width }}
            >
              {/* Nét khâu đứt bên trong — cùng mô-típ với thẻ sản phẩm */}
              <span className="absolute inset-[3px] rounded-full border border-dashed border-bg-deep/30" />
            </span>
          )}

          {site.nav.map((item) => {
            const on = active === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={on ? "page" : undefined}
                className={`relative z-[1] rounded-full px-4 py-2.5 text-[15px] font-bold transition-colors duration-250 ${
                  on
                    ? "text-bg-deep"
                    : "text-ink-soft hover:bg-bg-alt hover:text-ink"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <a
          href={zaloLink}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden min-h-12 items-center gap-2.5 rounded-full bg-ink py-2 pl-2 pr-5 text-[15px] font-extrabold text-bg shadow-[var(--shadow-m)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[var(--shadow-l)] md:inline-flex"
        >
          <span
            className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-2 text-ink [--chip-bg:var(--accent-2)]"
            aria-hidden="true"
          >
            <ChatIcon className="size-[18px]" />
          </span>
          Nhắn shop
        </a>
      </div>
    </header>
  );
}
