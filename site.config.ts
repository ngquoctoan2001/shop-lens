/**
 * ================================================================
 *  CẤU HÌNH SHOP — sửa mọi thứ ở file này, không cần đụng vào code
 * ================================================================
 */

export const site = {
  /** Tên shop hiển thị trên header, footer, tab trình duyệt */
  name: "lennhasuen",
  /** Dòng chữ nhỏ nằm dưới tên shop */
  tagline: "Handmade Crochet",
  /** Mô tả ngắn — dùng cho SEO và khi chia sẻ link lên Facebook/Zalo */
  description:
    "Tiệm len nhỏ móc tay từng chiếc: móc khóa, thú bông, túi ví, hoa len và quà tặng. Nhận đặt móc theo yêu cầu.",
  /**
   * Địa chỉ thật của web. Dùng cho thẻ chia sẻ Facebook/Zalo, sitemap và
   * robots.txt — sai chỗ này là ảnh xem trước lúc chia sẻ link không hiện.
   *
   * Đang để tên miền miễn phí của Cloudflare Pages. Mua tên miền riêng
   * (vd "https://lennhasuen.vn") thì sửa đúng một dòng này, mọi chỗ khác
   * tự ăn theo.
   */
  url: "https://lennhasuen.pages.dev",

  /** Các mục điều hướng — dùng chung cho menu đầu trang và chân trang */
  nav: [
    { label: "Trang chủ", href: "#top" },
    { label: "Sản phẩm", href: "#san-pham" },
    { label: "Về shop", href: "#ve-shop" },
    { label: "Liên hệ", href: "#lien-he" },
  ],

  contact: {
    /** Số Zalo — chỉ ghi số, không dấu cách */
    zalo: "0969634653",
    /** Link Facebook / Messenger của shop */
    facebook: "https://www.facebook.com/xuyen.huynh.94801116",
  },

  /** Ba con số khoe ở màn hình đầu tiên */
  stats: [
    { value: "54+", label: "Mẫu đã làm" },
    { value: "100%", label: "Móc tay thủ công" },
    { value: "Free", label: "Thiết kế theo ý bạn" },
  ],

  /** Các câu chạy vòng trên dải băng nghiêng */
  marquee: [
    "Móc tay 100%",
    "Nhận custom theo ý bạn",
    "Quà tặng sinh nhật",
    "Hoa len không héo",
    "Giao toàn quốc",
  ],
} as const;

/** Link mở cửa sổ chat Zalo */
export const zaloLink = `https://zalo.me/${site.contact.zalo}`;
/** Link Facebook / Messenger */
export const fbLink = site.contact.facebook;

/** Số điện thoại có dấu cách cho dễ đọc: 0969 634 653 */
export const zaloDisplay = site.contact.zalo.replace(
  /(\d{4})(\d{3})(\d{3})/,
  "$1 $2 $3",
);
