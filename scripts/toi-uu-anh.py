# -*- coding: utf-8 -*-
"""
Sinh các cỡ ảnh mà trang web thật sự cần.

Chạy:  python scripts/toi-uu-anh.py
       python scripts/toi-uu-anh.py --thu     (chạy thử, không ghi gì)
       python scripts/toi-uu-anh.py --lam-lai (bỏ qua bản đã có, làm lại từ đầu)

────────────────────────────────────────────────────────────────────────────
VÌ SAO CẦN FILE NÀY

Trang xuất ra web tĩnh (next.config.ts đặt output: "export") nên bộ thu nhỏ
ảnh của Next.js không chạy được — nó cần một máy chủ Node đứng sau. Hệ quả:
thẻ <Image> phục vụ nguyên file gốc, không sinh srcset. Trước khi có file này,
một tấm ảnh 1440x1440 nặng 400KB bị tải về chỉ để vẽ vào ô 165px trên điện
thoại.

Nên việc thu nhỏ phải làm sẵn ở đây, chia làm ba cỡ đúng bằng ba chỗ dùng:

  public/images/<ten>.webp        1000px  ảnh lớn trong popup (hiện tối đa 470px)
  public/images/thumb/<ten>.webp   500px  lưới sản phẩm + 3 ảnh lơ lửng đầu trang
  public/images/mini/<ten>.webp     96px  dải ảnh nhỏ trong popup + nền mờ phía sau

Ảnh gốc được chép sang thư mục anh-goc/ ở ngoài public/ nên KHÔNG bị đưa lên
web, và cũng không vào git (đã ghi trong .gitignore). Mọi cỡ ảnh đều sinh lại
từ đó, nên chạy lại script bao nhiêu lần cũng không làm ảnh xấu dần đi.

QUAN TRỌNG: đừng xoá thư mục anh-goc/. Mất nó là mất bản gốc, các cỡ ảnh còn
lại đều đã bị thu nhỏ rồi, không phóng to lại được.

────────────────────────────────────────────────────────────────────────────
THÊM ẢNH SẢN PHẨM MỚI THÌ LÀM THẾ NÀO

  1. Thả ảnh JPG/PNG vào public/images/
  2. python scripts/chuyen-webp.py     (đổi sang .webp)
  3. python scripts/toi-uu-anh.py      (sinh đủ ba cỡ)
  4. Khai sản phẩm mới trong data/products.json
"""
import os
import shutil
import sys

from PIL import Image, ImageOps

GOC = "anh-goc"

# Ba cỡ ảnh sản phẩm. Con số lấy từ bề rộng hiển thị thật, nhân đôi cho màn
# hình nét cao (Retina, điện thoại) rồi làm tròn lên:
#   lưới sản phẩm hiện 165px trên điện thoại / 274px trên máy tính  -> 500
#   ảnh lớn trong popup hiện tối đa 470px                           -> 1000
#   dải ảnh nhỏ trong popup hiện 54px                               -> 96
CO_ANH = [
    # (thư mục con, cạnh dài tối đa, mức nén)
    ("", 1000, 80),
    ("thumb", 500, 78),
    ("mini", 96, 72),
]

# Banner hiện tối đa 42vw — trên màn 1920 là ~806px, nhân đôi thành ~1600.
BANNER_MAX = 1600
BANNER_CHAT_LUONG = 80

# Logo hiện ở 40px, để 160 là dư cho cả màn hình nét gấp ba.
LOGO_MAX = 160
LOGO_CHAT_LUONG = 90

# Ảnh không phải sản phẩm, không cần sinh ba cỡ
KHONG_PHAI_SAN_PHAM = {"logo-mark.webp", "logo.webp"}


def nap(duong_dan: str) -> Image.Image:
    """Mở ảnh, xoay đúng chiều theo EXIF, bỏ kênh trong suốt nếu không cần."""
    img = Image.open(duong_dan)
    img = ImageOps.exif_transpose(img)
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGBA" if "A" in img.getbands() else "RGB")
    return img


def ghi(img: Image.Image, canh_dai: int, dich: str, chat_luong: int) -> int:
    """Thu ảnh cho cạnh dài nhất bằng canh_dai rồi lưu. Trả về dung lượng."""
    ra = img.copy()
    # thumbnail() giữ nguyên tỉ lệ và không bao giờ phóng to ảnh nhỏ hơn
    ra.thumbnail((canh_dai, canh_dai), Image.LANCZOS)
    os.makedirs(os.path.dirname(dich) or ".", exist_ok=True)
    ra.save(dich, "WEBP", quality=chat_luong, method=6)
    return os.path.getsize(dich)


def da_lam_roi(dich: str, canh_dai: int) -> bool:
    """
    File đích đã đúng cỡ chưa.

    Không so sánh ngày sửa file được: lúc sao lưu, shutil.copy2 giữ nguyên ngày
    của bản gốc, nên bản gốc và bản trong public/ trông y như nhau về thời gian
    — script sẽ tưởng đã làm rồi và bỏ qua. Đo thẳng cạnh dài của ảnh là chắc
    chắn: cạnh đã bằng hoặc nhỏ hơn cỡ cần thì không phải làm lại.
    """
    if not os.path.exists(dich):
        return False
    try:
        with Image.open(dich) as im:
            return max(im.size) <= canh_dai
    except OSError:
        return False


def sao_luu(thu_muc: str, thu: bool) -> str:
    """Chép ảnh gốc sang anh-goc/ lần đầu chạy. Trả về đường dẫn thư mục gốc."""
    dich = os.path.join(GOC, os.path.basename(thu_muc))
    if os.path.isdir(dich) and os.listdir(dich):
        return dich  # đã sao lưu từ lần chạy trước

    print(f"  Sao luu ban goc: {thu_muc} -> {dich}/")
    if thu:
        return thu_muc  # chạy thử thì đọc thẳng từ chỗ cũ

    os.makedirs(dich, exist_ok=True)
    for ten in sorted(os.listdir(thu_muc)):
        if ten.lower().endswith(".webp") and os.path.isfile(
            os.path.join(thu_muc, ten)
        ):
            shutil.copy2(os.path.join(thu_muc, ten), os.path.join(dich, ten))
    return dich


def lam_anh_san_pham(thu: bool, lam_lai: bool) -> tuple[int, int]:
    nguon = sao_luu("public/images", thu)
    tep = sorted(
        t for t in os.listdir(nguon)
        if t.lower().endswith(".webp") and t not in KHONG_PHAI_SAN_PHAM
    )
    if not tep:
        print("  Khong thay anh san pham nao.")
        return 0, 0

    tong_goc = tong_moi = 0
    for i, ten in enumerate(tep, 1):
        dd = os.path.join(nguon, ten)
        tong_goc += os.path.getsize(dd)

        # Bỏ qua nếu cả ba cỡ đều đã có và đã đúng kích thước
        dich_list = [
            (os.path.join("public/images", sub, ten), canh, cl)
            for sub, canh, cl in CO_ANH
        ]
        if not lam_lai and all(da_lam_roi(d, canh) for d, canh, _ in dich_list):
            tong_moi += sum(os.path.getsize(d) for d, _, _ in dich_list)
            continue

        if thu:
            print(f"  [{i}/{len(tep)}] (thu) {ten}")
            continue

        with nap(dd) as img:
            co = []
            for dich, canh, cl in dich_list:
                n = ghi(img, canh, dich, cl)
                tong_moi += n
                co.append(f"{n / 1024:.0f}KB")
        print(f"  [{i}/{len(tep)}] {ten}  ->  {' + '.join(co)}", flush=True)

    return tong_goc, tong_moi


def lam_mot_co(thu_muc: str, canh: int, chat_luong: int, thu: bool,
               lam_lai: bool, chi_lay: set[str] | None = None) -> tuple[int, int]:
    """Dùng cho banner và logo: một cỡ duy nhất, ghi đè tại chỗ."""
    nguon = sao_luu(thu_muc, thu)
    tep = sorted(
        t for t in os.listdir(nguon)
        if t.lower().endswith(".webp") and (chi_lay is None or t in chi_lay)
    )

    tong_goc = tong_moi = 0
    for ten in tep:
        dd = os.path.join(nguon, ten)
        dich = os.path.join(thu_muc, ten)
        tong_goc += os.path.getsize(dd)

        if not lam_lai and da_lam_roi(dich, canh):
            tong_moi += os.path.getsize(dich)
            continue
        if thu:
            print(f"  (thu) {dich}")
            continue

        with nap(dd) as img:
            n = ghi(img, canh, dich, chat_luong)
        tong_moi += n
        print(f"  {ten}  ->  {n / 1024:.0f}KB", flush=True)

    return tong_goc, tong_moi


def main() -> int:
    thu = "--thu" in sys.argv
    lam_lai = "--lam-lai" in sys.argv

    if not os.path.isdir("public/images"):
        print("Chay lenh nay tu thu muc goc du an (cho co package.json).")
        return 1

    print("ANH SAN PHAM")
    g1, m1 = lam_anh_san_pham(thu, lam_lai)

    print("\nBANNER")
    g2, m2 = lam_mot_co("public/banners", BANNER_MAX, BANNER_CHAT_LUONG,
                        thu, lam_lai)

    print("\nLOGO")
    g3, m3 = lam_mot_co("public/images", LOGO_MAX, LOGO_CHAT_LUONG,
                        thu, lam_lai, chi_lay={"logo-mark.webp"})

    goc, moi = g1 + g2 + g3, m1 + m2 + m3
    print(f"\n{'CHAY THU — chua ghi gi ca' if thu else 'XONG'}")
    if not thu and goc:
        print(f"Anh goc (giu trong {GOC}/): {goc / 1048576:.2f} MB")
        print(f"Anh dua len web          : {moi / 1048576:.2f} MB  "
              f"(-{(1 - moi / goc) * 100:.0f}%)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
