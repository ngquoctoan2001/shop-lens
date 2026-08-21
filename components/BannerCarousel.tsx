"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { BANNER_RATIO } from "@/lib/banners";
import { chonDanhMuc } from "@/lib/category";
import { ArrowRightIcon, PauseIcon, PlayIcon } from "./Icons";

export type BannerCard = {
  slug: string;
  name: string;
  count: number;
  image: string;
  /** màu chữ đè lên ảnh, chọn riêng cho từng banner (xem lib/banners.ts) */
  mauChu: string;
  /** ảnh đã nằm trong public/banners/ chưa — kiểm tra lúc dựng trang */
  coAnh: boolean;
};

/** Bao lâu thì tự sang tấm kế tiếp */
const DOI_SAU = 5000;
/** Lướt tay xong thì nghỉ chừng này rồi mới tự chạy tiếp */
const NGHI_SAU_KHI_LUOT = 8000;
/** Ngưng cuộn chừng này (ms) thì mới lén dời dải về bản giữa */
const CHO_LANG = 120;
/** Chép dải banner ra mấy bản đặt liền nhau để cuộn thành vòng tròn */
const SO_BAN = 3;
/** Bản đứng giữa — chỗ neo, lúc nào cũng kéo người xem về quanh đây */
const BAN_GIUA = 1;
/** Rê chuột quá bao nhiêu px thì mới tính là kéo dải, chưa tới thì vẫn là bấm */
const NGUONG_KEO = 4;

/**
 * Số đo của khung cuộn, đo một lần rồi nhớ lại.
 *
 * `moc[i]` là chỗ cần cuộn tới để tấm thứ i về đúng chỗ nó phải dừng — giữa
 * khung hay sát lề trái là tuỳ scroll-snap-align của tấm (xem doKhung).
 * `cuoiDuong` là chỗ cuộn xa nhất có thể.
 *
 * Vì sao phải nhớ: getComputedStyle và offsetLeft đều bắt trình duyệt tính
 * lại bố cục ngay tại chỗ. Đọc chúng trong hàm chạy theo từng khung hình cuộn
 * — với 6 banner nhân 3 bản là 18 lần đọc mỗi khung — thì máy yếu và điện
 * thoại cuộn sẽ rít. Mấy con số này chỉ đổi khi cửa sổ đổi cỡ, nên đo một lần
 * là đủ, còn lại chỉ tính cộng trừ.
 */
type SoDo = { moc: number[]; cuoiDuong: number };

const doKhung = (track: HTMLElement): SoDo => {
  const le = parseFloat(getComputedStyle(track).paddingLeft) || 0;
  // Đo bằng getBoundingClientRect chứ không dùng offsetLeft: offsetLeft làm
  // tròn về số nguyên, mà bề rộng banner tính theo vw nên hầu như luôn lẻ
  // (màn 1440 mỗi tấm 604.8px). Chỗ dời dải nối vòng lấy hiệu của hai mốc nên
  // sai số làm tròn ở đó cộng dồn lên gấp đôi — đo số lẻ thì khỏi lo.
  //
  // Đổi từ hệ toạ độ màn hình về hệ toạ độ cuộn: cộng lại chỗ đang cuộn, trừ
  // đi mép trong bên trái của khung (viền + lề).
  const goc = track.getBoundingClientRect().left + track.clientLeft;
  const truot = track.scrollLeft;

  // Tấm dừng ở giữa khung hay dừng sát mép trái là do CSS quyết: điện thoại
  // snap-center (mỗi lần một tấm, nằm giữa màn), từ sm trở lên snap-start
  // (mấy tấm xếp cạnh nhau). Đọc ngược lại từ CSS chứ đừng ghi cứng bên này —
  // ghi cứng thì hôm nào sửa lớp Tailwind là chấm tròn với tự chạy nhắm lệch
  // chỗ ngay, mà lỗi kiểu đó rất khó lần ra.
  //
  // scroll-snap-align viết được hai giá trị "<khối> <dòng>"; khung này cuộn
  // ngang nên phần mình cần là giá trị DÒNG, tức giá trị cuối.
  const dau = track.firstElementChild;
  const canh = dau
    ? getComputedStyle(dau).scrollSnapAlign.trim().split(/\s+/)
    : [];
  const canGiua = canh[canh.length - 1] === "center";
  const nuaKhung = track.clientWidth / 2;

  return {
    moc: Array.from(track.children, (con) => {
      const o = (con as HTMLElement).getBoundingClientRect();
      const trai = truot + o.left - goc;
      // Căn giữa: kéo sao cho TÂM tấm trùng tâm khung.
      // Căn mép: kéo sao cho mép trái tấm về sát lề trong của khung.
      return canGiua ? trai + o.width / 2 - nuaKhung : trai - le;
    }),
    cuoiDuong: track.scrollWidth - track.clientWidth,
  };
};

/** Bề rộng đúng một vòng banner (n tấm + n khe hở). Đo bằng khoảng cách giữa
 *  tấm đầu của hai bản liền nhau, khỏi phải cộng tay bề rộng tấm với gap —
 *  gap đổi theo breakpoint, cộng tay là sai. */
const beRongVong = (soDo: SoDo, soTam: number) =>
  soDo.moc.length > soTam ? soDo.moc[soTam] - soDo.moc[0] : 0;

/**
 * Dải banner tự đổi tấm, cuộn vòng tròn, vẫn lướt tay hoặc kéo chuột được.
 *
 * Ruột vẫn là khung cuộn ngang thật của trình duyệt (overflow-x-auto +
 * scroll-snap) chứ không phải transform giả lập. Nhờ vậy vuốt trên điện thoại
 * có đà trượt tự nhiên, bàn di chuột hai ngón vẫn chạy, phím Tab vẫn tới được
 * từng banner. Phần viết thêm chỉ có ba việc: hẹn giờ cuộn sang tấm kế, cho
 * kéo bằng chuột (chuột không tự kéo được khung cuộn), và nối hai đầu dải lại
 * thành vòng tròn.
 *
 * Vòng tròn làm bằng cách chép dải ra SO_BAN bản giống hệt xếp liền nhau, thả
 * người xem đứng ở bản giữa. Vuốt tới tấm cuối thì tấm kế đã có sẵn ở bản sau
 * — không hề đụng tường. Cuộn lắng xuống rồi thì lén dời scrollLeft đúng một
 * vòng để về lại bản giữa: ba bản giống hệt nhau nên trên màn hình không đổi
 * lấy một pixel, mà hai bên lúc nào cũng còn đường để vuốt tiếp.
 *
 * Tự chạy sẽ ngưng khi: rê chuột/focus vào, đang lướt (và 8 giây sau đó), dải
 * banner trôi khỏi màn hình, người xem bấm nút dừng, hoặc máy đang bật chế độ
 * "giảm chuyển động".
 */
export default function BannerCarousel({ cards }: { cards: BannerCard[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const soTam = cards.length;
  /** Một tấm thì chẳng có gì mà vòng; chép ra cũng vô ích. */
  const quayVong = soTam > 1;
  const banGiua = quayVong ? BAN_GIUA : 0;
  const soBan = quayVong ? SO_BAN : 1;

  /** Tấm đang xem, đếm theo danh sách GỐC (0…soTam-1) — hàng chấm dùng số này */
  const [index, setIndex] = useState(0);
  /** Tấm đang xem, đếm theo dải ĐÃ CHÉP (0…soTam*soBan-1) — phần cuộn dùng số này */
  const viTriRef = useRef(0);

  const [batTuChay, setBatTuChay] = useState(true); // nút dừng/chạy
  const [reVao, setReVao] = useState(false); // rê chuột hoặc focus vào
  const [vuaLuot, setVuaLuot] = useState(false); // vừa lướt tay / kéo chuột
  const [trongTam, setTrongTam] = useState(true); // còn nằm trong màn hình
  const [giamChuyenDong, setGiamChuyenDong] = useState(false);

  const dangTuChay =
    quayVong && batTuChay && !reVao && !vuaLuot && trongTam && !giamChuyenDong;

  /* --- Kéo bằng chuột. Cảm ứng thì trình duyệt tự lo, khỏi đụng vào ---
     Khai báo sớm vì chỗ dời dải cần biết có đang kéo dở hay không. */
  const keo = useRef({ dang: false, tuX: 0, tuScroll: 0, daDiChuyen: false });
  const hoiSuc = useRef<ReturnType<typeof setTimeout>>(undefined);

  /* --- Số đo khung cuộn, đo lười rồi nhớ lại (xem chú thích ở doKhung) --- */
  const soDoRef = useRef<SoDo | null>(null);

  const laySoDo = useCallback((track: HTMLElement): SoDo => {
    // Đo lại khi chưa có, hoặc khi số tấm trong dải đã khác đi so với lần đo
    // trước — nghĩa là danh sách banner vừa đổi.
    if (soDoRef.current?.moc.length !== track.children.length) {
      soDoRef.current = doKhung(track);
    }
    return soDoRef.current;
  }, []);

  /* Đổi cỡ cửa sổ là mọi số đo cũ hết giá trị: bề rộng banner tính theo vw,
     mà khe hở giữa các tấm cũng đổi theo breakpoint. */
  useEffect(() => {
    const boNho = () => {
      soDoRef.current = null;
    };
    window.addEventListener("resize", boNho, { passive: true });
    return () => window.removeEventListener("resize", boNho);
  }, []);

  /* --- Cuộn tới tấm thứ i của dải đã chép, về đúng chỗ nó phải dừng ---
     Điện thoại thì tấm dừng giữa màn, từ sm trở lên thì dừng sát lề trái.
     Không tự quyết ở đây — doKhung đã đọc scroll-snap-align rồi tính sẵn mốc,
     nên chỗ mình nhắm tới luôn trùng khít điểm snap của trình duyệt. Lệch một
     tí là cuộn xong nó tự kéo giật thêm một nhịp nữa, nhìn rất cợn. */
  const den = useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track) return;
      const moc = laySoDo(track).moc[i];
      if (moc === undefined) return;
      track.scrollTo({ left: moc, behavior: "smooth" });
    },
    [laySoDo],
  );

  /* --- Lén dời dải về bản giữa: đây là chỗ duy nhất tạo ra cảm giác vòng tròn.
     Dời đúng bội số của một vòng nên hình trên màn không đổi, và vì mọi tấm
     cách nhau đúng một khoảng nên chỗ đáp vẫn là một điểm snap hợp lệ. */
  const veBanGiua = useCallback(() => {
    const track = trackRef.current;
    // Đang kéo chuột thì đừng đụng vào: hàm kéo lấy scrollLeft lúc bấm xuống
    // làm mốc, dời ngang xương giữa chừng là tay đi một đằng dải chạy một nẻo.
    if (!track || !quayVong || keo.current.dang) return;

    const soDo = laySoDo(track);
    const vong = beRongVong(soDo, soTam);
    // Một vòng phải dài hơn khung nhìn thì hai bên mới đủ đường mà lùi. Ít
    // banner quá (hoặc màn siêu rộng) thì thôi, để nó cuộn thẳng như dải thường
    // còn hơn giật tới giật lui.
    if (!vong || vong <= track.clientWidth) return;

    const neo = soDo.moc[soTam * BAN_GIUA];
    if (neo === undefined) return;
    const buoc = Math.round((track.scrollLeft - neo) / vong);
    // Lùi đúng một (hoặc mấy) vòng. Bản giữa và bản kế giống hệt nhau tới
    // từng pixel nên hình trên màn giữ nguyên.
    //
    // Nói cho ngay: không tuyệt đối 100%. Trình duyệt chỉ giữ scrollLeft ở số
    // nguyên pixel, mà banner rộng theo vw nên một vòng thường lẻ (màn 1440:
    // một vòng 3748.78px). Lùi một vòng là hụt/dư tối đa nửa pixel, đủ để tấm
    // ló ra ngoài cùng bên phải xê một pixel. Đã thử nhắm thẳng vào mốc đã đo
    // của tấm tương ứng: y hệt, vì nút thắt nằm ở chỗ scrollLeft làm tròn chứ
    // không phải ở phép trừ. Máy thật màn dày pixel (DPR 2–3) còn lệch ít hơn.
    if (buoc !== 0) track.scrollLeft -= buoc * vong;
  }, [quayVong, soTam, laySoDo]);

  /* --- Vào trang thì đứng sẵn ở bản giữa, để vuốt ngược lại cũng có đường ---
     Đặt thẳng scrollLeft chứ không "smooth": ba bản giống hệt nhau nên nhảy
     từ bản đầu sang bản giữa mắt không nhận ra gì. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !quayVong) return;
    const dau = laySoDo(track).moc[soTam * BAN_GIUA];
    if (dau === undefined) return;
    track.scrollLeft = dau;
    viTriRef.current = soTam * BAN_GIUA;
    setIndex(0);
  }, [quayVong, soTam, laySoDo]);

  /* --- Đang xem tấm nào: lấy tấm có mép trái gần chỗ đang cuộn nhất --- */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let cho = 0;
    let langNghe: ReturnType<typeof setTimeout>;

    const doLai = () => {
      cancelAnimationFrame(cho);
      cho = requestAnimationFrame(() => {
        const { moc, cuoiDuong } = laySoDo(track);
        const dangO = track.scrollLeft;
        let gan = 0;
        let lechIt = Infinity;

        moc.forEach((m, i) => {
          const lech = Math.abs(m - dangO);
          if (lech < lechIt) {
            lechIt = lech;
            gan = i;
          }
        });

        viTriRef.current = gan;
        setIndex(gan % soTam);

        // Sắp cụng vào một trong hai đầu dải thì dời ngay, không đợi lắng
        // nữa: đợi thêm là người xem đụng tường thật, vuốt tiếp không nhúc
        // nhích — đúng cái cảnh cần tránh.
        const mot = beRongVong({ moc, cuoiDuong }, soTam) / soTam;
        if (mot && (dangO < mot || dangO > cuoiDuong - mot)) {
          veBanGiua();
        }
      });

      // Bình thường thì đợi cuộn dừng hẳn mới dời. Dời giữa chừng là cú vuốt
      // đang trớn bị cắt ngang, khựng lại một cái rất khó chịu (rõ nhất trên
      // iOS). Cuộn còn chạy thì hẹn giờ này cứ bị dời lại, không bao giờ nổ.
      clearTimeout(langNghe);
      langNghe = setTimeout(veBanGiua, CHO_LANG);
    };

    doLai();
    track.addEventListener("scroll", doLai, { passive: true });
    return () => {
      cancelAnimationFrame(cho);
      clearTimeout(langNghe);
      track.removeEventListener("scroll", doLai);
    };
  }, [soTam, veBanGiua, laySoDo]);

  /* --- Hẹn giờ tự đổi tấm --- */
  useEffect(() => {
    if (!dangTuChay) return;
    const hen = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;

      const { moc, cuoiDuong } = laySoDo(track);
      const dich = (i: number) => Math.min(moc[i], cuoiDuong);

      // Cứ nhích thêm một tấm là xong — hết bản này đã có bản sau nối vào, còn
      // việc dời về bản giữa đã có veBanGiua lo.
      let ke = viTriRef.current + 1;
      // Chỉ khi KHÔNG quay vòng được mới có chuyện hết dải, hoặc mấy tấm cuối
      // lùi không hết cỡ về lề nên chỗ dừng trùng nhau — cứ đổi tiếp thì banner
      // đứng im nguyên một nhịp 5 giây. Gặp vậy thì quay về tấm đầu.
      if (ke >= moc.length || Math.abs(dich(ke) - track.scrollLeft) < 8) {
        ke = soTam * banGiua;
      }

      // Ghi số thứ tự ngay tại đây chứ không đợi sự kiện cuộn báo về. Đợi thì
      // nhịp sau vẫn thấy số cũ và nhắm lại đúng tấm vừa rồi — banner đứng ì
      // một chỗ. Người xem tự lướt thì sự kiện cuộn sẽ chỉnh lại cho khớp.
      viTriRef.current = ke;
      setIndex(ke % soTam);
      den(ke);
    }, DOI_SAU);
    return () => clearInterval(hen);
  }, [dangTuChay, soTam, banGiua, den, laySoDo]);

  /* --- Bấm chấm thì tới BẢN GẦN NHẤT của tấm đó, khỏi chạy ngược cả dải --- */
  const denTam = useCallback(
    (iGoc: number) => {
      const dang = viTriRef.current;
      let chon = iGoc;
      for (let ban = 1; ban < soBan; ban++) {
        const ung = ban * soTam + iGoc;
        if (Math.abs(ung - dang) < Math.abs(chon - dang)) chon = ung;
      }
      viTriRef.current = chon;
      setIndex(iGoc);
      den(chon);
    },
    [soBan, soTam, den],
  );

  /* --- Máy đang bật "giảm chuyển động" thì không tự chạy --- */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const doc = () => setGiamChuyenDong(mq.matches);
    doc();
    mq.addEventListener("change", doc);
    return () => mq.removeEventListener("change", doc);
  }, []);

  /* --- Trôi khỏi màn hình thì thôi chạy cho đỡ tốn --- */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const theoDoi = new IntersectionObserver(
      ([o]) => setTrongTam(o.isIntersecting),
      { threshold: 0.2 },
    );
    theoDoi.observe(track);
    return () => theoDoi.disconnect();
  }, []);

  useEffect(() => () => clearTimeout(hoiSuc.current), []);

  const batDauLuot = (e: React.PointerEvent<HTMLDivElement>) => {
    clearTimeout(hoiSuc.current);
    setVuaLuot(true);
    // Bấm phát mới thì xoá dấu "vừa kéo" của phát cũ. Xoá cho mọi loại con
    // trỏ, kể cả ngón tay: máy màn cảm ứng dùng lẫn chuột với tay, kéo bằng
    // chuột xong mà cú chạm kế tiếp còn thấy dấu cũ là nó bị nuốt oan.
    keo.current.daDiChuyen = false;

    if (e.pointerType !== "mouse") return;
    const track = trackRef.current;
    if (!track) return;
    keo.current = {
      dang: true,
      tuX: e.clientX,
      tuScroll: track.scrollLeft,
      daDiChuyen: false,
    };
    // Chưa giữ con trỏ, chưa tắt snap ở đây — đợi tay đi thật rồi mới làm.
    // Lý do nằm ở dangLuot.
  };

  /** Dọn dẹp sau một lượt kéo chuột: trả con trỏ, bật snap, dời dải về giữa */
  const ketThucKeo = (pointerId: number) => {
    const track = trackRef.current;
    if (!keo.current.dang || !track) return;
    keo.current.dang = false;
    if (track.hasPointerCapture(pointerId)) {
      track.releasePointerCapture(pointerId);
    }
    // Bật snap lại là trình duyệt tự bắt về tấm gần nhất.
    track.style.scrollSnapType = "";
    // Nhả tay xong mới tới lượt dời dải — lúc kéo thì veBanGiua tự né.
    veBanGiua();
  };

  const dangLuot = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!keo.current.dang) return;
    const track = trackRef.current;
    if (!track) return;

    // Nhả chuột ở ngoài dải trong lúc chưa giữ con trỏ thì không có pointerup
    // nào chạy tới đây. Thấy nút chuột đã nhả từ lúc nào là tự dọn, kẻo lần
    // sau rê chuột ngang qua dải là nó tưởng đang kéo dở rồi cuốn theo tay.
    if (e.buttons === 0) {
      ketThucKeo(e.pointerId);
      return;
    }

    const lech = e.clientX - keo.current.tuX;

    // Chỉ khi tay đi quá NGUONG_KEO mới coi là kéo dải — và cũng chỉ tới lúc
    // đó mới giữ con trỏ.
    //
    // Giữ con trỏ ngay từ lúc bấm xuống (bản cũ) thì hỏng chuyện bấm banner:
    // trình duyệt bẻ luôn cả pointerup lẫn mouseup về khung cuộn, nên cú click
    // sinh ra sau đó nhận khung cuộn làm đích chứ không phải thẻ <a> nữa —
    // onClick của banner không bao giờ chạy, mà trình duyệt cũng chẳng nhảy
    // theo href. Bấm vào banner y như bấm vào chỗ trống.
    if (!keo.current.daDiChuyen) {
      if (Math.abs(lech) <= NGUONG_KEO) return;
      keo.current.daDiChuyen = true;
      // Kéo tay mà vẫn bật scroll-snap thì nó giật về liên tục, tắt tạm.
      track.style.scrollSnapType = "none";
      // Giờ mới giữ con trỏ, để kéo ra ngoài dải vẫn chạy tiếp.
      try {
        track.setPointerCapture(e.pointerId);
      } catch {
        /* không giữ được con trỏ thì thôi, kéo trong lòng dải vẫn được */
      }
    }

    track.scrollLeft = keo.current.tuScroll - lech;
  };

  const thoiLuot = (e: React.PointerEvent<HTMLDivElement>) => {
    ketThucKeo(e.pointerId);
    hoiSuc.current = setTimeout(() => setVuaLuot(false), NGHI_SAU_KHI_LUOT);
  };

  /** Kéo xong chuột nhả ra hay dính vào banner, chặn kẻo nhảy trang oan */
  const chanBamNham = (e: React.MouseEvent) => {
    if (!keo.current.daDiChuyen) return;
    keo.current.daDiChuyen = false;
    e.preventDefault();
    e.stopPropagation();
  };

  /**
   * Bấm vào một banner: lọc lưới sản phẩm theo danh mục đó rồi cuộn xuống.
   *
   * Thẻ <a> vẫn giữ nguyên href thật để giữa chuột / Ctrl+bấm mở tab mới vẫn
   * ra đúng danh mục, và để máy tìm kiếm còn thấy đường dẫn. Chỉ cú bấm trái
   * thường mới chặn lại — vì tự trình duyệt nó KHÔNG cuộn được: nó đi tìm
   * phần tử có id "san-pham=thu-bong", chẳng có cái nào tên vậy.
   */
  const bamBanner = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    // chanBamNham chạy trước ở pha capture; nó đã chặn thì đây là cú nhả tay
    // sau khi kéo dải, không phải người xem muốn bấm.
    if (e.defaultPrevented) return;
    // Mở tab mới / cửa sổ mới thì để trình duyệt tự lo theo href.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    chonDanhMuc(slug);
  };

  /* Dải đã chép: soBan bản nối đuôi nhau. `ban` là bản thứ mấy, `i` là số thứ
     tự trong danh sách gốc. */
  const daiBanner = Array.from({ length: soBan }, (_, ban) =>
    cards.map((c, i) => ({ c, i, ban })),
  ).flat();

  return (
    <div
      onMouseEnter={() => setReVao(true)}
      onMouseLeave={() => setReVao(false)}
      onFocusCapture={() => setReVao(true)}
      onBlurCapture={() => setReVao(false)}
    >
      <div
        ref={trackRef}
        onPointerDown={batDauLuot}
        onPointerMove={dangLuot}
        onPointerUp={thoiLuot}
        onPointerCancel={thoiLuot}
        onClickCapture={chanBamNham}
        onDragStart={(e) => e.preventDefault()}
        // Khe hở trên điện thoại rộng hẳn 32px, không phải cho đẹp mà để đẩy
        // tấm kế ra hẳn ngoài màn: tấm rộng (100vw - 32px) căn giữa thì mỗi
        // bên còn chừa 16px, cộng thêm khe 32px nữa là tấm bên cạnh bắt đầu ở
        // 100vw + 16px — khuất hẳn. Khe này nằm ngoài màn nên không ai thấy.
        className="no-scrollbar flex cursor-grab snap-x snap-mandatory gap-8 overflow-x-auto pb-4 active:cursor-grabbing sm:gap-5"
      >
        {daiBanner.map(({ c, i, ban }) => {
          /* Bản giữa mới là bản "thật": trình đọc màn hình và phím Tab chỉ làm
             việc với nó. Hai bản chép kia thuần để mắt nhìn cho liền mạch, mở
             cho đọc nữa thì cùng một banner bị xướng tên tới ba lần. */
          const that = ban === banGiua;
          return (
            <a
              key={`${ban}-${c.slug}`}
              href={`#san-pham=${c.slug}`}
              onClick={(e) => bamBanner(e, c.slug)}
              aria-hidden={that ? undefined : true}
              tabIndex={that ? undefined : -1}
              aria-label={
                that ? `Xem nhóm ${c.name} — ${c.count} mẫu` : undefined
              }
              // Điện thoại: mỗi lần đúng MỘT tấm, nằm giữa màn. Tấm rộng gần
              // hết bề ngang (chừa 16px mỗi bên làm lề) và snap-center để nó
              // dừng ngay chính giữa. Từ sm trở lên màn rộng rãi, quay lại
              // kiểu cũ — xếp mấy tấm cạnh nhau, căn mép trái.
              className="khung-ti-le group relative w-[calc(100vw-2rem)] shrink-0 snap-center overflow-hidden rounded-[24px] shadow-[var(--shadow-m)] transition-transform duration-300 hover:-translate-y-1 sm:w-[52vw] sm:snap-start sm:rounded-[32px] lg:w-[42vw]"
              // Khung 16:9 dựng bằng .khung-ti-le (xem app/globals.css) chứ
              // không phải aspect-ratio — lý do ghi ở BANNER_RATIO.
              style={{ "--ti-le": BANNER_RATIO } as CSSProperties}
            >
              {c.coAnh ? (
                <>
                  <Image
                    src={c.image}
                    alt={that ? c.name : ""}
                    fill
                    // Banner tự đổi sau 5 giây nên ba tấm đầu phải tải sẵn, để
                    // lười tải thì tới lượt nó mới tải, người xem thấy ô trống
                    // chớp một cái. Ba tấm sau cứ để tải khi cuộn gần tới.
                    // Chỉ tính trên bản giữa — bản người xem thấy lúc mới vào;
                    // hai bản chép dùng lại đúng đường dẫn ấy nên có sẵn trong
                    // bộ nhớ đệm, không tốn thêm lượt tải nào.
                    priority={that && i === 0}
                    loading={that && i < 3 ? "eager" : "lazy"}
                    draggable={false}
                    sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) 52vw, 560px"
                    className="select-none object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  {/* Vệt sáng mờ ở đỉnh. Sáu ảnh đang dùng đều để trống góc
                      trên nên không có nó chữ vẫn đọc được, nhưng chủ shop
                      thay ảnh khác lúc nào cũng được — có vệt này thì lỡ ảnh
                      mới có hoạ tiết đậm chạy lên đó chữ cũng không chìm. */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/60 via-white/20 to-transparent"
                  />
                  {/* Chữ nằm hẳn trên góc trái, mũi tên tụt xuống góc phải
                      dưới. Trước đây cả cụm nằm dưới đáy, đè đúng dòng chú
                      thích in sẵn trong ảnh ("*14 bạn bông móc tay…").

                      Lề tính theo phần trăm chứ không phải p-4/p-5: khung
                      banner khoá tỉ lệ 16:9 nên lề co giãn cùng tấm ảnh, chữ
                      luôn dừng trên khoảng 26% chiều cao — vừa đủ nằm trọn
                      phía trên dòng chữ lớn in trong ảnh, kể cả tấm phụ kiện
                      có chữ bắt đầu sớm nhất. */}
                  <div
                    className="absolute inset-0 flex flex-col justify-between p-[4%]"
                    style={{
                      color: c.mauChu,
                      // Quầng trắng mỏng quanh nét chữ. Trên nền pastel phẳng
                      // thì không ai thấy, nhưng tên danh mục dài (như "Thú
                      // bông Amigurumi") lúc xem bằng điện thoại có chạm vào
                      // sừng con bò / tai con heo ở mép phải — quầng này tách
                      // nét chữ khỏi món đồ, khỏi phải kê thêm mảng nền đục.
                      textShadow:
                        "0 1px 2px rgba(255,255,255,.9), 0 0 10px rgba(255,255,255,.75)",
                    }}
                  >
                    <div>
                      <h3 className="text-base font-bold leading-tight lg:text-xl">
                        {c.name}
                      </h3>
                      <p className="text-[12px] font-bold leading-tight lg:text-[13px]">
                        {c.count} mẫu
                      </p>
                    </div>
                    <span className="grid size-9 shrink-0 select-none place-items-center self-end rounded-full bg-white/90 ring-1 ring-black/5 transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowRightIcon className="size-[18px]" />
                    </span>
                  </div>
                </>
              ) : (
                /* --- Khung trống chờ thả ảnh vào --- */
                /* absolute inset-0 chứ không phải h-full: khung cha lấy chiều
                   cao từ padding-top, nên "cao 100%" ở đây sẽ ra 0. Trải kín
                   khung bằng inset-0 thì đúng trong mọi trường hợp. */
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 border-[3px] border-dashed border-border bg-bg-alt p-5 text-center">
                  <span className="rounded-full border-2 border-dashed border-accent bg-card px-3.5 py-1.5 text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-accent-3">
                    Chưa có ảnh
                  </span>
                  <h3 className="text-lg font-bold sm:text-xl">{c.name}</h3>
                  <p className="text-[13px] font-semibold text-ink-soft">
                    {c.count} mẫu
                  </p>
                  <code className="mt-1 rounded-lg bg-card px-2.5 py-1 font-mono text-[11px] font-bold text-ink-soft sm:text-xs">
                    public{c.image}
                  </code>
                </div>
              )}
            </a>
          );
        })}
      </div>

      {/* --- Hàng chấm + nút dừng --- */}
      {quayVong && (
        <div className="mx-auto flex w-[min(100%-1.75rem,1180px)] items-center justify-center gap-1 sm:w-[min(100%-2.5rem,1180px)]">
          {cards.map((c, i) => {
            const dangXem = i === index;
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => {
                  clearTimeout(hoiSuc.current);
                  setVuaLuot(true);
                  hoiSuc.current = setTimeout(
                    () => setVuaLuot(false),
                    NGHI_SAU_KHI_LUOT,
                  );
                  denTam(i);
                }}
                aria-label={`Xem banner ${c.name}`}
                aria-current={dangXem ? "true" : undefined}
                // Chấm chỉ cao 8px, nhưng nút bọc ngoài cao 44px cho dễ bấm
                className="grid h-11 place-items-center px-2"
              >
                <span
                  className={`block h-2 overflow-hidden rounded-full transition-[width,background-color] duration-300 ${
                    dangXem ? "w-8 bg-border" : "w-2 bg-border hover:bg-ink-soft"
                  }`}
                >
                  {dangXem && (
                    <span
                      // Đổi key để vạch chạy lại từ đầu mỗi lần sang tấm mới
                      key={`${index}-${dangTuChay}`}
                      className={`block h-full rounded-full bg-accent-3 ${
                        dangTuChay ? "banner-progress" : "w-full"
                      }`}
                    />
                  )}
                </span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setBatTuChay((v) => !v)}
            aria-label={batTuChay ? "Dừng tự chuyển banner" : "Tự chuyển banner"}
            className="ml-1 grid size-11 place-items-center rounded-full text-ink-soft transition-[background-color,color] duration-200 hover:bg-bg-alt hover:text-ink"
          >
            {batTuChay ? <PauseIcon /> : <PlayIcon />}
          </button>
        </div>
      )}
    </div>
  );
}
