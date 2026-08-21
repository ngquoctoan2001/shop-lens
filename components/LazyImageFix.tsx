"use client";

import { useEffect } from "react";

/**
 * Vá lỗi ảnh `loading="lazy"` không chịu tải trên Safari / iPhone.
 *
 * CHUYỆN GÌ XẢY RA: WebKit có lỗi đã biết từ lâu — ảnh gắn `loading="lazy"`
 * đôi khi không bao giờ được tải, cứ trắng trơn mãi, dù người xem đã cuộn tới
 * tận nơi. Không phải lỗi mạng, không phải lỗi file: trình duyệt đơn giản là
 * không bao giờ khởi động lượt tải. Rất nhiều dự án lớn từng dính (WP Rocket,
 * Jetpack, Drupal Blazy) và cách chữa ai cũng dùng là bỏ `lazy` đi.
 *
 * Chrome trên iPhone cũng dính, vì Apple bắt mọi trình duyệt trên iOS phải
 * chạy bằng WebKit. Đó là lý do cùng một trang mà Android xem bình thường còn
 * iPhone thì mất sạch ảnh thẻ sản phẩm.
 *
 * VÌ SAO KHÔNG BỎ THẲNG `lazy` ĐI CHO XONG: trang này có 54 mẫu, cộng thêm 6
 * tấm banner nặng cỡ 100KB một tấm. Bỏ hết lazy là bắt khách tải cả cân ảnh
 * ngay lúc vừa mở trang, tốn 3G của người ta oan — mà phần lớn máy Android
 * lẫn máy tính vốn chẳng gặp lỗi này. Nên giữ nguyên `lazy`, và chỉ ra tay khi
 * đúng là trình duyệt đã bỏ quên tấm ảnh.
 *
 * LÀM SAO BIẾT LÀ "BỎ QUÊN" CHỨ KHÔNG PHẢI "ĐANG TẢI": nhìn `currentSrc`.
 * Thuộc tính này chỉ có giá trị sau khi trình duyệt đã thật sự bắt tay vào
 * tải. Rỗng nghĩa là nó còn chưa động đậy gì. Đo trên trang thật lúc lỗi đang
 * xảy ra thì thấy rõ ba nhóm: ảnh tải xong có `currentSrc`, ảnh đang tải dở
 * cũng có, chỉ riêng nhóm bị bỏ quên là rỗng. Nhờ vậy mới ép đúng tấm cần ép,
 * không giục nhầm tấm đang tải dở làm nó tải lại từ đầu.
 *
 * Chạy cho mọi trình duyệt chứ không đi dò tên trình duyệt — dò tên vừa hay
 * sai vừa chóng lỗi thời. Máy nào `lazy` chạy đúng thì tới lượt tấm ảnh vào
 * gần tầm nhìn là `currentSrc` đã có sẵn, vòng quét này không đụng vào gì cả.
 */

/**
 * Quét rộng hơn màn hình bao nhiêu lần thì mới ép.
 *
 * 1.5 màn hình là xấp xỉ đúng cái ngưỡng mà các trình duyệt vẫn dùng để quyết
 * định tải trước ảnh lazy. Để rộng hơn thì hoá ra tải sớm cả những tấm còn xa
 * — mất luôn ý nghĩa của lazy. Để hẹp hơn thì ảnh chỉ hiện ra sau khi người ta
 * đã nhìn thẳng vào ô trống, cảm giác giật cục.
 */
const TAM_QUET = 1.5;

/** Nhịp quét lại, tính bằng mili giây */
const NHIP_QUET = 1200;

export default function LazyImageFix() {
  useEffect(() => {
    let choRaf = 0;

    const quet = () => {
      const ds =
        document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]');
      const cao = window.innerHeight;

      ds.forEach((anh) => {
        // Đã bắt đầu tải (hoặc đã xong) thì để yên.
        if (anh.currentSrc) return;

        const o = anh.getBoundingClientRect();
        const gan = o.top < cao * TAM_QUET && o.bottom > -cao * 0.5;
        if (!gan) return;

        // Vào tới tầm nhìn rồi mà vẫn chưa nhúc nhích → gỡ lazy ra.
        anh.loading = "eager";

        // Gán lại src để giục trình duyệt chạy lại phần chọn-và-tải ảnh.
        // Riêng việc đổi `loading` lẽ ra đã đủ theo đúng chuẩn, nhưng chính
        // cái đang hỏng ở đây là chỗ trình duyệt bám theo chuẩn — nên thêm
        // một nhịp giục nữa cho chắc. Qua biến trung gian để khỏi thành câu
        // tự gán chính mình (ESLint chặn).
        const nguon = anh.src;
        anh.src = nguon;
      });
    };

    const henQuet = () => {
      if (choRaf) return;
      choRaf = requestAnimationFrame(() => {
        choRaf = 0;
        quet();
      });
    };

    quet();

    // Quét theo nhịp chứ không chỉ nghe sự kiện cuộn: bấm "Xem tiếp" thì lưới
    // dài thêm ra ngay trước mắt, chẳng có cú cuộn nào để mà nghe. Một vòng
    // quét chỉ là một lượt querySelectorAll trên vài chục thẻ, và chỉ đo toạ
    // độ những tấm còn chưa tải — tải xong hết rồi thì gần như không tốn gì.
    const dongHo = window.setInterval(quet, NHIP_QUET);
    window.addEventListener("scroll", henQuet, { passive: true });
    window.addEventListener("resize", henQuet);

    return () => {
      window.clearInterval(dongHo);
      if (choRaf) cancelAnimationFrame(choRaf);
      window.removeEventListener("scroll", henQuet);
      window.removeEventListener("resize", henQuet);
    };
  }, []);

  return null;
}
