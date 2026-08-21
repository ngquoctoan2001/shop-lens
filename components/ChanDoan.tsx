"use client";

import { useEffect, useState } from "react";

/**
 * Bảng chẩn đoán tạm, chỉ hiện khi địa chỉ có đuôi "?chan-doan=1".
 *
 * ĐÂY LÀ ĐỒ TẠM. Khi nào ảnh trên iPhone chạy ổn rồi thì xoá file này và xoá
 * luôn dòng gọi <ChanDoan /> trong app/layout.tsx. Bình thường nó không vẽ ra
 * gì và cũng không chạy đoạn đo nào, nên để lại cũng không nặng thêm trang —
 * nhưng đã hết việc thì dọn cho sạch.
 *
 * VÌ SAO CẦN: lỗi chỉ xảy ra trên Safari của iPhone, mà ở đây không có máy
 * nào chạy được Safari để mà xem. Đoán mò thì đã trượt vài lần rồi. Bảng này
 * bắt chính chiếc máy đang lỗi tự đọc số đo của nó ra màn hình: ô ảnh cao bao
 * nhiêu, miếng chêm có ăn không, tấm ảnh đã bắt đầu tải chưa. Chủ shop mở một
 * đường link rồi chụp màn hình là đủ dữ liệu để sửa cho đúng.
 */

type Dong = { ten: string; gia: string };

/** Đọc số đo của một phần tử, trả về dạng chữ cho dễ đọc trên điện thoại */
function doPhanTu(el: Element | null, ten: string): Dong[] {
  if (!el) return [{ ten, gia: "KHÔNG TÌM THẤY" }];
  const h = el as HTMLElement;
  const cs = getComputedStyle(h);
  const truoc = getComputedStyle(h, "::before");
  return [
    { ten: `${ten} — cỡ`, gia: `${Math.round(h.offsetWidth)} x ${Math.round(h.offsetHeight)}` },
    { ten: `${ten} — chêm`, gia: `${truoc.content} / pt=${truoc.paddingTop} / display=${truoc.display}` },
    { ten: `${ten} — flex`, gia: `w=${cs.width} shrink=${cs.flexShrink} minH=${cs.minHeight} overflow=${cs.overflow}` },
  ];
}

/** Đọc tình trạng một tấm ảnh */
function doAnh(el: Element | null, ten: string): Dong[] {
  if (!el) return [{ ten, gia: "KHÔNG TÌM THẤY" }];
  const a = el as HTMLImageElement;
  return [
    {
      ten: `${ten} — ảnh`,
      gia: `${Math.round(a.offsetWidth)}x${Math.round(a.offsetHeight)} | cỡ thật ${a.naturalWidth}x${a.naturalHeight} | xong=${a.complete} | đã bắt đầu=${!!a.currentSrc} | lazy=${a.getAttribute("loading") || "không"}`,
    },
  ];
}

export default function ChanDoan() {
  const [dong, setDong] = useState<Dong[] | null>(null);

  useEffect(() => {
    if (!/[?&]chan-doan=1/.test(window.location.search)) return;

    const do_ = () => {
      const ket: Dong[] = [];

      const ua = navigator.userAgent;
      const ver = ua.match(/OS (\d+[_.]\d+(?:[_.]\d+)?)/);
      ket.push({ ten: "máy", gia: ver ? ver[1].replace(/_/g, ".") : "không đọc được" });
      ket.push({ ten: "màn hình", gia: `${window.innerWidth} x ${window.innerHeight} (dpr ${window.devicePixelRatio || 1})` });

      // --- Thẻ sản phẩm đầu tiên: đây mới là chỗ đang hỏng ---
      const nut = document.querySelector("#luoi-san-pham article > button");
      ket.push(...doPhanTu(nut, "nút thẻ"));
      const oAnh = nut?.querySelector(".khung-ti-le") ?? null;
      ket.push(...doPhanTu(oAnh, "ô ảnh thẻ"));
      ket.push(...doAnh(oAnh?.querySelector("img") ?? null, "ô ảnh thẻ"));

      // --- Cụm ảnh đầu trang: cùng lớp khung, nhưng có khai sẵn bề ngang ---
      const hero = document.querySelector("figure")?.parentElement ?? null;
      ket.push(...doPhanTu(hero, "khung Hero"));

      // --- Banner: cùng lớp khung, cũng khai sẵn bề ngang ---
      ket.push(...doPhanTu(document.querySelector('a[href^="#san-pham="]'), "khung banner"));

      // --- Trình duyệt hiểu được gì ---
      const ho = (t: string, g: string) =>
        window.CSS && CSS.supports ? (CSS.supports(t, g) ? "được" : "HỎNG") : "?";
      ket.push({
        ten: "hỗ trợ",
        gia: `aspect-ratio=${ho("aspect-ratio", "1")} | color-mix=${ho("color", "color-mix(in srgb, red 50%, blue)")} | svh=${ho("height", "1svh")}`,
      });

      // --- Đếm chung toàn trang ---
      const ds = Array.from(document.images);
      ket.push({
        ten: "tổng ảnh",
        gia: `${ds.filter((a) => a.naturalWidth > 0).length}/${ds.length} đã tải | ${ds.filter((a) => !a.currentSrc).length} chưa bắt đầu`,
      });

      setDong(ket);
    };

    do_();
    const t = window.setInterval(do_, 1500);
    return () => window.clearInterval(t);
  }, []);

  if (!dong) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: "0 0 auto 0",
        zIndex: 9999,
        maxHeight: "70vh",
        overflow: "auto",
        background: "#111",
        color: "#eee",
        font: "11px/1.45 ui-monospace, Menlo, monospace",
        padding: "10px 12px",
        borderBottom: "3px solid #e9a9a0",
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 6, color: "#e9a9a0" }}>
        CHẨN ĐOÁN — chụp màn hình khung đen này rồi gửi lại
      </div>
      {dong.map((d, i) => (
        <div key={i} style={{ marginBottom: 3, wordBreak: "break-all" }}>
          <span style={{ color: "#9ad" }}>{d.ten}:</span> {d.gia}
        </div>
      ))}
    </div>
  );
}
