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
   * PHẢI GÕ ĐÚNG TÊN MIỀN ĐANG CHẠY. Trước đây chỗ này ghi
   * "https://lennhasuen.pages.dev" trong khi web nằm ở shop-lens-ar8.pages.dev,
   * nên thẻ og:image trỏ về một tên miền không tồn tại: Zalo và Facebook đi lấy
   * ảnh không được, link chia sẻ chỉ còn chữ, mất tấm ảnh thú bông.
   *
   * Đang chạy trên tên miền riêng lennhasuen.com (mua ở PA Vietnam, DNS do
   * Cloudflare quản, web vẫn nằm trên Cloudflare Pages). Địa chỉ cũ
   * shop-lens-ar8.pages.dev vẫn sống và trỏ về cùng một web — nhưng chỗ này
   * phải ghi tên miền chính, vì nó là link canonical báo cho Google biết đâu
   * mới là bản thật, tránh bị tính hai trang trùng nội dung.
   *
   * Đổi tên miền lần nữa thì sửa đúng một dòng này, mọi chỗ khác tự ăn theo.
   * Không có dấu / ở cuối.
   */
  url: "https://lennhasuen.com",

  /** Các mục điều hướng — dùng chung cho menu đầu trang và chân trang */
  nav: [
    { label: "Giới thiệu", href: "#top" },
    { label: "Sản phẩm", href: "#san-pham" },
    { label: "Về shop", href: "#ve-shop" },
    { label: "Liên hệ", href: "#lien-he" },
  ],

  contact: {
    /** Số Zalo — chỉ ghi số, không dấu cách */
    zalo: "0969634653",
    /** Link Facebook / Messenger của shop */
    facebook: "https://www.facebook.com/xuyen.huynh.94801116",
    /** Link Instagram của shop */
    instagram: "https://www.instagram.com/lennhasuen/",
    /** Link TikTok của shop */
    tiktok: "https://www.tiktok.com/@lennhasuen",
    /** Gian hàng Shopee của shop */
    shopee: "https://shopee.vn/lennhasuen",
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
/** Link Instagram */
export const igLink = site.contact.instagram;
/** Link TikTok */
export const ttLink = site.contact.tiktok;
/** Link Shopee */
export const shopeeLink = site.contact.shopee;

/** Số điện thoại có dấu cách cho dễ đọc: 0969 634 653 */
export const zaloDisplay = site.contact.zalo.replace(
  /(\d{4})(\d{3})(\d{3})/,
  "$1 $2 $3",
);
