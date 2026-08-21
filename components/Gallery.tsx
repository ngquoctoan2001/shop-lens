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

  // Phần thật sự bày ra lưới. Popup cũng chạy trên đúng danh sách này, nên
  // bấm "Tiếp" trong popup chỉ đi vòng quanh mấy mẫu đang thấy — không lôi
  // ra mẫu mà ngoài lưới còn đang giấu.
  const hienThi: Product[] = useMemo(
    () => (xemHet ? shown : shown.slice(0, soLuot * moiLuot)),
    [shown, xemHet, soLuot, moiLuot],
  );

  const conLai = shown.length - hienThi.length;

  // Kéo hẹp cửa sổ (12 mẫu mỗi lượt tụt xuống còn 9) có thể làm danh sách
  // ngắn lại ngay dưới chân cái ô popup đang mở — cứ đưa index cũ cho popup
  // thì nó trỏ vào ô trống rồi vỡ. Chốt lại ngay ở đây: ra ngoài tầm thì coi
  // như popup đang đóng.
  const chiSoMo =
    openIndex !== null && openIndex < hienThi.length ? openIndex : null;

  // Bấm nốt lượt cuối là cả cụm nút biến mất, con trỏ bàn phím rơi về <body>
  // — người dùng bàn phím bấm Tab tiếp là quay lại từ đầu trang. Nên khi nút
  // sắp mất thì dời con trỏ sang thẻ đầu tiên vừa mở ra.
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
      id={ID_KHU_SAN_PHAM}
      className="neo-muc border-y-2 border-border bg-bg-alt py-14 md:py-20"
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
          desc="Bấm vào ảnh để xem lớn hơn — ưng mẫu nào nhắn Zalo hoặc Messenger nhé."
        />

        {/* Thanh danh mục — cuộn ngang được trên điện thoại */}
        <div
          ref={thanhTabRef}
          role="tablist"
          aria-label="Lọc theo danh mục"
          className="no-scrollbar -mx-3.5 mb-10 flex gap-2.5 overflow-x-auto px-3.5 pb-3 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0 sm:pb-0"
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
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border-2 px-5 text-[14.5px] font-extrabold transition-[background-color,color,border-color,transform] duration-200 ${
                  on
                    ? "border-ink bg-ink text-bg"
                    : "border-border bg-card hover:-translate-y-0.5 hover:border-ink-soft"
                }`}
              >
                {t.name}
                <span className="text-xs font-bold opacity-60">{t.count}</span>
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

        {/* Cụm nút mở thêm. Ẩn hẳn khi đã bày hết — nút bấm vào không xảy ra
            gì còn tệ hơn là không có nút.
            "Xem tất cả" chỉ hiện khi còn dư HƠN một lượt: còn ít hơn thì hai
            nút làm y hệt nhau, bày cả hai chỉ tổ bắt người ta phải chọn giữa
            hai thứ giống nhau.
            Điện thoại thì hai nút không đủ chỗ nằm cạnh nhau, mà để chúng tự
            rớt dòng thì mỗi nút một bề ngang, so le trông rất luộm thuộm —
            nên xếp dọc và ép bằng nhau, chặn 320px kẻo nút dài kín mép màn
            hình trông như thanh trạng thái. Từ sm trở lên mới cho nằm ngang. */}
        {conLai > 0 && (
          <div className="mt-9 flex flex-col items-center gap-2.5 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
            <button
              type="button"
              onClick={xemTiep}
              aria-controls={ID_LUOI}
              // nut-tiep: móc cho mũi tên nhún xuống, luật nằm ở globals.css.
              // transition phải kê ĐÍCH DANH `translate`, y như chuyện `scale`
              // bên ProductCard: Tailwind v4 dịch -translate-y-1 ra thuộc tính
              // `translate` riêng chứ không gói vào `transform` nữa. Kê nhầm
              // `transform` là nút nhảy cụp một phát, không trôi mượt.
              // Rê chuột thì nhấc hẳn 4px (chứ không phải 2px như mấy nút
              // khác), nền đậm thêm một nấc, bóng đổ dài ra và có vòng sáng
              // hồng đào loang quanh viền — nút này là hành động chính của cả
              // khu sản phẩm nên cho nó phản hồi rõ hơn hẳn.
              // active:translate-y-0: bấm xuống thì nút hạ về chỗ cũ, có cảm
              // giác nhấn thật chứ không phải một hình vẽ đứng im.
              className="nut-tiep inline-flex min-h-12 w-full max-w-[320px] items-center justify-center gap-2 rounded-full border-2 border-ink bg-ink px-6 text-[14.5px] font-extrabold text-bg shadow-[var(--shadow-m)] ring-accent/45 transition-[translate,box-shadow,background-color] duration-200 ease-[cubic-bezier(.22,.61,.36,1)] hover:-translate-y-1 hover:bg-[#35271a] hover:shadow-[var(--shadow-l)] hover:ring-4 active:translate-y-0 active:duration-75 sm:w-auto sm:px-7 sm:text-[15px]"
            >
              Xem tiếp {Math.min(moiLuot, conLai)} sản phẩm
              <ChevronDownIcon className="mui-ten size-[18px]" />
            </button>

            {conLai > moiLuot && (
              <button
                type="button"
                onClick={xemTatCa}
                aria-controls={ID_LUOI}
                // Nút phụ đi cùng nhịp nhấc 4px với nút chính, nhưng khoe
                // theo kiểu khác cho khỏi thành hai nút chính: viền đổi sang
                // hồng đào và nền trắng phớt hồng lên — đúng cái nhịp mà thẻ
                // sản phẩm làm khi rê chuột, nên nhìn là thấy cùng một nhà.
                className="inline-flex min-h-12 w-full max-w-[320px] items-center justify-center rounded-full border-2 border-border bg-card px-6 text-[14.5px] font-extrabold transition-[translate,box-shadow,background-color,border-color] duration-200 ease-[cubic-bezier(.22,.61,.36,1)] hover:-translate-y-1 hover:border-accent hover:bg-[color-mix(in_srgb,var(--accent)_22%,var(--card))] hover:shadow-[var(--shadow-m)] active:translate-y-0 active:duration-75 sm:w-auto sm:px-7 sm:text-[15px]"
              >
                Xem tất cả {shown.length} mẫu
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

      {chiSoMo !== null && (
        <Lightbox
          items={hienThi}
          index={chiSoMo}
          onClose={() => setOpenIndex(null)}
          onNavigate={setOpenIndex}
        />
      )}
    </section>
  );
}
