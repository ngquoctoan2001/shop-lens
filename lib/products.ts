import raw from "@/data/products.json";

export type Product = {
  id: string;
  name: string;
  desc: string;
  image: string;
  /** Tên danh mục chứa sản phẩm — gắn thêm khi làm phẳng danh sách */
  categoryName: string;
  categorySlug: string;
};

export type Category = {
  slug: string;
  name: string;
  desc: string;
  count: number;
};

type RawCategory = {
  slug: string;
  name: string;
  emoji?: string;
  desc: string;
  products: { id: string; name: string; desc: string; image: string }[];
};

const rawCategories = raw.categories as RawCategory[];

/** Toàn bộ sản phẩm, đã làm phẳng và gắn kèm thông tin danh mục */
export const products: Product[] = rawCategories.flatMap((c) =>
  c.products.map((p) => ({
    ...p,
    categoryName: c.name,
    categorySlug: c.slug,
  })),
);

/** Danh sách danh mục kèm số lượng sản phẩm */
export const categories: Category[] = rawCategories.map((c) => ({
  slug: c.slug,
  name: c.name,
  desc: c.desc,
  count: c.products.length,
}));

export const totalProducts = products.length;

/**
 * Vài sản phẩm nổi bật cho phần đầu trang.
 * Lấy theo id để ảnh hero luôn ổn định, không đổi khi thêm sản phẩm mới.
 */
export const heroProducts: Product[] = ["tb-08", "mk-16", "hq-02"]
  .map((id) => products.find((p) => p.id === id))
  .filter((p): p is Product => Boolean(p));
