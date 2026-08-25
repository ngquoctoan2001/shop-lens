import raw from "@/data/products.json";
import { site } from "@/site.config";

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
  /** Câu mô tả ảnh, dùng cho thẻ alt ở mọi chỗ bày sản phẩm — xem altSanPham() */
  alt: string;
};

export type Category = {
  slug: string;
  name: string;
  desc: string;
  count: number;
  /** Câu mô tả ảnh banner của danh mục — xem altBanner() */
  altAnh: string;
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

/* ==================================================================
 *  ALT ẢNH — câu mô tả đọc cho người khiếm thị và cho Google Ảnh
 * ==================================================================
 *
 * Trước đây mỗi chỗ bày ảnh tự đặt alt lấy, mà đặt bằng đúng tên sản phẩm:
 * alt="Thỏ Mơ Váy Nâu". Hỏng ở cả hai đầu:
 *
 *   - Người dùng trình đọc màn hình nghe "Thỏ Mơ Váy Nâu" thì không biết
 *     đang xem cái gì — con thỏ thật? tranh vẽ? Không có từ nào nói đây là
 *     đồ len, là móc khóa.
 *   - Google Ảnh cũng vậy. Người ta gõ "móc khóa len thỏ handmade", mà cả
 *     54 tấm ảnh không tấm nào có chữ "len" trong alt, nên không tấm nào ra.
 *     Với shop bán đồ thủ công thì Google Ảnh là cửa vào lớn — mất là mất
 *     thật.
 *
 * Nên giờ alt sinh tự động ở đây, một công thức chung cho cả trang:
 *
 *     "{Loại hàng}: {Tên}, {mô tả} — {tên shop}"
 *     "Móc khóa len handmade: Thỏ Mơ Váy Nâu, thỏ nhỏ mặc váy nâu, kèm dây
 *      đeo tết tay — lennhasuen"
 *
 * VÌ SAO LOẠI HÀNG ĐỨNG TRƯỚC, KHÔNG PHẢI TÊN: đó mới là cụm người ta gõ đi
 * tìm. Tên sản phẩm ("Thỏ Mơ Váy Nâu") là chữ shop tự đặt, không ai gõ.
 *
 * VÌ SAO CÓ DẤU HAI CHẤM: nhiều tên sản phẩm đã mang sẵn tên loại — "Túi Rút
 * Dâu Tây", "Áo Gile Kem", "Ví Cầm Tay Nâu". Ghép thẳng thành "Túi ví len móc
 * tay Túi Rút Dâu Tây" thì lặp từ, đọc lên rất kỳ. Dấu hai chấm biến cụm đầu
 * thành cái nhãn phân loại chứ không phải một phần của tên, nên có lặp cũng
 * đọc thuận: "Túi ví len móc tay: Túi Rút Dâu Tây, ...".
 *
 * VÌ SAO GẮN TÊN SHOP: để Google Ảnh nối được ảnh với thương hiệu. Chỉ gắn
 * cho ảnh SẢN PHẨM thôi — ảnh banner danh mục thì không, kẻo cả trang chỗ nào
 * cũng "lennhasuen" thành ra nhồi từ khóa, Google trừ điểm chứ không cộng.
 *
 * Độ dài ra chừng 85–110 ký tự, nằm gọn dưới mức ~125 ký tự mà vài trình đọc
 * màn hình đời cũ cắt ngang.
 */

/**
 * Cụm từ gọi tên loại hàng, đứng đầu alt.
 *
 * Viết tay từng dòng chứ không ghép máy móc từ `name` của danh mục, vì bản
 * `name` là chữ cho người xem chứ không phải cụm người ta đi tìm:
 *
 *   - "Móc khóa & Charm" có dấu & và chữ "Charm" — không ai gõ.
 *   - "Thú bông Amigurumi" thiếu chữ "len" là chữ quan trọng nhất.
 *   - "Quần áo", "Phụ kiện" trống không, chẳng nói lên đồ gì.
 *
 * Riêng "Móc khóa len handmade" CỐ Ý không có "móc tay" như mấy dòng khác:
 * "móc khóa len móc tay" đọc lên ba chữ "móc" liền nhau, vừa rối vừa giống
 * nhồi từ khóa.
 *
 * Còn "Hoa len & quà tặng handmade" giữ đủ cả hai vế vì nhóm này chứa cả bó
 * hoa lẫn lót ly, doll cưới — gọi trống là "Hoa len" thì mấy món kia thành ra
 * bị tả sai, mà alt tả sai còn hại hơn alt nghèo.
 *
 * Thêm danh mục mới trong data/products.json thì nhớ thêm một dòng ở đây,
 * quên thì rơi về LOAI_MAC_DINH — vẫn chạy, chỉ là kém riêng.
 */
const LOAI_ANH: Record<string, string> = {
  "moc-khoa": "Móc khóa len handmade",
  "thu-bong": "Thú bông len amigurumi",
  "tui-vi": "Túi ví len móc tay",
  "quan-ao": "Áo len móc tay",
  "phu-kien": "Phụ kiện len móc tay",
  "hoa-qua-tang": "Hoa len & quà tặng handmade",
};

/** Danh mục chưa khai ở LOAI_ANH thì dùng tạm cụm chung này */
const LOAI_MAC_DINH = "Đồ len móc tay handmade";

function loaiHang(slug: string): string {
  return LOAI_ANH[slug] ?? LOAI_MAC_DINH;
}

/**
 * Sửa câu mô tả cho ghép được vào giữa alt: hạ chữ đầu xuống thường và cắt
 * dấu chấm lửng ở đuôi.
 *
 * Cắt dấu chấm là vì có mô tả kết thúc bằng "..." ("dâu, cà tím, bắp, nấm...")
 * — để nguyên thì alt thành "...nấm... — lennhasuen", nhìn như câu bị cụt.
 */
function noiTiep(desc: string): string {
  const s = desc.trim().replace(/[.…]+$/u, "");
  return s.charAt(0).toLowerCase() + s.slice(1);
}

/** Alt cho ảnh một sản phẩm — dùng chung cho lưới, đầu trang và popup */
function altSanPham(name: string, desc: string, slug: string): string {
  return `${loaiHang(slug)}: ${name}, ${noiTiep(desc)} — ${site.name}`;
}

/**
 * Alt cho ảnh banner của một danh mục.
 *
 * Không gắn tên shop (lý do ở khối chú thích trên), và không có tên sản phẩm
 * nào để ghép — nên lấy chính câu giới thiệu danh mục làm phần tả:
 * "Móc khóa len handmade — bạn nhỏ xinh xắn treo túi, treo chìa khóa, treo balo"
 *
 * Chỗ này không có dấu hai chấm làm nhãn như alt sản phẩm, nên ghép thẳng là
 * lặp thấy rõ: danh mục "Quần áo" có câu giới thiệu mở đầu đúng bằng cụm loại
 * hàng, ra thành "Áo len móc tay — áo len móc tay, nhận đặt theo số đo". Câu
 * giới thiệu nào đã mở đầu bằng cụm loại rồi thì bỏ luôn cụm đi, tự nó đã đủ
 * chữ khóa: "Áo len móc tay, nhận đặt theo số đo".
 */
function altBanner(slug: string, desc: string): string {
  const loai = loaiHang(slug);
  const ta = noiTiep(desc);
  if (ta.startsWith(loai.toLowerCase())) {
    return ta.charAt(0).toUpperCase() + ta.slice(1);
  }
  return `${loai} — ${ta}`;
}

/** Toàn bộ sản phẩm, đã làm phẳng và gắn kèm thông tin danh mục */
export const products: Product[] = rawCategories.flatMap((c) =>
  c.products.map((p) => ({
    ...p,
    imageThumb: coAnh(p.image, "thumb"),
    imageMini: coAnh(p.image, "mini"),
    categoryName: c.name,
    categorySlug: c.slug,
    alt: altSanPham(p.name, p.desc, c.slug),
  })),
);

/** Danh sách danh mục kèm số lượng sản phẩm */
export const categories: Category[] = rawCategories.map((c) => ({
  slug: c.slug,
  name: c.name,
  desc: c.desc,
  count: c.products.length,
  altAnh: altBanner(c.slug, c.desc),
}));

export const totalProducts = products.length;

/**
 * Vài sản phẩm nổi bật cho phần đầu trang.
 * Lấy theo id để ảnh hero luôn ổn định, không đổi khi thêm sản phẩm mới.
 */
export const heroProducts: Product[] = ["tb-08", "mk-16", "hq-02"]
  .map((id) => products.find((p) => p.id === id))
  .filter((p): p is Product => Boolean(p));
