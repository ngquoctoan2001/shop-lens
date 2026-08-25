import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata, Viewport } from "next";
import { Quicksand, Nunito, Playfair_Display } from "next/font/google";
import { site } from "@/site.config";
import LazyImageFix from "@/components/LazyImageFix";
import ChanDoan from "@/components/ChanDoan";
import "./globals.css";

/**
 * Font tiêu đề. Bắt buộc có subset "vietnamese" — thiếu nó thì các chữ
 * ữ ũ ơ ậ ợ sẽ rơi về font dự phòng và trông lệch hẳn (lỗi của Fredoka).
 * Font tròn dễ thương CÓ tiếng Việt: Quicksand, Baloo_2, Comfortaa, Nunito.
 */
const display = Quicksand({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--ff-display",
  display: "swap",
});

/** Font nội dung */
const body = Nunito({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--ff-body",
  display: "swap",
});

/** Font chữ lớn trên banner — serif, có cả kiểu nghiêng */
const banner = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--ff-banner",
  display: "swap",
});

/**
 * Ảnh hiện lên khi ai đó dán link web vào Facebook, Zalo, Messenger.
 *
 * Đang dùng logo shop "Suen mốc len" đặt giữa nền nâu (làm từ
 * anh-goc/images/logo-mark.webp) — đã xuất sẵn đúng cỡ 1200x630 và nằm ở
 * public/og.jpg. Không có ảnh này thì link chia sẻ chỉ hiện một ô xám trống
 * trơ — với shop bán chủ yếu qua Facebook thì đó là mất khách thật. Muốn đổi
 * ảnh khác: thay file public/og.jpg bằng ảnh mới đúng cỡ 1200x630 là xong,
 * không phải sửa code. Nhớ dùng JPG hoặc PNG — Facebook đọc WebP không chắc ăn.
 *
 * Đường dẫn "/og.jpg" được metadataBase nối với site.url thành địa chỉ đầy đủ.
 * Nên site.url trong site.config.ts mà ghi sai tên miền là ảnh chết theo — đó
 * đúng là lỗi đã gặp: trỏ về lennhasuen.pages.dev trong khi web chạy ở
 * shop-lens-ar8.pages.dev.
 *
 * Facebook nhớ ảnh cũ khá lâu; đổi rồi mà chưa thấy thì vào
 * developers.facebook.com/tools/debug dán link vào bấm "Scrape Again".
 * Zalo thì dùng developers.zalo.me/tools/debug-og-tag.
 */
/**
 * Dấu vân tay của chính file public/og.jpg, gắn vào cuối địa chỉ ảnh thành
 * /og.jpg?v=abc12345. Thay ảnh là chuỗi này tự đổi theo, không phải nhớ sửa tay.
 *
 * VÌ SAO CẦN: ngày 24/08 đã thay ảnh mới, đẩy lên đầy đủ, bản build trên
 * Cloudflare Pages cũng có ảnh mới — nhưng link chia sẻ vẫn ra ảnh cũ suốt hơn
 * một ngày. Lý do là địa chỉ /og.jpg không hề đổi, nên hai lớp bộ nhớ đệm nằm
 * giữa cứ trả lại bản chúng giữ từ trước:
 *   1. Bộ đệm biên Cloudflare của tên miền lennhasuen.com
 *   2. Bộ đệm ảnh xem trước của chính Zalo/Facebook
 * Đổi ảnh mà giữ nguyên địa chỉ thì với chúng nó vẫn là "tấm ảnh cũ ấy mà".
 *
 * Gắn vân tay vào là mỗi lần thay ảnh sẽ ra một địa chỉ chưa ai từng thấy,
 * không lớp đệm nào có sẵn để trả về — buộc phải đi lấy bản mới.
 *
 * readFileSync chạy lúc dựng trang chứ không phải lúc khách mở web: khối
 * metadata này Next.js chỉ tính một lần khi build ra file HTML tĩnh.
 */
const vanTayAnh = createHash("sha1")
  .update(readFileSync(join(process.cwd(), "public", "og.jpg")))
  .digest("hex")
  .slice(0, 8);

const DUONG_DAN_ANH = `/og.jpg?v=${vanTayAnh}`;

const ANH_CHIA_SE = {
  url: DUONG_DAN_ANH,
  // Zalo và vài trình đọc cũ chỉ nhận ảnh khi có bản https ghi rõ ràng
  secureUrl: `${site.url}${DUONG_DAN_ANH}`,
  type: "image/jpeg",
  width: 1200,
  height: 630,
  alt: `${site.name} | Suen - Handmade Crochet`,
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Suen - Handmade Crochet`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "đồ len handmade",
    "móc khóa len",
    "thú bông amigurumi",
    "túi len móc tay",
    "hoa len",
    "quà tặng handmade",
    site.name,
  ],
  // Trang chỉ có một địa chỉ duy nhất; khai canonical để máy tìm kiếm khỏi
  // coi "có dấu /" và "không dấu /" là hai trang khác nhau.
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: site.name,
    url: "/",
    title: `${site.name} | Suen - Handmade Crochet`,
    description: site.description,
    images: [ANH_CHIA_SE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | Suen - Handmade Crochet`,
    description: site.description,
    images: [ANH_CHIA_SE],
  },
};

export const viewport: Viewport = {
  themeColor: "#fdf8f3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${display.variable} ${body.variable} ${banner.variable}`}>
      <body className="antialiased">
        {children}
        {/* Không vẽ ra gì cả — chỉ ngồi canh mấy tấm ảnh mà Safari bỏ quên
            không tải. Xem chú thích dài trong chính file đó. */}
        <LazyImageFix />
        {/* ĐỒ TẠM — chỉ hiện khi địa chỉ có "?chan-doan=1". Sửa xong lỗi ảnh
            trên iPhone thì xoá dòng này và xoá file components/ChanDoan.tsx. */}
        <ChanDoan />
      </body>
    </html>
  );
}
