import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Xuất ra web tĩnh (thư mục "out") để đưa thẳng lên Cloudflare Pages.
  // Trang này không có API route hay server action nên không cần server chạy nền.
  output: "export",

  // Bộ tối ưu ảnh của Next cần server. Web tĩnh thì tắt đi, ảnh phục vụ nguyên bản.
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
