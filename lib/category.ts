/**
 * Cầu nối giữa dải banner ("Khám phá") và lưới sản phẩm ("Bộ sưu tập").
 *
 * Hai khối này nằm ở hai nhánh khác nhau của trang nên không truyền prop cho
 * nhau được. Trước đây chúng nói chuyện qua địa chỉ trang: banner trỏ tới
 * "#san-pham=thu-bong", lưới sản phẩm nghe sự kiện hashchange. Cách đó hỏng
 * ở hai chỗ:
 *
 *   1. Không cuộn xuống. Trình duyệt tìm phần tử có id đúng bằng cả cụm
 *      "san-pham=thu-bong" — không có phần tử nào tên vậy (id thật chỉ là
 *      "san-pham") nên nó đứng im. Người xem bấm banner mà tưởng web đơ,
 *      trong khi lưới đã lọc đúng danh mục ở tít dưới 1400px.
 *   2. Bấm lại lần hai không ăn. Địa chỉ đang sẵn là "#san-pham=thu-bong",
 *      đặt lại đúng chuỗi ấy thì hashchange không nổ, lưới không đổi gì.
 *
 * Nên giờ tách làm hai đường:
 *   - Sự kiện riêng (dưới đây) là đường chính, bấm bao nhiêu lần cũng nổ.
 *   - Địa chỉ trang chỉ còn để ghi lại lựa chọn, phục vụ chia sẻ link và tải
 *     lại trang. Lưới vẫn nghe hashchange để nút Back/Forward chạy đúng.
 */

/** Tên sự kiện phát trên window mỗi lần người xem chọn một danh mục */
export const SU_KIEN_CHON_DANH_MUC = "chon-danh-muc";

/** Dấu ngăn giữa id phần trang và slug danh mục: "#san-pham=thu-bong" */
const NGAN = "=";

/** Id của khối lưới sản phẩm, cũng là chỗ cần cuộn tới */
export const ID_KHU_SAN_PHAM = "san-pham";

/** Đọc slug danh mục từ địa chỉ trang. Không có thì trả về chuỗi rỗng. */
export function docDanhMucTuDiaChi(): string {
  if (typeof window === "undefined") return "";
  return window.location.hash.split(NGAN)[1] ?? "";
}

/**
 * Chọn một danh mục: ghi vào địa chỉ, báo cho lưới sản phẩm, rồi cuộn xuống.
 * Gọi từ chỗ nào cũng được, miễn là đang chạy trên trình duyệt.
 */
export function chonDanhMuc(slug: string): void {
  // replaceState chứ không gán window.location.hash: gán hash sẽ nhét thêm
  // một mục vào lịch sử duyệt, bấm Back mấy lần mới thoát nổi khỏi trang.
  window.history.replaceState(
    null,
    "",
    `#${ID_KHU_SAN_PHAM}${NGAN}${slug}`,
  );

  window.dispatchEvent(
    new CustomEvent<string>(SU_KIEN_CHON_DANH_MUC, { detail: slug }),
  );

  // Gọi trần không kèm behavior để CSS quyết định cuộn mượt hay cuộn thẳng:
  // globals.css đặt scroll-behavior mượt cho cả trang, nhưng tắt đi khi máy
  // bật "giảm chuyển động". Ghi cứng behavior:"smooth" ở đây là đè mất cài
  // đặt đó của người dùng.
  document.getElementById(ID_KHU_SAN_PHAM)?.scrollIntoView();
}
