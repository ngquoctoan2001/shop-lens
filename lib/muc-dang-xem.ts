"use client";

import { useEffect, useState } from "react";
import { site } from "@/site.config";

/**
 * Khoảng thở cộng thêm dưới mép header để ra vạch đo. Phần nào có mép trên đã
 * trôi qua vạch này thì coi như người xem đang ở phần đó.
 *
 * PHẢI LỚN HƠN --le-neo-muc trong globals.css (12px). Lý do: bấm một mục menu
 * thì khối dừng lại ở đúng "mép header + le-neo-muc". Nếu khoảng thở ở đây nhỏ
 * hơn con số đó, khối vừa nhảy tới lại nằm DƯỚI vạch đo — mục vừa bấm không
 * sáng lên, menu tô nhầm sang mục phía trên.
 */
const KHOANG_THO = 24;

/** Chiều cao header đọc từ chính nó, khỏi ghi cứng 74px ở hai nơi rồi lệch nhau */
const CAO_HEADER_DU_PHONG = 74;

/**
 * Dò xem người xem đang ở phần nào của trang, trả về href của mục điều hướng
 * tương ứng (vd "#san-pham").
 *
 * Dùng chung cho menu đầu trang (máy tính) và thanh nổi cuối màn hình (điện
 * thoại) để hai chỗ luôn sáng cùng một mục.
 */
export function useMucDangXem() {
  const [active, setActive] = useState<string>(site.nav[0].href);

  useEffect(() => {
    const ids = site.nav.map((n) => n.href.slice(1));

    // Đo header một lần rồi nhớ lại. Đọc offsetHeight trong hàm chạy theo từng
    // khung hình cuộn sẽ bắt trình duyệt tính lại bố cục liên tục; mà chiều cao
    // header thì chỉ đổi khi cửa sổ đổi cỡ.
    let vach = 0;
    const doLaiVach = () => {
      const cao =
        document.querySelector("header")?.offsetHeight ?? CAO_HEADER_DU_PHONG;
      vach = cao + KHOANG_THO;
    };
    doLaiVach();

    // Trình duyệt chỉ bắn sự kiện cuộn tối đa một lần mỗi khung hình, nên cứ
    // tính thẳng ở đây, không cần hãm thêm.
    const capNhat = () => {
      // Cuộn chạm đáy trang thì mục cuối luôn sáng. Thiếu đoạn này thì phần
      // cuối (thấp hơn màn hình) sẽ chẳng bao giờ trôi qua nổi vạch đo.
      const chamDay =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (chamDay) {
        setActive(`#${ids[ids.length - 1]}`);
        return;
      }

      let dangXem = ids[0];
      for (const id of ids) {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        if (top !== undefined && top <= vach) dangXem = id;
      }
      setActive(`#${dangXem}`);
    };

    // Đổi cỡ cửa sổ thì đo lại header trước rồi mới dò — làm ngược lại là nhịp
    // đầu tiên sau khi đổi cỡ vẫn dùng vạch cũ.
    const khiDoiCo = () => {
      doLaiVach();
      capNhat();
    };

    capNhat();
    window.addEventListener("scroll", capNhat, { passive: true });
    window.addEventListener("resize", khiDoiCo, { passive: true });
    return () => {
      window.removeEventListener("scroll", capNhat);
      window.removeEventListener("resize", khiDoiCo);
    };
  }, []);

  return active;
}
