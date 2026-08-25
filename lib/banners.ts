import { categories } from "./products";

/**
 * Danh sách banner cho phần "Chọn nhóm bạn thích" ở trang chủ.
 *
 * Ảnh banner do mình tự tạo bên ngoài (Canva, ChatGPT, Gemini…) rồi thả vào
 * thư mục public/banners/ đúng tên file ghi bên dưới. Chỗ nào chưa có ảnh thì
 * trang chủ hiện một khung trống nhắc tên file cần đặt — bỏ ảnh vào là tự hiện.
 *
 * Prompt để nhờ AI vẽ 6 banner này nằm ở file PROMPT-BANNER.md ngoài thư mục gốc.
 */

export type BannerSlot = {
  /** trùng slug danh mục trong data/products.json */
  slug: string;
  /** tên danh mục hiển thị trên khung trống */
  name: string;
  /** số sản phẩm trong danh mục */
  count: number;
  /** đường dẫn ảnh banner cần đặt */
  image: string;
  /** màu chữ đè lên ảnh — mỗi banner một màu, xem MAU_CHU bên dưới */
  mauChu: string;
  /** câu mô tả ảnh cho thẻ alt — sinh ở lib/products.ts, xem altBanner() */
  alt: string;
};

/**
 * Màu chữ cho tên danh mục nằm đè lên ảnh banner.
 *
 * Trước đây chữ màu trắng nên phải kéo một vệt tối dưới đáy ảnh mới đọc nổi,
 * mà vệt tối ấy lại phủ luôn dòng chữ in sẵn trong ảnh. Bỏ vệt tối, dời chữ
 * lên góc trên bên trái — chỗ duy nhất cả sáu ảnh đều để trống — thì chữ
 * trắng hết đường sống, vì nền ảnh toàn tông pastel sáng.
 *
 * Nên mỗi banner lấy một màu đậm cùng họ với nền của nó: đọc rõ mà không
 * chọi màu. Số ở cuối mỗi dòng là độ tương phản với vùng nền góc trên trái
 * của đúng ảnh đó (WCAG AA cần từ 4.5:1 trở lên).
 *
 * Thay ảnh banner thì nhớ ngó lại màu ở đây.
 */
const MAU_CHU: Record<string, string> = {
  "moc-khoa": "#9b3f63", // nền hồng phấn   → hồng mận   5.3:1
  "thu-bong": "#356a52", // nền xanh bạc hà → xanh rêu   5.4:1
  "tui-vi": "#6b4630", // nền be kem      → nâu cacao  6.6:1
  "quan-ao": "#61468f", // nền tím nhạt    → tím oải hương 6.3:1
  "phu-kien": "#33507f", // nền vàng bơ     → xanh navy  7.0:1
  "hoa-qua-tang": "#a34a34", // nền xanh cốm → đỏ đất    5.3:1
};

/** Thêm danh mục mới mà quên chọn màu thì dùng tạm nâu cacao của trang */
const MAU_CHU_MAC_DINH = "#43301f";

export const bannerSlots: BannerSlot[] = categories.map((c) => ({
  slug: c.slug,
  name: c.name,
  count: c.count,
  image: `/banners/${c.slug}.webp`,
  mauChu: MAU_CHU[c.slug] ?? MAU_CHU_MAC_DINH,
  alt: c.altAnh,
}));

/**
 * Tỉ lệ khung banner: 16:9 — nhưng ghi dưới dạng phần trăm chiều cao so với
 * bề ngang (9 ÷ 16 = 56.25%), vì khung banner dựng chiều cao bằng miếng chêm
 * padding-top chứ không dùng aspect-ratio.
 *
 * Chọn 16:9 vì đây là tỉ lệ ngang rộng nhất mà hầu hết công cụ tạo ảnh bằng AI
 * đều hỗ trợ sẵn (ChatGPT, Gemini, Canva). Ảnh gốc nên là 1920×1080.
 *
 * VÌ SAO KHÔNG PHẢI aspect-ratio: ruột khung banner toàn phần tử absolute
 * (ảnh, vệt sáng, cụm chữ), không có gì trong dòng chảy đẩy khung cao lên.
 * Safari trên iPhone đời cũ gặp cảnh đó thì tính aspect-ratio ra 0 và cả dải
 * banner biến mất. padding phần trăm thì trình duyệt nào cũng tính đúng.
 * Cùng một cách vá với ProductCard, Hero và Lightbox.
 */
export const BANNER_RATIO = "56.25%";
