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
  /** Đổi thành tên miền thật khi lên web, vd "https://lennhasuen.vn" */
  url: "https://lennhasuen.vn",

  /** Băng chữ chạy trên cùng trang */
  announcement: "Nhận đặt móc theo yêu cầu · Giao toàn quốc",

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
