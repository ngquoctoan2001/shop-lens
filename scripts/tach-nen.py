# -*- coding: utf-8 -*-
"""
Tách nền ảnh sản phẩm -> WebP trong suốt, dùng để ghép banner collage.

Chạy:  python scripts/tach-nen.py
Kết quả: public/cutouts/<ten-anh>.webp

Chỉ chạy lại khi thêm ảnh mới — ảnh nào đã có file .webp rồi thì bỏ qua.
Muốn làm lại từ đầu thì xoá thư mục public/cutouts.
"""
import os
import sys
import io

from PIL import Image
from rembg import remove, new_session

SRC = "public/images"
DST = "public/cutouts"
# Bỏ qua logo, không phải sản phẩm
SKIP = {"logo-mark.webp", "logo.webp"}

# Thu nhỏ trước khi tách cho nhanh
MAX_SIZE = 1400
# Ảnh kết quả: banner hiển thị ảnh rộng chừng 340px, chụp ở gấp đôi là 680px,
# nên 900px là dư dùng mà file nhẹ hơn hẳn.
OUT_SIZE = 900


def crop_to_content(img: Image.Image, pad: int = 6) -> Image.Image:
    """Cắt sát mép sản phẩm, bỏ vùng trong suốt thừa xung quanh."""
    bbox = img.getbbox()
    if not bbox:
        return img
    l, t, r, b = bbox
    l, t = max(0, l - pad), max(0, t - pad)
    r, b = min(img.width, r + pad), min(img.height, b + pad)
    return img.crop((l, t, r, b))


def main() -> int:
    if not os.path.isdir(SRC):
        print(f"Khong thay thu muc {SRC}")
        return 1
    os.makedirs(DST, exist_ok=True)

    files = sorted(
        f for f in os.listdir(SRC)
        if f.lower().endswith((".webp", ".jpg", ".jpeg", ".png")) and f not in SKIP
    )
    if not files:
        print("Khong co anh nao trong", SRC)
        return 1

    session = new_session("isnet-general-use")
    total = len(files)
    done = skipped = failed = 0

    for i, name in enumerate(files, 1):
        out_name = os.path.splitext(name)[0] + ".webp"
        out_path = os.path.join(DST, out_name)

        if os.path.exists(out_path):
            skipped += 1
            print(f"[{i}/{total}] bo qua (da co)  {out_name}", flush=True)
            continue

        try:
            src = Image.open(os.path.join(SRC, name)).convert("RGB")
            if max(src.size) > MAX_SIZE:
                src.thumbnail((MAX_SIZE, MAX_SIZE), Image.LANCZOS)

            cut = remove(
                src,
                session=session,
                alpha_matting=True,              # mép mượt hơn, hợp đồ len xù
                alpha_matting_foreground_threshold=250,
                alpha_matting_background_threshold=15,
                alpha_matting_erode_size=6,
            ).convert("RGBA")

            cut = crop_to_content(cut)
            if max(cut.size) > OUT_SIZE:
                cut.thumbnail((OUT_SIZE, OUT_SIZE), Image.LANCZOS)
            # WebP giữ được nền trong suốt mà nhẹ hơn PNG khoảng 5-8 lần
            cut.save(out_path, "WEBP", quality=88, method=6)

            kb = os.path.getsize(out_path) / 1024
            done += 1
            print(f"[{i}/{total}] OK  {out_name}  {cut.width}x{cut.height}  {kb:.0f}KB",
                  flush=True)
        except Exception as e:
            failed += 1
            print(f"[{i}/{total}] LOI {name}: {e}", flush=True)

    print(f"\nXong: {done} anh moi, {skipped} bo qua, {failed} loi")
    print(f"Thu muc ket qua: {DST}")
    return 0 if failed == 0 else 2


if __name__ == "__main__":
    sys.exit(main())
