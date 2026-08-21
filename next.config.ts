import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Xuất ra web tĩnh (thư mục "out") để đưa thẳng lên Cloudflare Pages.
  // Trang này không có API route hay server action nên không cần server chạy nền.
  output: "export",

  // Bộ tối ưu ảnh của Next cần một máy chủ Node đứng sau để cắt ảnh theo yêu
  // cầu. Web tĩnh không có máy chủ nào cả, nên phải tắt.
  //
  // HỆ QUẢ CẦN NHỚ: tắt cái này thì <Image> KHÔNG sinh srcset nữa — trình duyệt
  // tải đúng file mình đưa cho nó, không tự chọn bản nhỏ hơn. Prop `sizes` rải
  // trong các component vì vậy hiện không có tác dụng gì; giữ lại là để phòng
  // sau này chuyển sang máy chủ có bộ tối ưu thì chúng đã đúng sẵn.
  //
  // Việc thu nhỏ ảnh do scripts/toi-uu-anh.py lo, sinh sẵn ba cỡ (96 / 500 /
  // 1000px) rồi mỗi chỗ tự trỏ vào đúng cỡ của mình — xem lib/products.ts.
  images: { unoptimized: true },

  // Mỗi trang thành một thư mục có index.html — Cloudflare Pages phục vụ chuẩn nhất kiểu này.
  trailingSlash: true,

  // Chốt thư mục gốc là chính project này. Không có dòng này Next.js sẽ dò
  // ngược lên thư mục Home và cảnh báo vì thấy lockfile lạ ở đó.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
