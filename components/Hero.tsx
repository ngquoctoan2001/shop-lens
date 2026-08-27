import Image from "next/image";
import { site } from "@/site.config";
import { heroProducts, totalProducts } from "@/lib/products";
import { FlowerIcon } from "./Icons";

/** Vị trí của 3 tấm ảnh lơ lửng bên phải */
const FLOAT_POS = [
  "w-[53%] top-[4%] left-[6%] -rotate-6 [animation-delay:0s]",
  "w-[40%] top-[44%] right-[2%] rotate-[7deg] [animation-delay:-2s]",
  "w-[44%] bottom-[2%] left-[16%] rotate-[4deg] [animation-delay:-4s]",
];

export default function Hero() {
  const stats = site.stats.map((s) =>
    s.label === "Mẫu đã làm" ? { ...s, value: `${totalProducts}+` } : s,
  );

  return (
    <div id="top" className="neo-muc relative overflow-hidden pb-10 pt-10 md:pt-16">
      {/* Ba mảng màu loang làm nền */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[130px] -top-[140px] size-[440px] rounded-full opacity-75 blur-[52px]"
        style={{ background: "var(--blob-1)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[120px] top-[120px] size-[380px] rounded-full opacity-75 blur-[52px]"
        style={{ background: "var(--blob-2)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[140px] left-[38%] size-[300px] rounded-full opacity-75 blur-[52px]"
        style={{ background: "var(--blob-3)" }}
      />

      <div className="relative z-10 mx-auto grid w-[min(100%-2.5rem,1180px)] items-center gap-9 md:grid-cols-[1.05fr_0.95fr] md:gap-10">
        {/* --- Ảnh: cho lên trước trên điện thoại, sang phải trên máy tính --- */}
        {/* .khung-ti-le giữ khung vuông thay cho aspect-square — xem
            app/globals.css. Cụm này còn dễ sập hơn thẻ sản phẩm: mảng nền,
            dòng chữ "made with love" và cả ba tấm ảnh lơ lửng đều absolute,
            khung mà mất chiều cao là màn hình đầu tiên trắng trơn. */}
        <div className="khung-ti-le relative order-first mx-auto w-full max-w-[400px] md:order-last md:max-w-[480px]">
          <div
            aria-hidden="true"
            className="absolute inset-[8%] bg-bg-alt shadow-[inset_0_0_0_2px_var(--border)]"
            style={{ borderRadius: "46% 54% 50% 50% / 52% 48% 52% 48%" }}
          />
          <span className="absolute left-[-2%] top-[34%] z-30 inline-flex -rotate-[9deg] items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 font-display text-[13px] font-semibold text-bg shadow-[var(--shadow-m)]">
            <FlowerIcon className="size-3 text-accent" />
            made with love
          </span>

          {heroProducts.map((p, i) => (
            <figure
              key={p.id}
              className={`animate-bob absolute m-0 overflow-hidden rounded-[26px] bg-card p-2 shadow-[var(--shadow-l)] ${FLOAT_POS[i]}`}
            >
              {/* Bản thumb 500px: ba tấm này hiện rộng nhất cũng chỉ ~254px,
                  nên 500px đã dư cho màn hình nét gấp đôi. Tấm đầu là ảnh to
                  nhất người xem thấy khi vừa mở trang nên để priority, trình
                  duyệt sẽ tải nó trước mọi thứ khác. */}
              <Image
                src={p.imageThumb}
                alt={p.alt}
                width={480}
                height={480}
                priority={i === 0}
                sizes="(max-width: 768px) 45vw, 260px"
                className="aspect-square rounded-[19px] object-cover"
              />
            </figure>
          ))}
        </div>

        {/* --- Phần chữ --- */}
        <div>
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border-2 border-dashed border-accent bg-card px-4 py-2 text-[13.5px] font-extrabold shadow-[var(--shadow-s)]">
            <i className="animate-pulse-dot size-2 rounded-full bg-accent" aria-hidden="true" />
            Nhận đặt móc theo yêu cầu
          </span>

          <h1 className="text-[clamp(38px,5.6vw,66px)] font-bold tracking-[-0.03em]">
            {/* Ngắt sẵn ba dòng. Cứ để trình duyệt tự xuống dòng thì chữ
                "bạn" rớt lại một mình ở dòng cuối, nhìn rất lẻ. */}
            Từng mũi len,
            <br />
            <span className="marker">gói trọn iu thương</span>
            <br />
            gửi bạn
          </h1>

          <p className="my-5 max-w-[47ch] text-[clamp(16px,1.9vw,19px)] font-medium text-ink-soft">
            Móc khóa, thú bông, túi ví, hoa len… tất cả đều móc tay từng chiếc.
            Thích mẫu nào nhắn shop một tiếng là có ngay nha!
          </p>

          <dl className="mt-8 flex flex-wrap gap-x-7 gap-y-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-[26px] font-semibold leading-tight">
                  {s.value}
                </dd>
                <span aria-hidden="true" className="text-[13px] font-bold text-ink-soft">
                  {s.label}
                </span>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
