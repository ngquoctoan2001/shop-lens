# -*- coding: utf-8 -*-
"""
Chuyển ảnh JPG/PNG sang WebP để trang web nhẹ hơn.

Chạy:  python scripts/chuyen-webp.py
       python scripts/chuyen-webp.py --giu-goc     (giữ lại file JPG/PNG cũ)
       python scripts/chuyen-webp.py --thu          (chạy thử, không ghi gì)

Chuyển tại chỗ: public/images/abc.jpg -> public/images/abc.webp rồi xoá file gốc.
Ảnh nào đã có .webp cùng tên rồi thì bỏ qua.

WebP nhẹ hơn JPG khoảng 40-50% mà mắt thường không thấy khác. Mọi trình duyệt
từ 2020 trở đi đều đọc được (Chrome, Safari 14+, Firefox, Edge).

LƯU Ý: app/icon.png và app/apple-icon.png KHÔNG đổi được — đó là file quy ước
riêng của Next.js, chỉ nhận .ico/.png/.jpg/.svg, không nhận .webp.
"""
import os
import sys

from PIL import Image, ImageOps

# Các thư mục cần quét
THU_MUC = ["public/images", "public/banners"]

# Ảnh chụp sản phẩm: 82 là điểm cân bằng đẹp giữa dung lượng và chất lượng
CHAT_LUONG_ANH = 82
# Logo / ảnh có nền trong suốt: viền sắc nét nên để cao hơn cho khỏi rỗ
CHAT_LUONG_TRONG_SUOT = 90
# method=6 nén lâu hơn chút nhưng ra file nhỏ nhất
METHOD = 6

DUOI_VAO = (".jpg", ".jpeg", ".png")


def chuyen(duong_dan: str, thu: bool) -> tuple[int, int]:
    """Chuyển một ảnh sang WebP. Trả về (dung lượng cũ, dung lượng mới)."""
    goc = os.path.getsize(duong_dan)
    dich = os.path.splitext(duong_dan)[0] + ".webp"

    with Image.open(duong_dan) as img:
        # Xoay ảnh đúng chiều theo EXIF rồi bỏ EXIF đi cho nhẹ
        img = ImageOps.exif_transpose(img)
        trong_suot = img.mode in ("RGBA", "LA", "P") and "transparency" in img.info \
            or img.mode in ("RGBA", "LA")
        img = img.convert("RGBA" if trong_suot else "RGB")
        chat_luong = CHAT_LUONG_TRONG_SUOT if trong_suot else CHAT_LUONG_ANH

        if not thu:
            img.save(dich, "WEBP", quality=chat_luong, method=METHOD)

    moi = os.path.getsize(dich) if not thu else 0
    return goc, moi


def main() -> int:
    thu = "--thu" in sys.argv
    giu_goc = "--giu-goc" in sys.argv

    can_lam = []
    for tm in THU_MUC:
        if not os.path.isdir(tm):
            print(f"Bo qua, khong thay thu muc {tm}")
            continue
        for ten in sorted(os.listdir(tm)):
            if not ten.lower().endswith(DUOI_VAO):
                continue
            dd = os.path.join(tm, ten).replace("\\", "/")
            if os.path.exists(os.path.splitext(dd)[0] + ".webp"):
                print(f"bo qua (da co .webp)  {dd}")
                continue
            can_lam.append(dd)

    if not can_lam:
        print("\nKhong con anh JPG/PNG nao can chuyen.")
        return 0

    tong_goc = tong_moi = 0
    loi = 0
    for i, dd in enumerate(can_lam, 1):
        try:
            goc, moi = chuyen(dd, thu)
            tong_goc += goc
            tong_moi += moi
            if thu:
                print(f"[{i}/{len(can_lam)}] (thu) {dd}  {goc/1024:.0f}KB")
                continue
            if not giu_goc:
                os.remove(dd)
            print(f"[{i}/{len(can_lam)}] OK  {dd}  "
                  f"{goc/1024:.0f}KB -> {moi/1024:.0f}KB  (-{(1-moi/goc)*100:.0f}%)",
                  flush=True)
        except Exception as e:
            loi += 1
            print(f"[{i}/{len(can_lam)}] LOI {dd}: {e}", flush=True)

    if thu:
        print(f"\nChay thu: {len(can_lam)} anh se duoc chuyen, "
              f"tong {tong_goc/1024/1024:.2f}MB")
        return 0

    print(f"\nXong: {len(can_lam) - loi} anh, {loi} loi")
    print(f"Dung luong: {tong_goc/1024/1024:.2f}MB -> {tong_moi/1024/1024:.2f}MB "
          f"(giam {(tong_goc-tong_moi)/1024/1024:.2f}MB, "
          f"-{(1-tong_moi/tong_goc)*100:.0f}%)")
    if giu_goc:
        print("Da giu lai file goc (--giu-goc).")
    return 0 if loi == 0 else 2


if __name__ == "__main__":
    sys.exit(main())
