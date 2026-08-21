import type { MetadataRoute } from "next";
import { site } from "@/site.config";

/**
 * Sinh ra file /sitemap.xml lúc build — danh sách các trang muốn máy tìm kiếm
 * ghé thăm. Web này chỉ có đúng một trang, mọi phần khác đều là mục neo (#)
 * trong cùng trang đó nên danh sách chỉ có một dòng.
 *
 * Thêm trang thật sau này (vd /bang-gia/) thì chép thêm một khối như bên dưới.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${site.url}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
