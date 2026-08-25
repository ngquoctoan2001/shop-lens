# lennhasuen — website giới thiệu đồ len handmade

Trang web trưng bày sản phẩm len móc tay. **Không bán hàng trên web** — khách
ưng mẫu nào thì bấm nút nhắn Zalo hoặc Messenger.

---

## Chạy thử trên máy

```bash
npm run dev
```

Rồi mở <http://localhost:3000>.

Muốn xem thử đúng bản sẽ đưa lên web:

```bash
npm run build
```

```bash
npm run xem-that
```

Rồi mở <http://localhost:4321>.

> `npm start` KHÔNG dùng được ở dự án này. Trang xuất ra web tĩnh
> (`output: "export"` trong `next.config.ts`) nên `next start` sẽ báo lỗi —
> không có máy chủ Node nào để mà chạy. `npm run xem-that` chỉ đơn giản là mở
> một máy chủ file tĩnh trỏ vào thư mục `out/`, đúng y như Cloudflare Pages làm.

---

## Sửa nội dung ở đâu

### 1. Đổi tên shop, số Zalo, link Facebook → `site.config.ts`

Mở file này ra sửa, không cần đụng vào chỗ nào khác:

```ts
contact: {
  zalo: "0969634653",
  facebook: "https://www.facebook.com/xuyen.huynh.94801116",
},
```

Trong đó còn có: tên shop, câu giới thiệu, dòng chữ chạy trên cùng, ba con số
khoe ở đầu trang, và các câu chạy trên dải băng nghiêng.

### 2. Đổi tên / mô tả sản phẩm → `data/products.json`

Tên và mô tả sản phẩm **đã chốt** — đây là nội dung thật đang chạy. Vẫn sửa
được, nhưng nhớ một điều: hai trường này cũng là nguồn sinh **thẻ alt của ảnh**
(xem `altSanPham()` trong `lib/products.ts`) — sửa ở đây là đổi luôn câu mà
Google Ảnh và trình đọc màn hình đọc được. Mỗi sản phẩm có dạng:

```json
{
  "id": "mk-01",
  "name": "Thỏ Mơ Váy Nâu",
  "desc": "Thỏ nhỏ mặc váy nâu, kèm dây đeo tết tay",
  "image": "/images/mockhoa-01-tho-vay-nau-day-deo.webp"
}
```

Chỉ sửa `name` và `desc`. **Giữ nguyên `id` và `image`.**

### 3. Thêm sản phẩm mới

1. Chép ảnh vào `public/images/`
2. Đặt tên theo kiểu `danhmuc-số-mô-tả`, ví dụ `mockhoa-18-gau-ao-len.jpg`
3. Chạy `npm run webp` — ảnh JPG/PNG đổi sang `.webp` (nhẹ hơn ~50%), bản gốc
   được xoá đi. Ảnh chụp điện thoại cứ thả vào rồi chạy lệnh này là xong.
4. Chạy `npm run anh` — **bước này bắt buộc**, xem mục "Ba cỡ ảnh" bên dưới.
   Thiếu nó thì thẻ sản phẩm hiện ô trống vì không tìm thấy ảnh.
5. Mở `data/products.json`, thêm một khối mới vào đúng danh mục — nhớ để đuôi
   `.webp`:

```json
{
  "id": "mk-18",
  "name": "Tên sản phẩm",
  "desc": "Mô tả ngắn",
  "image": "/images/mockhoa-18-gau-ao-len.webp"
}
```

Số đếm trên nút danh mục tự cộng thêm, không phải sửa tay.

### 3b. Ba cỡ ảnh — vì sao phải chạy `npm run anh`

Trang xuất ra web tĩnh nên bộ thu nhỏ ảnh của Next.js không chạy được (nó cần
một máy chủ Node đứng sau). Nghĩa là trình duyệt tải về đúng cái file mình đưa
cho nó, không hơn không kém. Nếu để nguyên ảnh gốc 1440px thì điện thoại phải
tải một tấm 400KB chỉ để vẽ vào ô rộng 165px — cả trang là gần 11MB.

Nên ba cỡ ảnh phải làm sẵn:

| Thư mục | Cỡ | Dùng ở đâu |
|---|---|---|
| `public/images/thumb/` | 500px | lưới sản phẩm, ba ảnh lơ lửng đầu trang |
| `public/images/` | 1000px | ảnh lớn trong popup |
| `public/images/mini/` | 96px | dải ảnh nhỏ trong popup, nền mờ phía sau |

```bash
npm run anh
```

Lệnh này chép ảnh gốc sang `anh-goc/` (nằm ngoài `public/` nên không lên web,
cũng không vào git) rồi sinh cả ba cỡ từ đó. Chạy lại bao nhiêu lần cũng được,
ảnh nào làm rồi thì bỏ qua.

> **Đừng xoá thư mục `anh-goc/`.** Đó là bản độ phân giải cao duy nhất còn lại;
> ba cỡ trong `public/` đều đã bị thu nhỏ, không phóng to lại được. Vì nó không
> vào git nên nhớ tự chép sang ổ khác hoặc Google Drive.

### 4. Đổi màu → `app/globals.css`

Toàn bộ màu nằm trong khối `:root` ở đầu file, mỗi dòng có ghi chú tiếng Việt.

> **Lưu ý:** ba màu `--ink-soft`, `--accent-3`, `--ring` dùng cho chữ và đã
> được chỉnh để đạt tương phản tối thiểu 4.5:1 (chuẩn WCAG AA). Đổi sang tông
> nhạt hơn thì chữ sẽ khó đọc, nhất là ngoài trời nắng.

### 5. Đổi font → `app/layout.tsx`

Đang dùng **Quicksand** (tiêu đề) + **Nunito** (nội dung).

> **Quan trọng:** font thay thế bắt buộc phải có `subsets: ["latin", "vietnamese"]`.
> Thiếu `vietnamese` thì các chữ `ữ ũ ơ ậ ợ` sẽ rơi về font dự phòng và trông
> lệch hẳn — đây chính là lỗi của font Fredoka lúc đầu.
>
> Font tròn dễ thương **có** tiếng Việt: `Quicksand`, `Baloo_2`, `Comfortaa`,
> `Nunito`, `Be_Vietnam_Pro`, `Lexend`.
> Font **không có** tiếng Việt, đừng dùng: `Fredoka`, `Varela Round`, `Comic Neue`.

---

## Cấu trúc thư mục

```
app/
  layout.tsx        khai báo font, tiêu đề trang, thẻ chia sẻ mạng xã hội
  page.tsx          ghép các phần của trang chủ lại
  globals.css       bảng màu + hiệu ứng chuyển động
components/
  Header.tsx        thanh trên cùng, dính khi cuộn, menu điện thoại
  Hero.tsx          màn hình đầu tiên
  Marquee.tsx       dải băng chữ chạy
  BannerStrip.tsx   dải 6 banner danh mục (khung trống nếu chưa có ảnh)
  Gallery.tsx       lọc danh mục + lưới sản phẩm  (điều khiển popup)
  ContactButtons.tsx cặp nút Zalo / Messenger (dùng chung 3 nơi)
  ProductCard.tsx   thẻ một sản phẩm
  Lightbox.tsx      popup xem ảnh lớn
  About.tsx         ba bước đặt hàng
  ContactCTA.tsx    khối nhắn Zalo / Messenger
  Footer.tsx        chân trang
  CurrentYear.tsx   năm thật cho dòng bản quyền (web tĩnh nên phải chỉnh ở máy khách)
lib/products.ts     đọc products.json, đếm số lượng theo danh mục
lib/category.ts     cầu nối "bấm banner -> lọc lưới sản phẩm"
data/products.json  toàn bộ sản phẩm
public/images/      54 ảnh sản phẩm, bản 1000px (ảnh lớn trong popup)
public/images/thumb/  bản 500px — lưới sản phẩm
public/images/mini/   bản 96px  — dải ảnh nhỏ trong popup
public/banners/     6 ảnh banner danh mục — tự bỏ vào
public/og.jpg       ảnh hiện khi chia sẻ link lên Facebook/Zalo (1200x630)
public/_headers     quy tắc bộ nhớ đệm cho Cloudflare Pages
public/cutouts/     ảnh đã tách nền — chỉ tạo khi cần ghép banner, không lên web
anh-goc/            ẢNH GỐC độ phân giải cao (không lên web, không vào git)
scripts/toi-uu-anh.py sinh ba cỡ ảnh — chạy bằng `npm run anh`
scripts/tach-nen.py script tách nền ảnh sản phẩm
demo/               4 bản demo bảng màu (chỉ để tham khảo, không lên web)
site.config.ts      thông tin shop + link liên hệ
PROMPT-BANNER.md    6 prompt nhờ AI vẽ banner + danh sách ảnh cần tải lên
```

---

## Popup xem ảnh dùng thế nào

Bấm vào thẻ sản phẩm bất kỳ:

- Xem ảnh lớn kèm tên, mô tả, nút nhắn Zalo / Messenger
- Bấm **Trước / Tiếp**, hoặc bấm phím **← →** để chuyển sản phẩm
- **Vuốt trái/phải** trên điện thoại cũng chuyển được
- **Esc** hoặc bấm ra ngoài để đóng

Popup chỉ chạy trong danh mục đang lọc — đang xem "Túi & Ví" thì bấm Tiếp chỉ
chuyển qua các mẫu túi ví, không nhảy sang danh mục khác.

---

## Banner cho phần "Chọn nhóm bạn thích"

Trang chủ có một dải 6 banner cuộn ngang, mỗi danh mục một tấm. Banner nào chưa
có ảnh thì hiện khung nét đứt nhắc tên file cần đặt.

### Thêm banner

1. Tạo ảnh **1920×1080 (tỉ lệ 16:9)**
2. Đặt tên đúng theo slug danh mục: `moc-khoa`, `thu-bong`, `tui-vi`,
   `quan-ao`, `phu-kien`, `hoa-qua-tang`
3. Thả vào `public/banners/`
4. Chạy `npm run webp` để đổi sang `.webp` — trang chỉ đọc file `.webp`
5. Chạy `npm run anh` để thu ảnh về 1600px (banner rộng nhất cũng chỉ hiện
   khoảng 800px, để nguyên 1920px là tải thừa gần gấp đôi)

Banner tự hiện, không phải sửa code. Chưa đủ 6 cái cũng không sao — cái nào có
ảnh thì hiện ảnh, cái nào chưa thì vẫn là khung trống.

### Prompt để nhờ AI vẽ banner

Xem file **`PROMPT-BANNER.md`** ở thư mục gốc: có sẵn 6 prompt chi tiết, kèm
danh sách ảnh sản phẩm cần tải lên cho từng prompt.

### Ảnh sản phẩm đã tách nền

Muốn có ảnh sản phẩm đã xoá nền (WebP, nền trong suốt) — làm ảnh mẫu đưa cho AI,
hoặc kéo thả thẳng vào Canva để tự ghép banner — thì chạy lệnh dưới đây, kết quả
ra thư mục `public/cutouts/`.

Thư mục này **không nằm sẵn trong dự án và không lên web**: 6 banner đã làm xong
rồi nên trang không dùng tới nó nữa, để lại chỉ tổ nặng thêm 6.6 MB mỗi lần
deploy. Cần thì tạo lại lúc nào cũng được:

```bash
npm run tach-nen
```

Ảnh nào đã tách rồi thì script tự bỏ qua. Muốn làm lại từ đầu thì xoá thư mục
`public/cutouts/` rồi chạy lại.

> Lần chạy đầu tiên tải về một mô hình AI nặng khoảng 180 MB (chỉ tải một lần).
> Toàn bộ xử lý chạy trên máy, ảnh không gửi đi đâu cả.

---

## Ảnh trên web đều là WebP

Toàn bộ ảnh trong `public/` là định dạng **WebP** — nhẹ hơn JPG khoảng 50% mà
mắt thường không thấy khác. Trình duyệt nào từ 2020 trở đi cũng đọc được.

Chuyển WebP mới là bước một; bước hai là thu về đúng cỡ cần dùng (`npm run anh`,
xem mục 3b ở trên). Hai bước cộng lại đưa thư mục ảnh từ 24.7 MB xuống 6.3 MB,
và quan trọng hơn: cuộn tới lưới sản phẩm giờ chỉ tải 1.3 MB thay vì 10.8 MB.

Thêm ảnh mới không cần tự đổi định dạng — cứ thả file JPG/PNG vào
`public/images/` hoặc `public/banners/` rồi chạy:

```bash
npm run webp
```

Lệnh này quét hai thư mục đó, đổi mọi ảnh JPG/PNG sang `.webp` rồi xoá bản gốc.
Ảnh nào đã có `.webp` cùng tên thì bỏ qua. Muốn giữ lại bản gốc thì thêm
`--giu-goc`, muốn xem trước mà chưa đổi thật thì thêm `--thu`.

Riêng `app/icon.png` và `app/apple-icon.png` giữ nguyên PNG — đó là file quy ước
của Next.js để làm favicon, không nhận định dạng WebP.

## Đưa web lên mạng

Dự án đã chỉnh sẵn cho **Cloudflare Pages**: `next.config.ts` đặt
`output: "export"` nên `npm run build` cho ra một thư mục `out/` toàn file tĩnh,
không cần máy chủ chạy nền, và gói miễn phí của Cloudflare là quá đủ.

1. Đẩy thư mục này lên GitHub
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git
3. Khai đúng ba ô này:

   | Ô | Điền |
   |---|---|
   | Framework preset | None (hoặc Next.js Static HTML Export) |
   | Build command | `npm run build` |
   | Build output directory | `out` |

4. Bấm Save and Deploy

Trước khi deploy nhớ chạy `npm run anh` và commit các thư mục `thumb/`, `mini/`
— Cloudflare chỉ build code chứ không chạy script Python, thiếu ảnh là thẻ sản
phẩm hiện ô trống.

### Sau khi có tên miền riêng

Sửa đúng một dòng `url` trong `site.config.ts`. Cả thẻ chia sẻ Facebook/Zalo,
`robots.txt`, `sitemap.xml` và link canonical đều ăn theo dòng đó.

Đổi xong nhớ vào <https://developers.facebook.com/tools/debug> dán link mới rồi
bấm **Scrape Again** — Facebook nhớ ảnh xem trước cũ khá dai.

---

## Ghi chú

- Ảnh sản phẩm nên chụp nền sạch (vải trắng hoặc be). Nhiều ảnh hiện tại chụp
  trên bàn phím laptop — sản phẩm đẹp nhưng nền hơi rối.
- Vài mẫu tạo hình theo nhân vật có bản quyền (Mickey, Snoopy, Kuromi,
  Pompompurin, Miffy). Tên trên web đã đặt trung tính sẵn — nên giữ vậy.
