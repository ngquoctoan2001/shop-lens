"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BANNER_RATIO } from "@/lib/banners";
import { ArrowRightIcon, PauseIcon, PlayIcon } from "./Icons";

export type BannerCard = {
  slug: string;
  name: string;
  count: number;
  image: string;
  /** ảnh đã nằm trong public/banners/ chưa — kiểm tra lúc dựng trang */
  coAnh: boolean;
};

/** Bao lâu thì tự sang tấm kế tiếp */
const DOI_SAU = 5000;
/** Lướt tay xong thì nghỉ chừng này rồi mới tự chạy tiếp */
const NGHI_SAU_KHI_LUOT = 8000;

/**
 * Dải banner tự đổi tấm, nhưng vẫn lướt tay hoặc kéo chuột được bình thường.
 *
 * Ruột vẫn là khung cuộn ngang thật của trình duyệt (overflow-x-auto +
 * scroll-snap) chứ không phải transform giả lập. Nhờ vậy vuốt trên điện thoại
 * có đà trượt tự nhiên, bàn di chuột hai ngón vẫn chạy, phím Tab vẫn tới được
 * từng banner. Phần viết thêm chỉ có hai việc: hẹn giờ cuộn sang tấm kế, và
 * cho kéo bằng chuột — vì chuột không tự kéo được khung cuộn.
 *
 * Tự chạy sẽ ngưng khi: rê chuột/focus vào, đang lướt (và 8 giây sau đó), dải
 * banner trôi khỏi màn hình, người xem bấm nút dừng, hoặc máy đang bật chế độ
 * "giảm chuyển động".
 */
export default function BannerCarousel({ cards }: { cards: BannerCard[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);

  const [batTuChay, setBatTuChay] = useState(true); // nút dừng/chạy
  const [reVao, setReVao] = useState(false); // rê chuột hoặc focus vào
  const [vuaLuot, setVuaLuot] = useState(false); // vừa lướt tay / kéo chuột
  const [trongTam, setTrongTam] = useState(true); // còn nằm trong màn hình
  const [giamChuyenDong, setGiamChuyenDong] = useState(false);

  const dangTuChay =
    cards.length > 1 &&
    batTuChay &&
    !reVao &&
    !vuaLuot &&
    trongTam &&
    !giamChuyenDong;

  /** Lề trái của khung cuộn. Dải banner trải sát mép nên hiện bằng 0 — đọc
   *  từ CSS chứ không ghi cứng, sau này thụt vào lại thì khỏi sửa chỗ này. */
  const leTrai = (track: HTMLElement) =>
    parseFloat(getComputedStyle(track).paddingLeft) || 0;

  /* --- Cuộn tới tấm thứ i, cho mép trái nó về sát lề trái khung ---
     Không canh vào GIỮA khung cuộn được: khung rộng hết màn hình nên canh
     giữa là banner nhảy lệch hẳn so với lúc đứng yên (màn 1920 lệch 302px). */
  const den = useCallback((i: number) => {
    const track = trackRef.current;
    const tam = track?.children[i] as HTMLElement | undefined;
    if (!track || !tam) return;
    track.scrollTo({ left: tam.offsetLeft - leTrai(track), behavior: "smooth" });
  }, []);

  /* --- Đang xem tấm nào: lấy tấm có mép trái gần chỗ đang cuộn nhất --- */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let cho = 0;
    const doLai = () => {
      cancelAnimationFrame(cho);
      cho = requestAnimationFrame(() => {
        const le = leTrai(track);
        let gan = 0;
        let lechIt = Infinity;

        Array.from(track.children).forEach((con, i) => {
          const el = con as HTMLElement;
          const lech = Math.abs(el.offsetLeft - le - track.scrollLeft);
          if (lech < lechIt) {
            lechIt = lech;
            gan = i;
          }
        });

        indexRef.current = gan;
        setIndex(gan);
      });
    };

    doLai();
    track.addEventListener("scroll", doLai, { passive: true });
    return () => {
      cancelAnimationFrame(cho);
      track.removeEventListener("scroll", doLai);
    };
  }, []);

  /* --- Hẹn giờ tự đổi tấm --- */
  useEffect(() => {
    if (!dangTuChay) return;
    const hen = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;

      const le = leTrai(track);
      const cuoiDuong = track.scrollWidth - track.clientWidth;
      const dich = (i: number) =>
        Math.min((track.children[i] as HTMLElement).offsetLeft - le, cuoiDuong);

      let ke = (indexRef.current + 1) % cards.length;
      // Màn rộng xem được mấy tấm một lúc, nên mấy tấm cuối lùi không hết cỡ
      // về lề được — chỗ dừng của chúng trùng nhau. Cứ đổi tiếp thì banner
      // đứng im nguyên một nhịp 5 giây. Gặp vậy thì quay luôn về tấm đầu.
      if (ke !== 0 && Math.abs(dich(ke) - track.scrollLeft) < 8) ke = 0;

      // Ghi số thứ tự ngay tại đây chứ không đợi sự kiện cuộn báo về. Đợi thì
      // nhịp sau vẫn thấy số cũ và nhắm lại đúng tấm vừa rồi — banner đứng ì
      // một chỗ. Người xem tự lướt thì sự kiện cuộn sẽ chỉnh lại cho khớp.
      indexRef.current = ke;
      setIndex(ke);
      den(ke);
    }, DOI_SAU);
    return () => clearInterval(hen);
  }, [dangTuChay, cards.length, den]);

  /* --- Máy đang bật "giảm chuyển động" thì không tự chạy --- */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const doc = () => setGiamChuyenDong(mq.matches);
    doc();
    mq.addEventListener("change", doc);
    return () => mq.removeEventListener("change", doc);
  }, []);

  /* --- Trôi khỏi màn hình thì thôi chạy cho đỡ tốn --- */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const theoDoi = new IntersectionObserver(
      ([o]) => setTrongTam(o.isIntersecting),
      { threshold: 0.2 },
    );
    theoDoi.observe(track);
    return () => theoDoi.disconnect();
  }, []);

  /* --- Kéo bằng chuột. Cảm ứng thì trình duyệt tự lo, khỏi đụng vào --- */
  const keo = useRef({ dang: false, tuX: 0, tuScroll: 0, daDiChuyen: false });
  const hoiSuc = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(hoiSuc.current), []);

  const batDauLuot = (e: React.PointerEvent<HTMLDivElement>) => {
    clearTimeout(hoiSuc.current);
    setVuaLuot(true);

    if (e.pointerType !== "mouse") return;
    const track = trackRef.current;
    if (!track) return;
    keo.current = {
      dang: true,
      tuX: e.clientX,
      tuScroll: track.scrollLeft,
      daDiChuyen: false,
    };
    // Kéo tay mà vẫn bật scroll-snap thì nó giật về liên tục, tắt tạm.
    track.style.scrollSnapType = "none";
    // Nhả chuột quá nhanh thì con trỏ không còn để mà giữ — kệ, kéo vẫn chạy
    try {
      track.setPointerCapture(e.pointerId);
    } catch {
      /* không giữ được con trỏ thì thôi */
    }
  };

  const dangLuot = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!keo.current.dang) return;
    const track = trackRef.current;
    if (!track) return;
    const lech = e.clientX - keo.current.tuX;
    if (Math.abs(lech) > 4) keo.current.daDiChuyen = true;
    track.scrollLeft = keo.current.tuScroll - lech;
  };

  const thoiLuot = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (keo.current.dang && track) {
      keo.current.dang = false;
      if (track.hasPointerCapture(e.pointerId)) {
        track.releasePointerCapture(e.pointerId);
      }
      // Bật snap lại là trình duyệt tự bắt về tấm gần nhất.
      track.style.scrollSnapType = "";
    }
    hoiSuc.current = setTimeout(() => setVuaLuot(false), NGHI_SAU_KHI_LUOT);
  };

  /** Kéo xong chuột nhả ra hay dính vào banner, chặn kẻo nhảy trang oan */
  const chanBamNham = (e: React.MouseEvent) => {
    if (!keo.current.daDiChuyen) return;
    keo.current.daDiChuyen = false;
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      onMouseEnter={() => setReVao(true)}
      onMouseLeave={() => setReVao(false)}
      onFocusCapture={() => setReVao(true)}
      onBlurCapture={() => setReVao(false)}
    >
      <div
        ref={trackRef}
        onPointerDown={batDauLuot}
        onPointerMove={dangLuot}
        onPointerUp={thoiLuot}
        onPointerCancel={thoiLuot}
        onClickCapture={chanBamNham}
        onDragStart={(e) => e.preventDefault()}
        className="no-scrollbar flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto pb-4 active:cursor-grabbing sm:gap-5"
      >
        {cards.map((c, i) => (
          <a
            key={c.slug}
            href={`#san-pham=${c.slug}`}
            aria-label={`Xem nhóm ${c.name} — ${c.count} mẫu`}
            className="group relative w-[78vw] shrink-0 snap-start overflow-hidden rounded-[24px] shadow-[var(--shadow-m)] transition-transform duration-300 hover:-translate-y-1 sm:w-[52vw] sm:rounded-[32px] lg:w-[42vw]"
            style={{ aspectRatio: BANNER_RATIO }}
          >
            {c.coAnh ? (
              <>
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  // Banner tự đổi sau 5 giây nên ba tấm đầu phải tải sẵn, để
                  // lười tải thì tới lượt nó mới tải, người xem thấy ô trống
                  // chớp một cái. Ba tấm sau cứ để tải khi cuộn gần tới.
                  priority={i === 0}
                  loading={i < 3 ? "eager" : "lazy"}
                  draggable={false}
                  sizes="(max-width: 640px) 78vw, (max-width: 1024px) 52vw, 560px"
                  className="select-none object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                {/* Vệt tối ở đáy để chữ đọc được trên mọi kiểu ảnh */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/60 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
                  <div>
                    <h3 className="text-lg font-bold text-white drop-shadow-sm sm:text-xl">
                      {c.name}
                    </h3>
                    <p className="text-[13px] font-bold text-white/90">
                      {c.count} mẫu
                    </p>
                  </div>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/90 text-ink transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRightIcon className="size-[18px]" />
                  </span>
                </div>
              </>
            ) : (
              /* --- Khung trống chờ thả ảnh vào --- */
              <div className="flex h-full flex-col items-center justify-center gap-2 border-[3px] border-dashed border-border bg-bg-alt p-5 text-center">
                <span className="rounded-full border-2 border-dashed border-accent bg-card px-3.5 py-1.5 text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-accent-3">
                  Chưa có ảnh
                </span>
                <h3 className="text-lg font-bold sm:text-xl">{c.name}</h3>
                <p className="text-[13px] font-semibold text-ink-soft">
                  {c.count} mẫu
                </p>
                <code className="mt-1 rounded-lg bg-card px-2.5 py-1 font-mono text-[11px] font-bold text-ink-soft sm:text-xs">
                  public{c.image}
                </code>
              </div>
            )}
          </a>
        ))}
      </div>

      {/* --- Hàng chấm + nút dừng --- */}
      {cards.length > 1 && (
        <div className="mx-auto flex w-[min(100%-1.75rem,1180px)] items-center justify-center gap-1 sm:w-[min(100%-2.5rem,1180px)]">
          {cards.map((c, i) => {
            const dangXem = i === index;
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => {
                  clearTimeout(hoiSuc.current);
                  setVuaLuot(true);
                  hoiSuc.current = setTimeout(
                    () => setVuaLuot(false),
                    NGHI_SAU_KHI_LUOT,
                  );
                  den(i);
                }}
                aria-label={`Xem banner ${c.name}`}
                aria-current={dangXem ? "true" : undefined}
                // Chấm chỉ cao 8px, nhưng nút bọc ngoài cao 44px cho dễ bấm
                className="grid h-11 place-items-center px-2"
              >
                <span
                  className={`block h-2 overflow-hidden rounded-full transition-[width,background-color] duration-300 ${
                    dangXem ? "w-8 bg-border" : "w-2 bg-border hover:bg-ink-soft"
                  }`}
                >
                  {dangXem && (
                    <span
                      // Đổi key để vạch chạy lại từ đầu mỗi lần sang tấm mới
                      key={`${index}-${dangTuChay}`}
                      className={`block h-full rounded-full bg-accent-3 ${
                        dangTuChay ? "banner-progress" : "w-full"
                      }`}
                    />
                  )}
                </span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setBatTuChay((v) => !v)}
            aria-label={batTuChay ? "Dừng tự chuyển banner" : "Tự chuyển banner"}
            className="ml-1 grid size-11 place-items-center rounded-full text-ink-soft transition-[background-color,color] duration-200 hover:bg-bg-alt hover:text-ink"
          >
            {batTuChay ? <PauseIcon /> : <PlayIcon />}
          </button>
        </div>
      )}
    </div>
  );
}
