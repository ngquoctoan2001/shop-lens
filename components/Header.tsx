"use client";

import { useEffect, useRef, useState } from "react";
import { site, zaloLink } from "@/site.config";
import Logo from "./Logo";
import { ChatIcon, CloseIcon, MenuIcon } from "./Icons";

export default function Header() {
  const [stuck, setStuck] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  /** Mục menu đang tô sáng — chính là href của phần trang đang xem */
  const [active, setActive] = useState<string>(site.nav[0].href);
  /** Toạ độ viên thuốc trượt sau menu — null nghĩa là chưa đo được */
  const [thuoc, setThuoc] = useState<{ left: number; width: number } | null>(
    null,
  );
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // Một lần cuộn lo hai việc: đổ bóng cho header, và dò xem đang xem phần nào
  // để tô sáng đúng mục menu.
  useEffect(() => {
    const ids = site.nav.map((n) => n.href.slice(1));

    // Trình duyệt chỉ bắn sự kiện cuộn tối đa một lần mỗi khung hình, nên cứ
    // tính thẳng ở đây, không cần hãm thêm.
    const capNhat = () => {
      setStuck(window.scrollY > 8);

      // Vạch đo nằm ngay dưới header. Phần nào có mép trên đã trôi qua vạch
      // này thì coi như người xem đang ở phần đó.
      const vach = (headerRef.current?.offsetHeight ?? 74) + 24;

      // Cuộn chạm đáy trang thì mục cuối luôn sáng. Thiếu đoạn này thì phần
      // cuối (thấp hơn màn hình) sẽ chẳng bao giờ trôi qua nổi vạch đo.
      const chamDay =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (chamDay) {
        setActive(`#${ids[ids.length - 1]}`);
        return;
      }

      let dangXem = ids[0];
      for (const id of ids) {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        if (top !== undefined && top <= vach) dangXem = id;
      }
      setActive(`#${dangXem}`);
    };

    capNhat();
    window.addEventListener("scroll", capNhat, { passive: true });
    window.addEventListener("resize", capNhat, { passive: true });
    return () => {
      window.removeEventListener("scroll", capNhat);
      window.removeEventListener("resize", capNhat);
    };
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
      ref={headerRef}
      className={`sticky top-0 z-50 backdrop-blur-xl transition-[border-color,box-shadow] duration-250 ${
        stuck
          ? "border-b border-border shadow-[var(--shadow-header)]"
          : "border-b border-transparent"
      }`}
      style={{ background: "color-mix(in srgb, var(--bg) 82%, transparent)" }}
    >
      <div className="mx-auto flex h-[74px] w-[min(100%-2.5rem,1180px)] items-center gap-4">
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
            {site.nav.map((item) => {
              const on = active === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={on ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={`flex min-h-12 items-center rounded-2xl border-2 px-4 text-base font-bold transition-colors ${
                    on
                      ? "border-dashed border-bg-deep/30 bg-accent text-bg-deep"
                      : "border-transparent text-ink hover:bg-bg-alt"
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
            onClick={() => setMenuOpen(false)}
            className="mt-3 flex min-h-[54px] items-center justify-center gap-2.5 rounded-full bg-ink px-6 font-extrabold text-bg"
          >
            <span
              className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-2 text-ink [--chip-bg:var(--accent-2)]"
              aria-hidden="true"
            >
              <ChatIcon className="size-[18px]" />
            </span>
            Nhắn shop qua Zalo
          </a>
        </div>
      )}
    </header>
  );
}
