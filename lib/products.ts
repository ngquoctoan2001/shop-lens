import raw from "@/data/products.json";

export type Product = {
  id: string;
  name: string;
  desc: string;
  /** Bản 1000px — ảnh lớn trong popup xem chi tiết */
  image: string;
  /** Bản 500px — lưới sản phẩm và ba ảnh lơ lửng ở đầu trang */
  imageThumb: string;
  /** Bản 96px — dải ảnh nhỏ trong popup và mảng nền mờ phía sau ảnh lớn */
  imageMini: string;
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

/**
 * Đổi "/images/abc.webp" thành "/images/thumb/abc.webp".
 *
 * Trang xuất ra web tĩnh nên bộ thu nhỏ ảnh của Next.js không chạy — thẻ
 * <Image> phục vụ nguyên file được đưa cho nó, không tự chọn cỡ nhỏ hơn.
 * Vì vậy ba cỡ ảnh phải làm sẵn bằng scripts/toi-uu-anh.py, và chỗ nào cần
 * cỡ nào thì tự trỏ đúng vào cỡ đó. Hàm này giữ việc ghép đường dẫn ở một
 * nơi duy nhất, đổi tên thư mục sau này chỉ phải sửa ở đây.
 */
function coAnh(image: string, co: "thumb" | "mini"): string {
  const cat = image.lastIndexOf("/");
  return `${image.slice(0, cat)}/${co}${image.slice(cat)}`;
}

/** Toàn bộ sản phẩm, đã làm phẳng và gắn kèm thông tin danh mục */
export const products: Product[] = rawCategories.flatMap((c) =>
  c.products.map((p) => ({
    ...p,
    imageThumb: coAnh(p.image, "thumb"),
    imageMini: coAnh(p.image, "mini"),
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
