import Image from "next/image";
import type { Product } from "@/lib/products";
import { ArrowRightIcon } from "./Icons";

type Props = {
  product: Product;
  onOpen: () => void;
  /** Lớp gắn thêm vào <article> — Gallery dùng để chạy hiệu ứng hiện lên
      cho mấy thẻ vừa mở thêm ở nút "Xem tiếp" */
  className?: string;
};

export default function ProductCard({ product, onOpen, className = "" }: Props) {
  return (
    // Lưới kéo <article> cao bằng ô cao nhất trong hàng, nhưng cái nút bên
    // trong thì không tự cao theo. Cho <article> thành flex để nút được kéo
    // giãn đầy — nhờ vậy các thẻ cùng hàng mới bằng nhau.
    // hover:z-10: thẻ phóng to lên 1.03 sẽ tràn qua thẻ bên cạnh, không nâng
    // z-index thì mép nó chui xuống dưới thẻ đứng sau trong lưới.
    <article className={`group relative flex hover:z-10 ${className}`}>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Xem ảnh lớn: ${product.name}`}
        // Viền mảnh 1px + bóng mềm, thay cho viền 2px dày cộm trước đây:
        // trên nền kem đậm thì viền dày chỉ làm thẻ trông như bị đóng khung.
        // Mảnh thì mảnh nhưng phải có màu: --card-line ngả đào, đủ tách mép
        // thẻ khỏi nền kem. Hover đẩy hẳn lên accent nguyên độ — để accent/60
        // như cũ thì nó sáng ngang viền lúc nghỉ, rê chuột vào như không đổi.
        // Rê chuột thì thẻ phóng to tại chỗ (scale) thay vì nhấc lên xuống —
        // cả lưới đứng yên, mắt không bị giật theo từng thẻ nảy lên.
        // transition phải kê ĐÍCH DANH `scale`: Tailwind v4 dịch scale-[1.03]
        // ra thuộc tính `scale` riêng chứ không gói vào `transform` nữa. Danh
        // sách cũ chỉ có transform nên hover là thẻ nhảy cái rụp, không mượt.
        // active:scale-[0.98] là nhịp "lún xuống" lúc bấm giữ — trên điện
        // thoại đây là phản hồi DUY NHẤT báo thẻ bấm được, vì máy cảm ứng
        // không có hover. duration-100 để lún tức thì cho giống bấm nút thật;
        // lúc thả tay class biến mất, thẻ bung về theo nhịp 500ms mượt sẵn.
        className="stitch relative flex w-full flex-col overflow-hidden rounded-[24px] border border-card-line bg-card text-left shadow-[var(--shadow-s)] transition-[scale,box-shadow,border-color] duration-500 ease-[cubic-bezier(.22,.61,.36,1)] hover:scale-[1.03] hover:border-accent hover:shadow-[var(--shadow-l)] active:scale-[0.98] active:duration-100 sm:rounded-[30px]"
      >
        {/* Ô ảnh vuông. Giữ vuông bằng .khung-ti-le chứ không phải
            aspect-square — luật và lý do nằm ở app/globals.css.

            w-full và shrink-0 KHÔNG phải cho đẹp, thiếu chúng là mất ảnh trên
            Safari/iPhone. Hai lý do riêng biệt:

            w-full — chiều cao ô này do miếng chêm padding-top:100% dựng lên,
            mà padding phần trăm phải đo theo một bề ngang có thật. Không khai
            width thì bề ngang chỉ có được nhờ flex kéo giãn (align-items:
            stretch), tức là mãi tới giữa chừng quá trình xếp chỗ mới biết —
            trong khi chiều cao lại cần biết trước. WebKit gặp vòng luẩn quẩn
            đó thì trả về 0. Khai thẳng width:100% (đo theo bề ngang cái nút,
            vốn đã biết chắc) là cắt đứt vòng đó.

            shrink-0 — ô này có overflow-hidden, mà theo chuẩn flexbox thì
            overflow khác visible sẽ hạ min-height:auto xuống 0. Nghĩa là ô
            được phép bị bóp tới tận 0 khi flex thấy thiếu chỗ. Chặn co lại là
            dù có tính hụt cỡ nào nó cũng không xẹp mất.

            Ba chỗ vá cùng đợt — Hero, BannerCarousel, Lightbox — vốn đã khai
            sẵn bề ngang từ trước nên không dính; đó cũng là lý do ảnh trong
            popup vẫn hiện bình thường trong khi ảnh thẻ thì mất. */}
        <div className="khung-ti-le relative w-full shrink-0 overflow-hidden bg-bg-alt">
          {/* Dùng bản thumb 500px chứ KHÔNG phải ảnh gốc. Ô này rộng 165px
              trên điện thoại, 274px trên máy tính — 500px là đã dư cho cả màn
              hình nét cao. Trang xuất ra web tĩnh nên <Image> không tự thu nhỏ
              được, phải tự trỏ đúng cỡ (xem lib/products.ts).
              Để "lazy" hết: khu sản phẩm nằm dưới màn hình đầu chừng 1400px,
              tải sẵn chỉ giành băng thông với ảnh đầu trang mà người xem còn
              chưa cuộn tới. */}
          <Image
            src={product.imageThumb}
            alt={product.name}
            fill
            loading="lazy"
            sizes="(max-width: 520px) 45vw, (max-width: 1024px) 33vw, 280px"
            // Cả thẻ đã phóng 1.03 rồi, ảnh chỉ cần thêm một nhịp nhẹ nữa là
            // đủ; để nguyên 1.06 như hồi thẻ đứng yên thì cộng dồn thành ~1.09,
            // ảnh phình quá tay so với khung.
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.22,.61,.36,1)] group-hover:scale-[1.04]"
          />
        </div>

        {/* Một nhịp giãn cách duy nhất bằng gap, thay cho mỗi dòng một mb-*
            mỗi kiểu.

            pt-7/pt-9 to hơn padding còn lại là CỐ Ý: chừa chỗ cho nút mũi tên
            vắt qua mép ảnh ngay bên dưới. Nút cao 36px (sm: 44px) thò xuống
            đúng một nửa, cộng viền trắng 4px là chiếm 22px (sm: 26px) tính từ
            đỉnh ruột thẻ — pt phải lớn hơn chừng đó, kẻo dòng danh mục chui
            xuống dưới nút. */}
        <div className="relative flex flex-1 flex-col gap-2 p-4 pt-7 sm:gap-2.5 sm:p-5 sm:pt-9">
          {/* NÚT MŨI TÊN — dấu hiệu "bấm được" của cả thẻ.

              Trước đây nó nằm tuốt dưới đáy, xám nhạt, đi kèm chữ "Xem chi
              tiết" lặp lại ở cả chục thẻ. Bỏ chữ đi thì phải để cái nút tự nói
              được, nên đổi ba thứ:

              1. Vắt qua mép ảnh (-top nửa chiều cao) + viền trắng ring-4 —
                 kiểu nút nổi quen thuộc, mắt đọc ra ngay là "bấm vào đây".
                 Viền trắng ăn theo nền thẻ nên nút như được khoét ra khỏi ảnh
                 chứ không phải dán đè lên.
              2. Nền accent + bóng ngay từ lúc nghỉ, không đợi rê chuột. Máy
                 cảm ứng không có trạng thái hover, mọi hiệu ứng chỉ chạy khi
                 rê chuột thì trên điện thoại thẻ trông chết cứng.
              3. Nằm ngay dưới mép ảnh nên mọi thẻ cùng hàng đều thẳng một
                 dòng — ảnh vuông, bề ngang bằng nhau. Đặt dưới đáy như cũ thì
                 phải nhờ mt-auto mới thẳng được.

              Vẫn là <span aria-hidden> chứ không phải <button>: cả thẻ đã là
              một cái nút rồi, lồng nút trong nút là HTML sai và trình đọc màn
              hình sẽ đọc thành hai đích bấm. */}
          <span
            aria-hidden="true"
            className="absolute -top-[18px] right-4 z-[3] grid size-9 place-items-center rounded-full bg-accent text-bg-deep shadow-[var(--shadow-m)] ring-4 ring-card transition-[background-color,color,scale] duration-300 ease-[cubic-bezier(.22,.61,.36,1)] group-hover:scale-110 group-hover:bg-ink group-hover:text-bg sm:-top-[22px] sm:right-5 sm:size-11"
          >
            <ArrowRightIcon className="size-4 transition-transform duration-500 ease-[cubic-bezier(.22,.61,.36,1)] group-hover:translate-x-0.5 sm:size-[18px]" />
          </span>

          {/* Danh mục dời từ nhãn đè lên ảnh xuống thành dòng dẫn ở đây: ảnh
              sạch hẳn, mà thứ tự đọc lại rõ — danh mục → tên → mô tả.
              Màu chữ lấy từ --cat-ink của chính danh mục đó. */}
          <span
            className={`cat-eyebrow cat-${product.categorySlug} inline-flex items-center gap-1 font-extrabold uppercase sm:gap-1.5`}
          >
            {product.categoryName}
          </span>

          {/* Quicksand chỉ có tới weight 700 nên giữ font-bold. Đặt
              font-extrabold là trình duyệt bôi đậm giả, chữ bệt nhòe.
              text-balance chia đều hai dòng, khỏi rớt lại một chữ lẻ loi. */}
          <h3 className="text-balance text-[16px] font-bold leading-[1.25] sm:text-[20px]">
            <span className="title-swipe">{product.name}</span>
          </h3>

          <p className="text-pretty text-[13px] font-medium leading-[1.55] text-ink-soft sm:text-[14px]">
            {product.desc}
          </p>
        </div>
      </button>
    </article>
  );
}
