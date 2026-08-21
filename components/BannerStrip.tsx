import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import SectionHeading from "./SectionHeading";
import { ArrowRightIcon } from "./Icons";
import { bannerSlots, BANNER_RATIO } from "@/lib/banners";

/**
 * Dải banner theo danh mục, cuộn ngang. Bấm vào một banner thì nhảy xuống
 * phần sản phẩm — việc lọc đúng danh mục do Gallery lo, dựa vào dấu # trên
 * địa chỉ trang.
 *
 * Ảnh banner tự làm bên ngoài (Canva, ChatGPT, Gemini…) rồi thả vào thư mục
 * public/banners/. Chỗ nào chưa có ảnh thì hiện khung nét đứt nhắc tên file
 * cần đặt — bỏ ảnh vào là tự hiện, không phải sửa code.
 * Prompt nhờ AI vẽ 6 banner nằm ở PROMPT-BANNER.md ngoài thư mục gốc.
 */

/** Ảnh đã nằm trong public/ chưa (kiểm tra lúc dựng trang) */
function anhDaCo(publicPath: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", publicPath));
  } catch {
    return false;
  }
}

export default function BannerStrip() {
  const slots = bannerSlots.map((s) => ({ ...s, coAnh: anhDaCo(s.image) }));
  const soConThieu = slots.filter((s) => !s.coAnh).length;

  return (
    <section className="pb-8 pt-14 md:pb-10 md:pt-20">
      <SectionHeading
        className="mb-9 w-[min(100%-1.75rem,1180px)] sm:w-[min(100%-2.5rem,1180px)]"
        eyebrow="Khám phá"
        title={
          <>
            Chọn <span className="marker">nhóm bạn thích</span>
          </>
        }
      />

      {/* Cuộn ngang, thò nhẹ tấm kế bên để người xem biết còn nữa */}
      <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-[max(0.875rem,calc((100vw-1180px)/2))] pb-4 sm:gap-5">
        {slots.map((s) => (
          <a
            key={s.slug}
            href={`#san-pham=${s.slug}`}
            aria-label={`Xem nhóm ${s.name} — ${s.count} mẫu`}
            className="group relative w-[78vw] shrink-0 snap-center overflow-hidden rounded-[24px] shadow-[var(--shadow-m)] transition-transform duration-300 hover:-translate-y-1 sm:w-[52vw] sm:rounded-[32px] lg:w-[42vw] xl:w-[560px]"
            style={{ aspectRatio: BANNER_RATIO }}
          >
            {s.coAnh ? (
              <>
                <Image
                  src={s.image}
                  alt={s.name}
                  fill
                  sizes="(max-width: 640px) 78vw, (max-width: 1024px) 52vw, 560px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                {/* Vệt tối ở đáy để chữ đọc được trên mọi kiểu ảnh */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/60 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
                  <div>
                    <h3 className="text-lg font-bold text-white drop-shadow-sm sm:text-xl">
                      {s.name}
                    </h3>
                    <p className="text-[13px] font-bold text-white/90">
                      {s.count} mẫu
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
                <h3 className="text-lg font-bold sm:text-xl">{s.name}</h3>
                <p className="text-[13px] font-semibold text-ink-soft">
                  {s.count} mẫu
                </p>
                <code className="mt-1 rounded-lg bg-card px-2.5 py-1 font-mono text-[11px] font-bold text-ink-soft sm:text-xs">
                  public{s.image}
                </code>
              </div>
            )}
          </a>
        ))}
      </div>

      {/* Nhắc nhở chỉ hiện lúc chạy trên máy, khách vào web thật không thấy */}
      {process.env.NODE_ENV === "development" && soConThieu > 0 && (
        <p className="mx-auto mt-2 w-[min(100%-1.75rem,1180px)] text-center text-[13px] font-semibold text-ink-soft sm:w-[min(100%-2.5rem,1180px)]">
          Còn thiếu {soConThieu}/{slots.length} ảnh banner — hướng dẫn tạo ảnh
          nằm trong file <code className="font-mono">PROMPT-BANNER.md</code>
        </p>
      )}
    </section>
  );
}
