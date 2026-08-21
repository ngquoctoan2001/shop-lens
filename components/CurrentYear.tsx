"use client";

import { useSyncExternalStore } from "react";

/** Không có gì để đăng ký nghe — năm không tự đổi giữa chừng phiên xem web */
const khongNgheGi = () => () => {};

/** Năm đọc từ đồng hồ máy người xem */
const namTrenMayKhach = () => new Date().getFullYear();

/**
 * Năm hiện tại cho dòng bản quyền ở chân trang.
 *
 * Nghe thì thừa, nhưng cần thật: trang này xuất ra web tĩnh, nghĩa là mọi thứ
 * được tính MỘT LẦN lúc bấm build rồi đông cứng thành file HTML. Gọi thẳng
 * new Date().getFullYear() trong Footer thì con số ấy là năm lúc build — build
 * năm 2026, qua 2027 web vẫn ghi 2026 cho tới khi có người nhớ ra mà build lại.
 *
 * useSyncExternalStore sinh ra đúng cho kiểu "giá trị lúc dựng sẵn khác giá trị
 * lúc chạy thật" này: React vẽ lần đầu bằng namBuild cho khớp y hệt file HTML
 * đã dựng (không thì kêu hydration mismatch), gắn xong thì vẽ lại bằng năm thật
 * của máy người xem. Người tắt JavaScript vẫn thấy năm lúc build — vẫn hợp lý.
 */
export default function CurrentYear({ namBuild }: { namBuild: number }) {
  const nam = useSyncExternalStore(
    khongNgheGi,
    namTrenMayKhach, // trên trình duyệt
    () => namBuild, // lúc dựng sẵn và lúc đang gắn vào trang
  );

  return <>{nam}</>;
}
