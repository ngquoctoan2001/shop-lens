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
};

export const bannerSlots: BannerSlot[] = categories.map((c) => ({
  slug: c.slug,
  name: c.name,
  count: c.count,
  image: `/banners/${c.slug}.jpg`,
}));

/**
 * Tỉ lệ khung banner: 16:9.
 *
 * Chọn 16:9 vì đây là tỉ lệ ngang rộng nhất mà hầu hết công cụ tạo ảnh bằng AI
 * đều hỗ trợ sẵn (ChatGPT, Gemini, Canva). Ảnh gốc nên là 1920×1080.
 */
export const BANNER_RATIO = "16 / 9";
