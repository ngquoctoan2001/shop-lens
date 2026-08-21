"use client";

import { useEffect, useMemo, useState } from "react";
import { categories, products, type Product } from "@/lib/products";
import ProductCard from "./ProductCard";
import SectionHeading from "./SectionHeading";
import Lightbox from "./Lightbox";

const ALL = "tat-ca";

export default function Gallery() {
  const [active, setActive] = useState<string>(ALL);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Bấm một banner ở dải trên sẽ đổi địa chỉ thành "#san-pham=thu-bong".
  // Đọc phần sau dấu "=" để lọc đúng danh mục đó.
  useEffect(() => {
    const applyHash = () => {
      const slug = window.location.hash.split("=")[1];
      if (slug && categories.some((c) => c.slug === slug)) {
        setActive(slug);
        setOpenIndex(null);
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
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

  // Khu sản phẩm dùng nền kem đậm (--bg-alt) + hai đường kẻ trên dưới để tách
  // hẳn khỏi khối "Về shop" ngay bên dưới — trước đó hai phần trôi liền một
  // dải kem, nhìn không rõ đâu là hết sản phẩm. Nền đậm hơn cũng làm thẻ sản
  // phẩm nền trắng nổi rõ hơn.
  return (
    <section
      id="san-pham"
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
          role="tablist"
          aria-label="Lọc theo danh mục"
          className="no-scrollbar -mx-3.5 mb-10 flex gap-2.5 overflow-x-auto px-3.5 pb-3 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0 sm:pb-0"
        >
          {tabs.map((t) => {
            const on = active === t.slug;
            return (
              <button
                key={t.slug}
                type="button"
                role="tab"
                aria-selected={on}
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

        <div className="grid grid-cols-2 gap-3.5 sm:gap-[18px] lg:grid-cols-3 lg:gap-[22px] xl:grid-cols-4 xl:gap-[26px]">
          {shown.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              eager={i < 8}
              onOpen={() => setOpenIndex(i)}
            />
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
