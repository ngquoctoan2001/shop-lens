import { categories } from "@/lib/products";

const STEPS = [
  {
    n: "01",
    title: "Chọn mẫu bạn thích",
    body: "Ngắm trong bộ sưu tập, hoặc gửi shop ảnh mẫu bạn tìm thấy ở đâu đó cũng được.",
  },
  {
    n: "02",
    title: "Nhắn shop chốt màu",
    body: "Nói shop nghe màu len, kích thước, tặng dịp nào. Shop báo giá và thời gian làm.",
  },
  {
    n: "03",
    title: "Shop móc và gửi đi",
    body: "Móc xong shop chụp ảnh cho bạn duyệt trước, ưng rồi mới đóng gói gửi đi.",
  },
];

export default function About() {
  return (
    <section id="ve-shop" className="py-14 md:py-20">
      <div className="mx-auto w-[min(100%-1.75rem,1180px)] sm:w-[min(100%-2.5rem,1180px)]">
        <div className="mx-auto mb-10 max-w-[620px] text-center">
          <span className="mb-3 inline-block text-[12.5px] font-extrabold uppercase tracking-[0.19em] text-accent-3">
            Đặt hàng thế nào
          </span>
          <h2 className="text-[clamp(29px,4vw,44px)] font-semibold tracking-[-0.025em]">
            Ba bước là có bạn nhỏ của riêng mình
          </h2>
        </div>

        <ol className="grid gap-4 md:grid-cols-3 md:gap-6">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="relative rounded-[26px] border-2 border-border bg-card p-6 shadow-[var(--shadow-s)] sm:rounded-[32px] sm:p-7"
            >
              <span
                aria-hidden="true"
                className="mb-4 grid size-12 place-items-center rounded-2xl bg-bg-alt font-display text-xl font-semibold text-accent-3"
              >
                {s.n}
              </span>
              <h3 className="mb-2 text-xl font-semibold">{s.title}</h3>
              <p className="font-medium text-ink-soft">{s.body}</p>
            </li>
          ))}
        </ol>

        {/* Điểm qua các danh mục */}
        <div className="mt-10 flex flex-wrap justify-center gap-2.5">
          {categories.map((c) => (
            <span
              key={c.slug}
              className="inline-flex items-center gap-2 rounded-full border-2 border-dashed border-border bg-card px-4 py-2.5 text-[14px] font-bold"
            >
              {c.name}
              <span className="text-xs font-extrabold text-accent-3">{c.count}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
