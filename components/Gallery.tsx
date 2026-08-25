"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { categories, products, type Product } from "@/lib/products";
import {
  docDanhMucTuDiaChi,
  ID_KHU_SAN_PHAM,
  SU_KIEN_CHON_DANH_MUC,
} from "@/lib/category";
import ProductCard from "./ProductCard";
import SectionHeading from "./SectionHeading";
import Lightbox from "./Lightbox";
import { ChevronDownIcon } from "./Icons";

const ALL = "tat-ca";

/** Id của khung lưới, để mấy nút danh mục khai aria-controls trỏ vào */
const ID_LUOI = "luoi-san-pham";

/**
 * Mỗi lượt mở thêm bao nhiêu mẫu, tính theo bề ngang màn hình.
 *
 * Mấy con số này KHÔNG phải chọn bừa — chúng bám theo đúng số cột của lưới ở
 * dưới để lượt nào cũng tròn hàng, không bao giờ để hở nửa hàng cuối (nhìn
 * như trang bị tải dở):
 *   >= 1280px (xl) : 4 cột × 3 hàng = 12
 *   >= 1024px (lg) : 3 cột × 3 hàng =  9
 *   hẹp hơn        : 2 cột × 4 hàng =  8
 * Sửa mấy mốc grid-cols ở className của lưới thì phải sửa luôn bảng này, kẻo
 * hai bên lệch nhau.
 *
 * Xếp từ rộng xuống hẹp để tìm cái khớp đầu tiên là ra ngay khổ đang dùng.
 */
const MOI_LUOT = [
  { tu: "(min-width: 1280px)", so: 12 },
  { tu: "(min-width: 1024px)", so: 9 },
] as const;

/** Khổ hẹp nhất — cũng là con số dùng cho bản HTML tĩnh, lúc chưa đo được màn hình */
const MOI_LUOT_HEP = 8;

/* ==========================================================================
   BỘ BA NÚT CUỐI LƯỚI
   "Xem thêm 12"  ·  "Tất cả 54"  ·  "Thu gọn"

   Nhãn giữ NGUYÊN MỘT BẢN ở mọi khổ màn hình. Trước đây điện thoại và máy
   tính dùng hai bản chữ dài ngắn khác nhau — cùng một nút mà hai cái tên, ai
   xem cả hai máy là thấy lệch ngay.

   ---- Một khuôn duy nhất, khác nhau ở cái áo ----

   Hai nút mở thêm đúc chung một khuôn: mấy chữ ngắn rồi tới CON SỐ để mờ đi
   (text-xs opacity-70). Đó cũng đúng là cách thanh danh mục ngay phía trên
   hiển thị số mẫu của từng nhóm, nên cả khu sản phẩm nói cùng một thứ tiếng.
   "Tất cả 54" còn lấy nguyên nhãn của thẻ danh mục đầu tiên.

   chính  "Xem thêm 12"  nền nâu đặc, chữ đậm nhất (800)
   phụ    "Tất cả 54"    nền trắng, viền chỉ tơ, chữ đậm vừa (700)
   nhẹ    "Thu gọn"      như nút phụ, nhưng CO VỪA CHỮ và mũi tên lật lên

   Thứ bậc nằm hết ở cái áo — nút nào nền nâu là việc nên làm tiếp. Không cần
   thêm icon hay khuyên tròn nào nữa: hai nút cùng khuôn, đọc lướt một cái là
   thấy chúng là hai lựa chọn của CÙNG một việc, chỉ khác liều lượng.

   ---- Mấy thứ làm bộ nút cũ trông thô, đã bỏ ----
     · border-2 quanh nút nâu — viền cùng màu với ruột, thuần trọng lượng thừa.
       Nét 2px trên nền kem là thứ lộ nhất; hai nút nền sáng giờ dùng chỉ tơ 1px.
     · hover:ring-4 — quầng sáng dày bung ra cùng lúc với cú nhấc, kiểu hào
       nhoáng đời cũ. Thay bằng bóng đổ dày thêm một nấc.
     · nhấc 4px khi rê chuột — quá đà cho một cái nút. Còn 2px.
     · "Thu gọn" kéo dài hết cỡ như hai nút kia — bảy chữ cái mà chiếm gần
       300px, nhìn như thanh trạng thái. Giờ nó chỉ rộng bằng nội dung.
     · "Thu gọn" để nền trong suốt — hoá ra trùng luôn màu nền khu sản phẩm,
       nút chìm nghỉm. Giờ nền trắng như nút phụ.

   Viền focus không khai ở đây: globals.css đã có luật :focus-visible chung
   cho cả trang (outline 3px màu --ring).
   ========================================================================== */

/** Phần chung của cả ba: viên thuốc cao 52px, chữ không xuống dòng.
 *  KHÔNG có flex-1 ở đây — nút nào cần giãn thì tự khai, để "Thu gọn" đứng
 *  một mình được co vừa bề ngang chữ. */
const NUT =
  "group/nut inline-flex min-h-[52px] items-center justify-center whitespace-nowrap rounded-full text-[14px] transition-[translate,box-shadow,background-color,color] duration-200 ease-[cubic-bezier(.22,.61,.36,1)] active:translate-y-0 active:duration-75 sm:text-[15px]";

/** Nút chính — cùng ruột với nút phụ ("chữ + số mờ"), chỉ khác cái áo: nền
 *  nâu đặc thay vì nền trắng. Đó là toàn bộ chỗ phân thứ bậc, khỏi cần thêm
 *  icon hay khuyên tròn nào nữa.
 *  Bóng --shadow-nut kèm vệt sáng 1px trong mép trên cho mặt nút hơi cong
 *  lên, không phẳng lì như miếng dán (xem globals.css). */
const NUT_CHINH =
  "shrink grow basis-0 gap-1.5 bg-ink px-4 font-extrabold text-bg shadow-[var(--shadow-nut)] hover:-translate-y-0.5 hover:bg-[#35271a] hover:shadow-[var(--shadow-nut-hover)] sm:grow-0 sm:basis-auto sm:px-6";

/** Nút phụ — nền trắng, viền chỉ tơ màu đào (--card-line, không phải --border:
 *  màu đó gần trùng nền khu sản phẩm nên nút mất mép). Rê chuột thì viền ngả
 *  hồng đào, nền phớt hồng — đúng nhịp thẻ sản phẩm làm, nhìn là thấy cùng nhà. */
const NUT_PHU =
  "shrink grow basis-0 gap-1.5 bg-card px-4 font-bold text-ink ring-1 ring-card-line shadow-[var(--shadow-s)] hover:-translate-y-0.5 hover:bg-[color-mix(in_srgb,var(--accent)_12%,var(--card))] hover:ring-accent hover:shadow-[var(--shadow-nut-phu-hover)] sm:grow-0 sm:basis-auto sm:px-6";

/** Nút nhẹ — mượn nguyên áo của nút phụ (nền trắng, viền chỉ tơ), chỉ khác là
 *  co vừa nội dung và có mũi tên lật lên.
 *  Trước đây nút này để nền trong suốt cho ra dáng "đường lùi", nhưng khu sản
 *  phẩm dùng nền kem đậm (--bg-alt) nên trong suốt hoá ra trùng luôn với nền
 *  — nút chìm nghỉm, không ai thấy. Mà lúc nó hiện thì nó là nút DUY NHẤT
 *  trên màn, chẳng tranh phần với ai, nên cho hẳn nền trắng là đúng. */
const NUT_NHE =
  "nut-thu gap-2 bg-card px-6 font-bold text-ink ring-1 ring-card-line shadow-[var(--shadow-s)] hover:-translate-y-0.5 hover:bg-[color-mix(in_srgb,var(--accent)_12%,var(--card))] hover:ring-accent hover:shadow-[var(--shadow-nut-phu-hover)]";

/**
 * Đọc số mẫu mỗi lượt theo bề ngang màn hình.
 *
 * Phải đo trong useEffect chứ không đo thẳng lúc dựng state: trang này xuất ra
 * web tĩnh (output: "export"), lúc dựng file HTML không có window nào để hỏi.
 * Nên bản tĩnh luôn ra số của khổ hẹp, rồi máy rộng hơn thì nhịp render đầu
 * tiên sau khi JS chạy sẽ nâng lên. Khu sản phẩm nằm dưới màn hình đầu cả
 * nghìn px nên không ai kịp thấy nhịp nâng đó — mà nếu người dùng tắt JS thì
 * vẫn còn 8 mẫu trong HTML để xem, không phải lưới rỗng.
 *
 * Nghe cả sự kiện "change" để xoay ngang/dọc máy tính bảng hay kéo cửa sổ là
 * số mỗi lượt đổi theo, khỏi phải tải lại trang.
 */
function useSoMoiLuot() {
  const [so, setSo] = useState<number>(MOI_LUOT_HEP);

  useEffect(() => {
    const dsMql = MOI_LUOT.map((m) => window.matchMedia(m.tu));
    const capNhat = () => {
      const i = dsMql.findIndex((mql) => mql.matches);
      setSo(i === -1 ? MOI_LUOT_HEP : MOI_LUOT[i].so);
    };

    capNhat();
    dsMql.forEach((mql) => mql.addEventListener("change", capNhat));
    return () =>
      dsMql.forEach((mql) => mql.removeEventListener("change", capNhat));
  }, []);

  return so;
}

export default function Gallery() {
  const [active, setActive] = useState<string>(ALL);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const thanhTabRef = useRef<HTMLDivElement>(null);
  const luoiRef = useRef<HTMLDivElement>(null);
  const khuRef = useRef<HTMLElement>(null);
  const nutTiepRef = useRef<HTMLButtonElement>(null);

  const moiLuot = useSoMoiLuot();
  /** Đã mở bao nhiêu lượt — nhân với moiLuot ra số mẫu đang bày */
  const [soLuot, setSoLuot] = useState(1);
  /** true khi đã bấm "Xem tất cả": bày hết, không đếm lượt nữa */
  const [xemHet, setXemHet] = useState(false);
  /**
   * Từ mẫu thứ mấy trở đi là vừa mở thêm — mấy thẻ đó mới chạy hiệu ứng hiện
   * lên. Phải là state chứ không phải ref: giá trị này đọc ngay trong lúc
   * dựng lưới, mà ref thì React không cho đọc lúc render.
   */
  const [mocMoi, setMocMoi] = useState(Infinity);
  /** true khi lượt vừa bấm làm biến mất luôn cái nút, phải dời con trỏ bàn phím */
  const matNut = useRef(false);
  /** true khi vừa bấm "Thu gọn" — lưới ngắn lại đột ngột, phải cuộn ngược lên */
  const vuaThuGon = useRef(false);

  /** Quay về lượt đầu — gọi mỗi lần đổi danh mục, vì danh sách thay mới hoàn toàn */
  const veLuotDau = () => {
    setSoLuot(1);
    setXemHet(false);
    setMocMoi(Infinity); // cả lưới đổi mới, để hiệu ứng thì rối mắt
  };

  // Bấm banner ở dải "Khám phá" thì lọc lưới theo danh mục đó. Nghe hai đường:
  //   - Sự kiện riêng: đường chính, bấm bao nhiêu lần cũng nổ.
  //   - hashchange: để nút Back/Forward của trình duyệt và link chia sẻ sẵn
  //     có dạng "#san-pham=thu-bong" vẫn chạy đúng.
  // Vì sao phải hai đường, xem chú thích đầu file lib/category.ts.
  useEffect(() => {
    const chon = (slug: string) => {
      if (!slug || !categories.some((c) => c.slug === slug)) return;
      setActive(slug);
      setOpenIndex(null);
      setSoLuot(1);
      setXemHet(false);
      setMocMoi(Infinity);
    };
    const theoDiaChi = () => chon(docDanhMucTuDiaChi());
    const theoSuKien = (e: Event) => chon((e as CustomEvent<string>).detail);

    theoDiaChi(); // mở trang bằng link có sẵn danh mục thì lọc luôn
    window.addEventListener("hashchange", theoDiaChi);
    window.addEventListener(SU_KIEN_CHON_DANH_MUC, theoSuKien);
    return () => {
      window.removeEventListener("hashchange", theoDiaChi);
      window.removeEventListener(SU_KIEN_CHON_DANH_MUC, theoSuKien);
    };
  }, []);

  // Toàn bộ sản phẩm của danh mục đang chọn — chưa cắt bớt theo lượt.
  const shown: Product[] = useMemo(
    () =>
      active === ALL
        ? products
        : products.filter((p) => p.categorySlug === active),
    [active],
  );

  // Phần thật sự bày ra lưới. Chỉ để VẼ lưới thôi — popup không đụng tới khúc
  // cắt này, xem chú thích ở chỗ dựng Lightbox cuối file.
  const hienThi: Product[] = useMemo(
    () => (xemHet ? shown : shown.slice(0, soLuot * moiLuot)),
    [shown, xemHet, soLuot, moiLuot],
  );

  const conLai = shown.length - hienThi.length;

  /**
   * Lưới đang dài hơn mặc định — tức là có cái để mà thu lại.
   *
   * Tính cả hai đường mở rộng: bấm "Xem tất cả" một phát (xemHet), hay bấm
   * "Xem tiếp" dăm lượt (soLuot > 1). Danh mục ít mẫu, bày hết ngay từ đầu thì
   * cả hai đều sai — không hiện nút thu gọn, đúng ý.
   */
  const daMoRong = xemHet || soLuot > 1;

  // Chốt an toàn: index nào rơi ra ngoài danh sách thì coi như popup đang
  // đóng, khỏi trỏ vào ô trống rồi vỡ. Đo theo `shown` — popup chạy trên trọn
  // danh mục nên kéo hẹp cửa sổ (12 mẫu mỗi lượt tụt còn 9) không còn làm cụt
  // danh sách dưới chân nó nữa; chỉ còn lúc đổi danh mục là `shown` ngắn lại,
  // mà đường đó đã setOpenIndex(null) sẵn rồi.
  const chiSoMo =
    openIndex !== null && openIndex < shown.length ? openIndex : null;

  // Bấm nốt lượt cuối là nút vừa bấm tháo khỏi trang (chỗ đó đổi thành "Thu
  // gọn"), con trỏ bàn phím rơi về <body> — bấm Tab tiếp là quay lại từ đầu
  // trang. Nên khi nút sắp mất thì dời con trỏ sang thẻ đầu tiên vừa mở ra:
  // mấy mẫu mới hiện chính là thứ người ta vừa xin xem.
  // preventScroll: mấy thẻ mới nằm PHÍA TRÊN cái nút, không chặn thì trình
  // duyệt kéo màn hình ngược lên, người bấm chuột thấy như trang bị giật.
  useEffect(() => {
    if (!matNut.current) return;
    matNut.current = false;
    luoiRef.current
      ?.querySelectorAll<HTMLButtonElement>("article > button")
      [mocMoi]?.focus({ preventScroll: true });
  }, [hienThi.length, mocMoi]);

  const tabs = [
    { slug: ALL, name: "Tất cả", count: products.length },
    ...categories,
  ];

  const changeCategory = (slug: string) => {
    setActive(slug);
    setOpenIndex(null); // đổi danh mục thì đóng popup cho khỏi lệch ảnh
    veLuotDau();
  };

  /** Ghi lại mốc để mấy thẻ sắp thêm vào biết mà chạy hiệu ứng */
  const danhDauMoc = (het: boolean) => {
    setMocMoi(hienThi.length);
    matNut.current = het;
  };

  const xemTiep = () => {
    danhDauMoc(conLai <= moiLuot);
    setSoLuot((n) => n + 1);
  };

  const xemTatCa = () => {
    danhDauMoc(true);
    setXemHet(true);
  };

  const thuGon = () => {
    vuaThuGon.current = true;
    veLuotDau();
  };

  /**
   * Thu gọn xong thì kéo người xem về đầu khu sản phẩm.
   *
   * Bấm "Thu gọn" lúc đang ở cuối 54 mẫu là trang thụt ngắn lại cả mấy nghìn
   * px trong một nhịp. Trình duyệt chỉ kẹp chỗ cuộn về đáy trang mới, nên
   * người xem bị quăng thẳng xuống chân trang — bấm một nút ở khu sản phẩm mà
   * mở mắt ra đã thấy footer. Cuộn về đỉnh khu là chỗ dễ hiểu nhất: lưới trở
   * lại y như lúc chưa bấm gì.
   *
   * .neo-muc trên thẻ <section> lo phần chừa chỗ cho thanh đầu trang, còn êm
   * hay giật là do scroll-behavior trong globals.css (tự tắt khi máy bật
   * "giảm chuyển động").
   *
   * Con trỏ bàn phím thì dời sang nút "Xem tiếp" — nút vừa bấm đã tháo khỏi
   * trang, không dời thì con trỏ rơi về <body>. Nút mới đứng đúng chỗ nút cũ
   * nên bấm tiếp là thấy liền. preventScroll kẻo nó kéo màn hình xuống lại,
   * huỷ mất cú cuộn ngay phía trên.
   */
  useEffect(() => {
    if (!vuaThuGon.current) return;
    vuaThuGon.current = false;
    khuRef.current?.scrollIntoView({ block: "start" });
    nutTiepRef.current?.focus({ preventScroll: true });
  }, [hienThi.length, soLuot, xemHet]);

  /**
   * Phím mũi tên trái/phải (và Home/End) để đi giữa các danh mục.
   *
   * Thanh này khai role="tablist" nên trình đọc màn hình sẽ hứa với người dùng
   * là điều khiển được bằng mũi tên. Thiếu đoạn này thì lời hứa đó sai. Đi kèm
   * là tabIndex bên dưới: chỉ mục đang chọn nhận phím Tab, để người dùng bấm
   * Tab một cái là qua hẳn thanh danh mục chứ không phải bấm bảy lần.
   */
  const phimTrenTab = (e: React.KeyboardEvent, i: number) => {
    const so = tabs.length;
    let ke: number;
    if (e.key === "ArrowRight") ke = (i + 1) % so;
    else if (e.key === "ArrowLeft") ke = (i - 1 + so) % so;
    else if (e.key === "Home") ke = 0;
    else if (e.key === "End") ke = so - 1;
    else return;

    e.preventDefault();
    changeCategory(tabs[ke].slug);
    thanhTabRef.current
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      [ke]?.focus();
  };

  // Khu sản phẩm dùng nền kem đậm (--bg-alt) + hai đường kẻ trên dưới để tách
  // hẳn khỏi khối "Về shop" ngay bên dưới — trước đó hai phần trôi liền một
  // dải kem, nhìn không rõ đâu là hết sản phẩm. Nền đậm hơn cũng làm thẻ sản
  // phẩm nền trắng nổi rõ hơn.
  return (
    <section
      ref={khuRef}
      id={ID_KHU_SAN_PHAM}
      className="neo-muc border-y-2 border-border bg-bg-alt bg-[image:var(--nen-san-pham)] py-14 md:py-20"
    >
      <div className="mx-auto w-[min(100%-1.75rem,1180px)] sm:w-[min(100%-2.5rem,1180px)]">
        <SectionHeading
          className="mb-10"
          eyebrow="Bộ sưu tập"
          title={
            <>
              Bạn nhỏ nào cũng <span className="marker">dễ thương</span>
            </>
          }
        />

        {/* Thanh danh mục.
            Trước đây trên điện thoại là một hàng cuộn ngang — nửa số danh mục
            khuất khỏi màn hình, ai không để ý là tưởng chỉ có bấy nhiêu. Giờ
            cho xếp thành nhiều hàng: thấy đủ 7 mục một lượt, khỏi cuộn. Chip
            thu nhỏ chữ và đệm ngang cho đỡ choán chỗ nhưng vẫn giữ đủ 44px
            chiều cao để bấm ngón tay không trượt. */}
        <div
          ref={thanhTabRef}
          role="tablist"
          aria-label="Lọc theo danh mục"
          className="mb-10 flex flex-wrap justify-center gap-2 sm:gap-2.5"
        >
          {tabs.map((t, i) => {
            const on = active === t.slug;
            return (
              <button
                key={t.slug}
                type="button"
                role="tab"
                id={`tab-${t.slug}`}
                aria-selected={on}
                // Thiếu aria-controls thì trình đọc màn hình xướng "tab" nhưng
                // không biết nó điều khiển cái gì — nghe như một nút chết.
                aria-controls={ID_LUOI}
                tabIndex={on ? 0 : -1}
                onKeyDown={(e) => phimTrenTab(e, i)}
                onClick={() => changeCategory(t.slug)}
                className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border-2 px-3.5 text-[13.5px] font-extrabold transition-[background-color,color,border-color,transform] duration-200 sm:gap-2 sm:px-5 sm:text-[14.5px] ${
                  on
                    ? "border-ink bg-ink text-bg"
                    : "border-border bg-card hover:-translate-y-0.5 hover:border-ink-soft"
                }`}
              >
                {t.name}
                {/* Số mẫu để mờ hơn tên danh mục cho đỡ tranh phần, nhưng chỉ
                    mờ tới 70% chứ không phải 60%: thẻ chưa chọn có nền trắng,
                    mà nâu cacao pha 60% trên trắng chỉ còn 3.70:1 — dưới
                    ngưỡng WCAG AA (cỡ 11–12px vẫn tính là chữ thường, không
                    được hưởng ngưỡng 3:1 của chữ lớn). 70% được 4.93:1.
                    Thẻ đang chọn thì nền nâu, chữ kem 60% vốn đã đạt 5.37:1,
                    nâng lên 70% chỉ càng rõ hơn — nên một con số dùng chung
                    cho cả hai trạng thái là đủ. */}
                <span className="text-[11px] font-bold opacity-70 sm:text-xs">
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Khung lưới chính là "tabpanel" mà mấy nút danh mục ở trên điều
            khiển. Khai role + aria-labelledby để trình đọc màn hình nối được
            nút với nội dung nó lọc ra. */}
        <div
          ref={luoiRef}
          id={ID_LUOI}
          role="tabpanel"
          aria-labelledby={`tab-${active}`}
          className="grid grid-cols-2 gap-3.5 sm:gap-[18px] lg:grid-cols-3 lg:gap-[22px] xl:grid-cols-4 xl:gap-[26px]"
        >
          {hienThi.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              onOpen={() => setOpenIndex(i)}
              // Chỉ mấy thẻ vừa mở thêm mới hiện lên có hiệu ứng; thẻ cũ đứng
              // yên. Thiếu vế này thì bấm "Xem tiếp" là cả lưới nhấp nháy lại
              // từ đầu.
              className={i >= mocMoi ? "animate-fade-up" : ""}
            />
          ))}
        </div>

        {/* Cụm nút cuối lưới. Còn mẫu chưa bày thì đây là hai nút mở thêm;
            bày hết rồi thì đúng chỗ ấy thành nút "Thu gọn". Không bao giờ có
            quá HAI nút — ba nút thì điện thoại không đủ một dòng, mà đó lại
            đúng là thứ cần tránh.
            "Tất cả N mẫu" chỉ hiện khi còn dư HƠN một lượt: còn ít hơn thì hai
            nút làm y hệt nhau, bày cả hai chỉ tổ bắt người ta phải chọn giữa
            hai thứ giống nhau.
            Áo của ba nút đặt ở đầu file (NUT, NUT_CHINH, NUT_PHU, NUT_NHE) —
            chỗ đó ghi rõ vì sao mỗi nút một dáng. */}
        {(conLai > 0 || daMoRong) && (
          <div className="mt-9 flex justify-center gap-2.5 sm:flex-wrap sm:gap-3">
            {conLai > 0 ? (
              <>
                <button
                  // key: bắt React dựng nút MỚI thay vì vá lại nút cũ.
                  // Không có key thì lúc đổi trạng thái React thấy hai bên đều
                  // mở đầu bằng một <button> nên nó giữ nguyên thẻ cũ và chỉ
                  // thay class — hoá ra nút nâu đặc "Thêm N mẫu" tự morph thành
                  // nút "Thu gọn" trong suốt: màu chạy hết 200ms trong khi bề
                  // rộng đã nhảy tức thì, nhìn như trang bị lỗi.
                  key="tiep"
                  ref={nutTiepRef}
                  type="button"
                  onClick={xemTiep}
                  aria-controls={ID_LUOI}
                  // transition trong NUT kê ĐÍCH DANH `translate`, y như chuyện
                  // `scale` bên ProductCard: Tailwind v4 dịch -translate-y-0.5 ra
                  // thuộc tính `translate` riêng chứ không gói vào `transform`
                  // nữa. Kê nhầm `transform` là nút nhảy cụp một phát.
                  // active:translate-y-0: bấm xuống thì nút hạ về chỗ cũ, có cảm
                  // giác nhấn thật chứ không phải một hình vẽ đứng im.
                  className={`${NUT} ${NUT_CHINH}`}
                >
                  Xem thêm
                  {/* Số mờ đi y như trên nút "Tất cả" và trên thanh danh mục.
                      70% chứ không phải 60% — lý do ghi ở nút "Tất cả". */}
                  <span className="text-xs font-bold opacity-70">
                    {Math.min(moiLuot, conLai)}
                  </span>
                </button>

                {conLai > moiLuot && (
                  <button
                    key="tat-ca"
                    type="button"
                    onClick={xemTatCa}
                    aria-controls={ID_LUOI}
                    className={`${NUT} ${NUT_PHU}`}
                  >
                    Tất cả
                    {/* Số đếm để mờ đi — cùng cách thanh danh mục phía trên
                        hiển thị số mẫu của từng nhóm, nhưng 70% chứ không
                        phải 60%: nâu cacao pha 60% trên nền trắng chỉ còn
                        3.70:1, dưới ngưỡng WCAG AA. 70% được 4.93:1, mắt vẫn
                        thấy nó lùi lại sau chữ. */}
                    <span className="text-xs font-bold opacity-70">
                      {shown.length}
                    </span>
                  </button>
                )}
              </>
            ) : (
              /* Bày hết rồi mới tới lượt nút này — đứng đúng chỗ hai nút kia
                 vừa rời đi, mũi tên lật ngược lên ra ý gấp lại. */
              <button
                key="thu-gon"
                type="button"
                onClick={thuGon}
                aria-controls={ID_LUOI}
                className={`${NUT} ${NUT_NHE}`}
              >
                Thu gọn
                <ChevronDownIcon className="mui-ten size-4 shrink-0 rotate-180" />
              </button>
            )}
          </div>
        )}

        {/* Bấm "Xem tiếp" thì lưới dài thêm ra một cách im lặng — người dùng
            trình đọc màn hình không biết chuyện gì vừa xảy ra. Ô này không
            hiện trên màn hình (sr-only), chỉ để mỗi lần số đổi là máy đọc
            xướng lên "đang xem bao nhiêu trên bao nhiêu". */}
        <p aria-live="polite" className="sr-only">
          {conLai > 0
            ? `Đang xem ${hienThi.length} trong ${shown.length} mẫu`
            : `Đang xem tất cả ${shown.length} mẫu`}
          {active !== ALL && " của danh mục này"}
        </p>
      </div>

      {/* Popup nhận TRỌN danh sách của danh mục đang chọn, không phải khúc
          đang bày trên lưới: bấm vào một thẻ rồi là "Tiếp" đi được hết 54 mẫu
          (hoặc hết cả danh mục đang lọc), chứ không cụt ngay ở mẫu 12/9/8 của
          lượt đầu — người xem đâu có phân biệt được đâu là mẫu đã tải, họ chỉ
          thấy popup tự quay vòng sớm một cách vô cớ.
          Index dùng chung được, không phải quy đổi gì: `hienThi` là khúc đầu
          của `shown`, cùng thứ tự và cùng gốc 0.
          Dải ảnh nhỏ trong popup vốn đã tính cho đúng cỡ này (ảnh mini 96px,
          loading="lazy"), nên bày 54 ô cũng không nặng thêm. */}
      {chiSoMo !== null && (
        <Lightbox
          items={shown}
          index={chiSoMo}
          onClose={() => setOpenIndex(null)}
          onNavigate={setOpenIndex}
        />
      )}
    </section>
  );
}
