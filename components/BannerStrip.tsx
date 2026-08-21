import fs from "node:fs";
import path from "node:path";
import SectionHeading from "./SectionHeading";
import BannerCarousel, { type BannerCard } from "./BannerCarousel";
import { bannerSlots } from "@/lib/banners";

/**
 * Dải banner theo danh mục. Bấm vào một banner thì nhảy xuống phần sản phẩm —
 * việc lọc đúng danh mục do Gallery lo, dựa vào dấu # trên địa chỉ trang.
 *
 * File này chạy phía máy chủ: chỉ lo dò xem ảnh đã có chưa rồi giao dữ liệu
 * cho BannerCarousel — phần tự chạy và lướt tay nằm hết bên đó.
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
  const cards: BannerCard[] = bannerSlots.map((s) => ({
    ...s,
    coAnh: anhDaCo(s.image),
  }));
  const soConThieu = cards.filter((c) => !c.coAnh).length;

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

      <BannerCarousel cards={cards} />

      {/* Nhắc nhở chỉ hiện lúc chạy trên máy, khách vào web thật không thấy */}
      {process.env.NODE_ENV === "development" && soConThieu > 0 && (
        <p className="mx-auto mt-2 w-[min(100%-1.75rem,1180px)] text-center text-[13px] font-semibold text-ink-soft sm:w-[min(100%-2.5rem,1180px)]">
          Còn thiếu {soConThieu}/{cards.length} ảnh banner — hướng dẫn tạo ảnh
          nằm trong file <code className="font-mono">PROMPT-BANNER.md</code>
        </p>
      )}
    </section>
  );
}
