import SectionHeading from "./SectionHeading";

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
    <section id="ve-shop" className="neo-muc py-14 md:py-20">
      <div className="mx-auto w-[min(100%-1.75rem,1180px)] sm:w-[min(100%-2.5rem,1180px)]">
        <SectionHeading
          className="mb-10"
          eyebrow="Đặt hàng thế nào"
          title={
            <>
              <span className="marker">Ba bước</span> là có bạn nhỏ của riêng
              mình
            </>
          }
        />

        {/* Số nằm bên trái, căn giữa theo chiều dọc so với cụm chữ bên phải */}
        <ol className="grid gap-4 md:grid-cols-3 md:gap-6">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="relative flex items-center gap-4 rounded-[26px] border-2 border-border bg-card p-5 shadow-[var(--shadow-s)] sm:gap-5 sm:rounded-[32px] sm:p-6"
            >
              <span
                aria-hidden="true"
                className="grid size-12 shrink-0 place-items-center rounded-2xl bg-bg-alt font-display text-xl font-bold text-accent-3 sm:size-14"
              >
                {s.n}
              </span>
              <div className="min-w-0">
                <h3 className="mb-1.5 text-xl font-bold text-accent-3 underline decoration-accent/70 decoration-dashed decoration-[1.5px] underline-offset-[5px]">
                  {s.title}
                </h3>
                <p className="font-medium text-ink-soft">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
