"use client";

import { useMemo, useState } from "react";
import { categories, products, type Product } from "@/lib/products";
import ProductCard from "./ProductCard";
import Lightbox from "./Lightbox";

const ALL = "tat-ca";

export default function Gallery() {
  const [active, setActive] = useState<string>(ALL);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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

  return (
    <section id="san-pham" className="py-14 md:py-20">
      <div className="mx-auto w-[min(100%-1.75rem,1180px)] sm:w-[min(100%-2.5rem,1180px)]">
        <div className="mx-auto mb-10 max-w-[620px] text-center">
          <span className="mb-3 inline-block text-[12.5px] font-extrabold uppercase tracking-[0.19em] text-accent-3">
            Bộ sưu tập
          </span>
          <h2 className="text-[clamp(29px,4vw,44px)] font-semibold tracking-[-0.025em]">
            Bạn nhỏ nào cũng dễ thương
          </h2>
          <p className="mt-3.5 font-medium text-ink-soft">
            Bấm vào ảnh để xem lớn hơn — ưng mẫu nào nhắn Zalo hoặc Messenger nhé.
          </p>
        </div>

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
