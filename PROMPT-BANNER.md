# Hướng dẫn tạo 6 ảnh banner

Phần **"Chọn nhóm bạn thích"** ở trang chủ đang để 6 khung trống. Làm xong ảnh
nào thì thả vào `public/banners/` đúng tên file — banner tự hiện, không cần
sửa code.

---

## Thông số ảnh

| | |
|---|---|
| **Tỉ lệ** | 16:9 |
| **Kích thước** | 1920 × 1080 px |
| **Định dạng** | JPG (hoặc PNG rồi đổi đuôi) |
| **Dung lượng** | dưới 500 KB mỗi ảnh là đẹp |

> Chọn 16:9 vì đây là tỉ lệ ngang rộng nhất mà **mọi** công cụ AI đều hỗ trợ
> sẵn. Nếu công cụ anh dùng cho phép tỉ lệ tự do (Midjourney, Ideogram) thì
> **21:9** còn hợp hơn — web sẽ tự cắt gọn hai bên.

---

## Cách làm

1. Mở ChatGPT (hoặc Gemini, Canva AI…) — **chọn công cụ tạo ảnh**
2. **Tải lên các ảnh sản phẩm** ghi trong từng phần bên dưới
   → lấy trong thư mục `public/cutouts/` (ảnh đã tách nền sẵn, nền trong suốt)
3. Dán prompt tương ứng
4. Lưu ảnh về, đổi tên đúng như ghi chú, bỏ vào `public/banners/`

---

## ⚠ Ba điều cần biết trước

**1. AI viết chữ tiếng Việt hay sai dấu.** Rất hay gặp: "móc khóa" thành
"móc khoá" hoặc mất dấu hẳn. Hai cách xử lý:

- Bảo AI **để trống chỗ chữ**, rồi anh tự thêm chữ bằng Canva
- Hoặc cứ để AI viết, nhìn thấy sai thì bảo nó sửa lại

Prompt bên dưới đã ghi rõ chữ cần viết, đặt trong dấu ngoặc kép để AI bám sát.

**2. AI sẽ vẽ lại sản phẩm, không giữ nguyên 100%.** Kể cả khi anh tải ảnh
thật lên, sản phẩm trên banner vẫn là hình *phỏng theo*. Nếu anh muốn **đúng
y hệt hàng thật** thì dùng Canva: tự kéo thả ảnh trong `public/cutouts/` lên
một nền pastel — chậm hơn nhưng sản phẩm là thật.

**3. Tránh nhắc tên thương hiệu.** Đừng ghi "giống banner Moji" trong prompt —
tả phong cách thì được, mượn tên thương hiệu người ta thì không nên.

---

# 6 PROMPT

Mỗi phần có: tên file cần lưu → ảnh cần tải lên → prompt để dán.

---

## 1. Móc khóa & Charm

**Lưu thành:** `public/banners/moc-khoa.jpg` (rồi chạy `npm run webp` để đổi sang `.webp`)

**Tải lên 5 ảnh này** (trong `public/cutouts/`):

```
mockhoa-16-kem-que-dua-hau-heo.webp     (kem que dưa hấu hình heo hồng)
mockhoa-07-ca-taiyaki-4-mau.webp        (4 con cá taiyaki nhỏ)
mockhoa-11-meo-doi-trang-den.webp       (đôi mèo trắng và đen)
mockhoa-04-con-sua-hong.webp            (con sứa hồng tua rua)
mockhoa-14-vit-vang-mu-beo.webp         (vịt vàng đội mũ bèo)
```

**Prompt:**

```
Tạo ảnh banner ngang tỉ lệ 16:9, kích thước 1920x1080, phong cách collage
kawaii Hàn Quốc dễ thương.

NỀN: màu hồng phấn nhạt (#FDEBF1), phủ hoạ tiết chấm bi nhỏ màu hồng đậm hơn
mờ nhẹ. Rắc thêm vài ngôi sao bốn cánh và trái tim nhỏ màu hồng, mờ, nằm rải
rác. Nền phẳng, không đổ bóng mạnh, không gradient loè loẹt.

SẢN PHẨM: dùng các món đồ len móc tay trong ảnh tôi tải lên, cắt rời khỏi nền,
sắp xếp rải đều khắp phần bên phải và giữa banner. Mỗi món nghiêng nhẹ một góc
khác nhau (từ -10 đến +10 độ), có bóng đổ mềm rất nhạt phía dưới. Các món KHÔNG
được chồng lên nhau và KHÔNG chạm mép ảnh — chừa lề ít nhất 60px mọi phía. Giữ
đúng màu sắc và kiểu đan len của sản phẩm gốc.

NHÃN TÊN: cạnh mỗi món đặt một nhãn nhỏ hình viên thuốc bo tròn, nền trắng kem,
viền hồng mảnh 2px, chữ hồng đậm in thường. Nội dung các nhãn theo đúng thứ tự
sản phẩm: "kem dưa hấu", "cá taiyaki", "đôi mèo", "sứa biển", "vịt con".

CHỮ LỚN: đặt ở 1/3 bên trái, chừa hẳn khoảng trống không có sản phẩm. Ba dòng,
font serif thanh lịch, màu hồng mận đậm:
dòng 1: "treo túi"
dòng 2: "treo chìa,"
dòng 3: "treo thương"  (dòng này in nghiêng)

GÓC DƯỚI BÊN TRÁI: một dòng chữ nhỏ, đậm, màu hồng mận:
"*17 mẫu móc khóa · nhận móc theo nhân vật bạn thích"

YÊU CẦU CHỮ: viết đúng tiếng Việt có dấu, tuyệt đối không sai dấu, không thêm
chữ nào ngoài những gì tôi ghi ở trên.

Tổng thể sáng sủa, thoáng, nhiều khoảng trống, cảm giác dịu dàng và thủ công.
```

---

## 2. Thú bông Amigurumi

**Lưu thành:** `public/banners/thu-bong.jpg` (rồi chạy `npm run webp` để đổi sang `.webp`)

**Tải lên 5 ảnh này:**

```
thubong-06-bo-sua-len-chunky.webp       (bò sữa len to, mềm)
thubong-13-set-rau-cu-qua-mat-cuoi.webp (khay rau củ quả mặt cười)
thubong-10-ech-doi-vay-hong-yem-xanh.webp (đôi ếch mặc váy và yếm)
thubong-09-tho-ao-khoac-xanh.webp       (thỏ cao mặc áo khoác xanh)
thubong-03-tuan-loc-khan-do.webp        (tuần lộc quàng khăn đỏ)
```

**Prompt:**

```
Tạo ảnh banner ngang tỉ lệ 16:9, kích thước 1920x1080, phong cách collage
kawaii Hàn Quốc dễ thương.

NỀN: màu xanh mint nhạt (#E3F5EE), phủ hoạ tiết chấm bi nhỏ màu xanh đậm hơn
mờ nhẹ. Rắc thêm vài ngôi sao bốn cánh và đám mây nhỏ màu trắng, mờ, rải rác.
Nền phẳng, không gradient loè loẹt.

SẢN PHẨM: dùng các thú bông len móc tay trong ảnh tôi tải lên, cắt rời khỏi
nền, sắp xếp rải đều khắp phần bên phải và giữa banner. Mỗi bạn nghiêng nhẹ một
góc khác nhau (-10 đến +10 độ), bóng đổ mềm rất nhạt phía dưới. KHÔNG chồng lên
nhau, KHÔNG chạm mép ảnh — chừa lề ít nhất 60px mọi phía. Giữ đúng màu sắc và
kiểu đan len của sản phẩm gốc.

NHÃN TÊN: cạnh mỗi bạn đặt một nhãn nhỏ hình viên thuốc bo tròn, nền trắng kem,
viền xanh mint mảnh 2px, chữ xanh rêu đậm in thường. Nội dung theo đúng thứ tự
sản phẩm: "bò sữa bự", "set rau củ", "đôi ếch", "thỏ đi dạo", "tuần lộc".

CHỮ LỚN: đặt ở 1/3 bên trái, chừa hẳn khoảng trống không có sản phẩm. Ba dòng,
font serif thanh lịch, màu xanh rêu đậm:
dòng 1: "ôm một cái"
dòng 2: "là hết"
dòng 3: "buồn"  (dòng này in nghiêng)

GÓC DƯỚI BÊN TRÁI: một dòng chữ nhỏ, đậm, màu xanh rêu:
"*14 bạn bông móc tay · từ cỡ lòng bàn tay tới cỡ ôm cả người"

YÊU CẦU CHỮ: viết đúng tiếng Việt có dấu, tuyệt đối không sai dấu, không thêm
chữ nào ngoài những gì tôi ghi ở trên.

Tổng thể sáng sủa, thoáng, nhiều khoảng trống, cảm giác ấm áp và thủ công.
```

---

## 3. Túi & Ví

**Lưu thành:** `public/banners/tui-vi.jpg` (rồi chạy `npm run webp` để đổi sang `.webp`)

**Tải lên 5 ảnh này:**

```
tuivi-05-tui-deo-cheo-nau-handmade.webp   (túi đeo chéo nâu, charm ngọc trai)
tuivi-03-tui-tote-4-mau.webp              (túi tote đủ 4 màu)
tuivi-06-vi-mini-dau-tay-do.webp          (ví nhỏ hình quả dâu đỏ)
tuivi-01-tui-rut-day-dau-tay.webp         (túi rút hồng thêu dâu)
tuivi-07-vi-cam-tay-nau-charm-bach-tuoc.webp (ví nâu caramel, charm bạch tuộc)
```

**Prompt:**

```
Tạo ảnh banner ngang tỉ lệ 16:9, kích thước 1920x1080, phong cách collage
kawaii Hàn Quốc dễ thương.

NỀN: màu nâu sữa nhạt (#F6EADC), phủ hoạ tiết chấm bi nhỏ màu nâu đậm hơn mờ
nhẹ. Rắc thêm vài ngôi sao bốn cánh và bông hoa nhỏ màu nâu vàng, mờ, rải rác.
Nền phẳng, ấm, không gradient loè loẹt.

SẢN PHẨM: dùng các túi và ví len móc tay trong ảnh tôi tải lên, cắt rời khỏi
nền, sắp xếp rải đều khắp phần bên phải và giữa banner. Mỗi món nghiêng nhẹ một
góc khác nhau (-10 đến +10 độ), bóng đổ mềm rất nhạt phía dưới. KHÔNG chồng lên
nhau, KHÔNG chạm mép ảnh — chừa lề ít nhất 60px mọi phía. Giữ đúng màu sắc và
kiểu đan len của sản phẩm gốc.

NHÃN TÊN: cạnh mỗi món đặt một nhãn nhỏ hình viên thuốc bo tròn, nền trắng kem,
viền nâu vàng mảnh 2px, chữ nâu đậm in thường. Nội dung theo đúng thứ tự sản
phẩm: "túi đeo chéo", "túi tote", "ví mini", "túi rút", "ví cầm tay".

CHỮ LỚN: đặt ở 1/3 bên trái, chừa hẳn khoảng trống không có sản phẩm. Ba dòng,
font serif thanh lịch, màu nâu cacao đậm:
dòng 1: "đựng đồ,"
dòng 2: "đựng cả"
dòng 3: "nắng"  (dòng này in nghiêng)

GÓC DƯỚI BÊN TRÁI: một dòng chữ nhỏ, đậm, màu nâu cacao:
"*7 mẫu túi ví · móc tay, đổi màu len theo yêu cầu"

YÊU CẦU CHỮ: viết đúng tiếng Việt có dấu, tuyệt đối không sai dấu, không thêm
chữ nào ngoài những gì tôi ghi ở trên.

Tổng thể sáng sủa, thoáng, nhiều khoảng trống, cảm giác mộc mạc và thủ công.
```

---

## 4. Quần áo

**Lưu thành:** `public/banners/quan-ao.jpg` (rồi chạy `npm run webp` để đổi sang `.webp`)

**Tải lên cả 3 ảnh:**

```
quanao-02-ao-croptop-granny-square.webp  (croptop ô vuông granny square)
quanao-01-ao-hai-day-pastel-hoa.webp     (áo hai dây hồng tím, đính hoa)
quanao-03-ao-gile-kem-nut-go.webp        (áo gile kem, nút gỗ)
```

**Prompt:**

```
Tạo ảnh banner ngang tỉ lệ 16:9, kích thước 1920x1080, phong cách collage
kawaii Hàn Quốc dễ thương.

NỀN: màu tím lavender rất nhạt (#EFE9FA), phủ hoạ tiết chấm bi nhỏ màu tím đậm
hơn mờ nhẹ. Rắc thêm vài ngôi sao bốn cánh và cuộn len nhỏ màu tím pastel, mờ,
rải rác. Nền phẳng, không gradient loè loẹt.

SẢN PHẨM: dùng ba chiếc áo len móc tay trong ảnh tôi tải lên, cắt rời khỏi nền,
trải phẳng như chụp từ trên xuống. Xếp thành hàng ngang ở phần bên phải banner,
mỗi chiếc nghiêng nhẹ một góc khác nhau (-8 đến +8 độ), bóng đổ mềm rất nhạt.
Vì chỉ có 3 món nên để mỗi chiếc to rõ, cách nhau thoáng. KHÔNG chồng lên nhau,
KHÔNG chạm mép ảnh — chừa lề ít nhất 60px mọi phía. Giữ đúng màu sắc và kiểu
đan len của sản phẩm gốc.

NHÃN TÊN: cạnh mỗi chiếc áo đặt một nhãn nhỏ hình viên thuốc bo tròn, nền trắng
kem, viền tím mảnh 2px, chữ tím đậm in thường. Nội dung theo đúng thứ tự sản
phẩm: "croptop granny", "áo hai dây", "áo gile".

CHỮ LỚN: đặt ở 1/3 bên trái, chừa hẳn khoảng trống không có sản phẩm. Ba dòng,
font serif thanh lịch, màu tím than đậm:
dòng 1: "mặc lên là"
dòng 2: "ấm cả"
dòng 3: "mùa"  (dòng này in nghiêng)

GÓC DƯỚI BÊN TRÁI: một dòng chữ nhỏ, đậm, màu tím than:
"*Nhận đặt theo số đo · chọn màu len tuỳ ý"

YÊU CẦU CHỮ: viết đúng tiếng Việt có dấu, tuyệt đối không sai dấu, không thêm
chữ nào ngoài những gì tôi ghi ở trên.

Tổng thể sáng sủa, thoáng, nhiều khoảng trống, cảm giác nhẹ nhàng và thủ công.
```

---

## 5. Phụ kiện

**Lưu thành:** `public/banners/phu-kien.jpg` (rồi chạy `npm run webp` để đổi sang `.webp`)

**Tải lên 5 ảnh này:**

```
phukien-05-mu-len-va-gang-tay-navy.webp  (mũ beanie + găng hở ngón xanh navy)
phukien-04-khan-quang-co-kem-gau.webp    (khăn quàng cổ kem, patch gấu)
phukien-01-mu-beret-qua-cam.webp         (mũ beret hình quả cam)
phukien-06-vong-tay-hoa-cuc-3-mau.webp   (vòng tay chuỗi hoa cúc 3 màu)
phukien-03-kep-toc-hoa-hong.webp         (kẹp tóc hoa hồng nhụy vàng)
```

**Prompt:**

```
Tạo ảnh banner ngang tỉ lệ 16:9, kích thước 1920x1080, phong cách collage
kawaii Hàn Quốc dễ thương.

NỀN: màu vàng kem nhạt (#FCF3D9), phủ hoạ tiết chấm bi nhỏ màu vàng đậm hơn mờ
nhẹ. Rắc thêm vài ngôi sao bốn cánh và bông hoa cúc nhỏ màu vàng, mờ, rải rác.
Nền phẳng, ấm, không gradient loè loẹt.

SẢN PHẨM: dùng các phụ kiện len móc tay trong ảnh tôi tải lên, cắt rời khỏi
nền, sắp xếp rải đều khắp phần bên phải và giữa banner. Vì các món to nhỏ rất
khác nhau (mũ to, kẹp tóc bé xíu) nên cân đối lại cho hài hoà: món nhỏ đừng vẽ
quá bé. Mỗi món nghiêng nhẹ một góc khác nhau (-10 đến +10 độ), bóng đổ mềm rất
nhạt. KHÔNG chồng lên nhau, KHÔNG chạm mép ảnh — chừa lề ít nhất 60px mọi phía.
Giữ đúng màu sắc và kiểu đan len của sản phẩm gốc.

NHÃN TÊN: cạnh mỗi món đặt một nhãn nhỏ hình viên thuốc bo tròn, nền trắng kem,
viền vàng đậm mảnh 2px, chữ nâu vàng đậm in thường. Nội dung theo đúng thứ tự
sản phẩm: "mũ & găng", "khăn quàng", "mũ beret", "vòng tay", "kẹp tóc".

CHỮ LỚN: đặt ở 1/3 bên trái, chừa hẳn khoảng trống không có sản phẩm. Ba dòng,
font serif thanh lịch, màu nâu vàng đậm:
dòng 1: "thêm một"
dòng 2: "chút"
dòng 3: "xinh"  (dòng này in nghiêng)

GÓC DƯỚI BÊN TRÁI: một dòng chữ nhỏ, đậm, màu nâu vàng:
"*Mũ, khăn, găng tay, kẹp tóc, vòng tay móc tay"

YÊU CẦU CHỮ: viết đúng tiếng Việt có dấu, tuyệt đối không sai dấu, không thêm
chữ nào ngoài những gì tôi ghi ở trên.

Tổng thể sáng sủa, thoáng, nhiều khoảng trống, cảm giác tươi vui và thủ công.
```

---

## 6. Hoa len & Quà tặng

**Lưu thành:** `public/banners/hoa-qua-tang.jpg` (rồi chạy `npm run webp` để đổi sang `.webp`)

**Tải lên 5 ảnh này:**

```
hoaqua-05-bo-hoa-tot-nghiep-doll-nu.webp  (bó hoa tốt nghiệp kèm doll nữ)
hoaqua-01-chau-hoa-huong-duong.webp       (chậu hoa hướng dương)
hoaqua-06-bo-hoa-hong-thu-cung.webp       (bó hoa hồng kèm thú đội mũ cử nhân)
hoaqua-02-chau-hoa-tulip-doi.webp         (chậu tulip xanh và hồng)
hoaqua-07-doll-co-dau-chu-re-hop-mica.webp (đôi doll cô dâu chú rể)
```

**Prompt:**

```
Tạo ảnh banner ngang tỉ lệ 16:9, kích thước 1920x1080, phong cách collage
kawaii Hàn Quốc dễ thương.

NỀN: màu xanh lá non rất nhạt (#EBF5DC), phủ hoạ tiết chấm bi nhỏ màu xanh lá
đậm hơn mờ nhẹ. Rắc thêm vài ngôi sao bốn cánh, chiếc lá nhỏ và cánh hoa mờ,
rải rác. Nền phẳng, tươi mát, không gradient loè loẹt.

SẢN PHẨM: dùng các bó hoa len, chậu hoa len và doll móc tay trong ảnh tôi tải
lên, cắt rời khỏi nền, sắp xếp rải đều khắp phần bên phải và giữa banner. Bó
hoa là món cao nhất nên đặt làm điểm nhấn, chậu nhỏ đặt thấp hơn. Mỗi món
nghiêng nhẹ một góc khác nhau (-8 đến +8 độ), bóng đổ mềm rất nhạt. KHÔNG chồng
lên nhau, KHÔNG chạm mép ảnh — chừa lề ít nhất 60px mọi phía. Giữ đúng màu sắc
và kiểu đan len của sản phẩm gốc.

NHÃN TÊN: cạnh mỗi món đặt một nhãn nhỏ hình viên thuốc bo tròn, nền trắng kem,
viền xanh lá mảnh 2px, chữ xanh lá đậm in thường. Nội dung theo đúng thứ tự sản
phẩm: "bó tốt nghiệp", "hướng dương", "bó hoa hồng", "chậu tulip", "doll cưới".

CHỮ LỚN: đặt ở 1/3 bên trái, chừa hẳn khoảng trống không có sản phẩm. Ba dòng,
font serif thanh lịch, màu xanh lá đậm:
dòng 1: "bó hoa này"
dòng 2: "không bao giờ"
dòng 3: "héo"  (dòng này in nghiêng)

GÓC DƯỚI BÊN TRÁI: một dòng chữ nhỏ, đậm, màu xanh lá đậm:
"*Hoa len, chậu để bàn, quà tốt nghiệp và quà cưới"

YÊU CẦU CHỮ: viết đúng tiếng Việt có dấu, tuyệt đối không sai dấu, không thêm
chữ nào ngoài những gì tôi ghi ở trên.

Tổng thể sáng sủa, thoáng, nhiều khoảng trống, cảm giác trong lành và thủ công.
```

---

## Nếu AI vẽ chưa ưng

Vài câu nhắc thêm, dán tiếp sau khi nó trả ảnh:

| Vấn đề | Câu bảo nó sửa |
|---|---|
| Sản phẩm chồng lên chữ | "Dời hết sản phẩm sang bên phải, chừa trống 1/3 bên trái cho chữ" |
| Món bị cắt mất ở mép | "Thu nhỏ các sản phẩm lại, chừa lề rộng hơn, đừng để món nào chạm mép ảnh" |
| Chữ sai dấu tiếng Việt | "Chữ tiếng Việt bị sai dấu. Viết lại đúng: ..." (ghi lại dòng đúng) |
| Nền rối quá | "Làm nền đơn giản lại, giảm hoạ tiết, tăng khoảng trống" |
| Sản phẩm to quá | "Thu nhỏ sản phẩm còn khoảng 2/3 kích thước hiện tại" |
| Màu bị lệch | "Giữ đúng màu len như trong ảnh tôi tải lên, đừng đổi màu" |

---

## Xong rồi thì

1. Đổi tên 6 file cho đúng: `moc-khoa`, `thu-bong`, `tui-vi`, `quan-ao`,
   `phu-kien`, `hoa-qua-tang` (đuôi gì cũng được, JPG hay PNG đều xong)
2. Bỏ hết vào `public/banners/`
3. Chạy `npm run webp` — ảnh đổi sang `.webp` cho nhẹ, trang chỉ đọc `.webp`
4. Chạy `npm run dev` rồi mở trang chủ — banner tự hiện thay khung trống

Chưa làm đủ 6 cái cũng không sao: cái nào có ảnh thì hiện ảnh, cái nào chưa thì
vẫn là khung trống, web vẫn chạy bình thường.
