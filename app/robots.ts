import type { MetadataRoute } from "next";
import { site } from "@/site.config";

/**
 * Sinh ra file /robots.txt lúc build — chỗ máy tìm kiếm (Google, Bing, Cốc Cốc)
 * ghé vào đầu tiên để hỏi được phép đọc những gì.
 *
 * Viết bằng file .ts chứ không đặt sẵn robots.txt trong public/ vì địa chỉ web
 * lấy từ site.config.ts. Đổi tên miền ở đó là file này tự đúng theo, khỏi phải
 * nhớ có một chỗ nữa cần sửa tay.
 */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
