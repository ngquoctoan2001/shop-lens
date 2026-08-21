import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Chốt thư mục gốc là chính project này. Không có dòng này Next.js sẽ dò
  // ngược lên thư mục Home và cảnh báo vì thấy lockfile lạ ở đó.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
