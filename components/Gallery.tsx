"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { categories, products, type Product } from "@/lib/products";
import {
  docDanhMucTuDiaChi,
  ID_KHU_SAN_PHAM,
  SU_KIEN_CHON_DANH_MUC,
} from "@/lib/category";
import ProductCard from "./ProductCard";
import SectionHeading from "./SectionHeading";
import Lightbox from "./Lightbox";

const ALL = "tat-ca";

/** Id của khung lưới, để mấy nút danh mục khai aria-controls trỏ vào */
const ID_LUOI = "luoi-san-pham";

export default function Gallery() {
  const [active, setActive] = useState<string>(ALL);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const thanhTabRef = useRef<HTMLDivElement>(null);

  // Bấm banner ở dải "Khám phá" thì lọc lưới theo danh mục đó. Nghe hai đường:
  //   - Sự kiện riêng: đường chính, bấm bao nhiêu lần cũng nổ.
  //   - hashchange: để nút Back/Forward của trình duyệt và link chia sẻ sẵn
  //     có dạng "#san-pham=thu-bong" vẫn chạy đúng.
  // Vì sao phải hai đường, xem chú thích đầu file lib/category.ts.
  useEffect(() => {
    const chon = (slug: string) => {
      if (!slug || !categories.some((c) => c.slug === slug)) return;
      setActive(slug);
      setOpenIndex(null);
    };
    const theoDiaChi = () => chon(docDanhMucTuDiaChi());
    const theoSuKien = (e: Event) => chon((e as CustomEvent<string>).detail);

    theoDiaChi(); // mở trang bằng link có sẵn danh mục thì lọc luôn
    window.addEventListener("hashchange", theoDiaChi);
    window.addEventListener(SU_KIEN_CHON_DANH_MUC, theoSuKien);
    return () => {
      window.removeEventListener("hashchange", theoDiaChi);
      window.removeEventListener(SU_KIEN_CHON_DANH_MUC, theoSuKien);
    };
  }, []);

  // Danh sách đang hiển thị — popup cũng chạy trên đúng danh sách này,
  // nên bấm "Tiếp" chỉ chuyển trong danh mục đang chọn.
  const shown: Product[] = useMemo(
    () =>
      active === ALL
        ? products
        : products.filter((p) => p.categorySlug === active),
    [active],
  );

  const tabs = [
    { slug: ALL, name: "Tất cả", count: products.length },
    ...categories,
  ];

  const changeCategory = (slug: string) => {
    setActive(slug);
    setOpenIndex(null); // đổi danh mục thì đóng popup cho khỏi lệch ảnh
  };

  /**
   * Phím mũi tên trái/phải (và Home/End) để đi giữa các danh mục.
   *
   * Thanh này khai role="tablist" nên trình đọc màn hình sẽ hứa với người dùng
   * là điều khiển được bằng mũi tên. Thiếu đoạn này thì lời hứa đó sai. Đi kèm
   * là tabIndex bên dưới: chỉ mục đang chọn nhận phím Tab, để người dùng bấm
   * Tab một cái là qua hẳn thanh danh mục chứ không phải bấm bảy lần.
   */
  const phimTrenTab = (e: React.KeyboardEvent, i: number) => {
    const so = tabs.length;
    let ke: number;
    if (e.key === "ArrowRight") ke = (i + 1) % so;
    else if (e.key === "ArrowLeft") ke = (i - 1 + so) % so;
    else if (e.key === "Home") ke = 0;
    else if (e.key === "End") ke = so - 1;
    else return;

    e.preventDefault();
    changeCategory(tabs[ke].slug);
    thanhTabRef.current
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      [ke]?.focus();
  };

  // Khu sản phẩm dùng nền kem đậm (--bg-alt) + hai đường kẻ trên dưới để tách
  // hẳn khỏi khối "Về shop" ngay bên dưới — trước đó hai phần trôi liền một
  // dải kem, nhìn không rõ đâu là hết sản phẩm. Nền đậm hơn cũng làm thẻ sản
  // phẩm nền trắng nổi rõ hơn.
  return (
    <section
      id={ID_KHU_SAN_PHAM}
      className="border-y-2 border-border bg-bg-alt py-14 md:py-20"
    >
      <div className="mx-auto w-[min(100%-1.75rem,1180px)] sm:w-[min(100%-2.5rem,1180px)]">
        <SectionHeading
          className="mb-10"
          eyebrow="Bộ sưu tập"
          title={
            <>
              Bạn nhỏ nào cũng <span className="marker">dễ thương</span>
            </>
          }
          desc="Bấm vào ảnh để xem lớn hơn — ưng mẫu nào nhắn Zalo hoặc Messenger nhé."
        />

        {/* Thanh danh mục — cuộn ngang được trên điện thoại */}
        <div
          ref={thanhTabRef}
          role="tablist"
          aria-label="Lọc theo danh mục"
          className="no-scrollbar -mx-3.5 mb-10 flex gap-2.5 overflow-x-auto px-3.5 pb-3 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0 sm:pb-0"
        >
          {tabs.map((t, i) => {
            const on = active === t.slug;
            return (
              <button
                key={t.slug}
                type="button"
                role="tab"
                id={`tab-${t.slug}`}
                aria-selected={on}
                // Thiếu aria-controls thì trình đọc màn hình xướng "tab" nhưng
                // không biết nó điều khiển cái gì — nghe như một nút chết.
                aria-controls={ID_LUOI}
                tabIndex={on ? 0 : -1}
                onKeyDown={(e) => phimTrenTab(e, i)}
                onClick={() => changeCategory(t.slug)}
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border-2 px-5 text-[14.5px] font-extrabold transition-[background-color,color,border-color,transform] duration-200 ${
                  on
                    ? "border-ink bg-ink text-bg"
                    : "border-border bg-card hover:-translate-y-0.5 hover:border-ink-soft"
                }`}
              >
                {t.name}
                <span className="text-xs font-bold opacity-60">{t.count}</span>
              </button>
            );
          })}
        </div>

        {/* Khung lưới chính là "tabpanel" mà mấy nút danh mục ở trên điều
            khiển. Khai role + aria-labelledby để trình đọc màn hình nối được
            nút với nội dung nó lọc ra. */}
        <div
          id={ID_LUOI}
          role="tabpanel"
          aria-labelledby={`tab-${active}`}
          className="grid grid-cols-2 gap-3.5 sm:gap-[18px] lg:grid-cols-3 lg:gap-[22px] xl:grid-cols-4 xl:gap-[26px]"
        >
          {shown.map((p, i) => (
            <ProductCard key={p.id} product={p} onOpen={() => setOpenIndex(i)} />
          ))}
        </div>

        <p className="mt-9 text-center text-[14.5px] font-semibold text-ink-soft">
          Đang xem {shown.length} mẫu
          {active !== ALL && " trong danh mục này"} · còn nhiều mẫu khác trên
          Fanpage nữa nha!
        </p>
      </div>

      {openIndex !== null && (
        <Lightbox
          items={shown}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onNavigate={setOpenIndex}
        />
      )}
    </section>
  );
}
