import Image from "next/image";
import type { Product } from "@/lib/products";
import { ArrowRightIcon } from "./Icons";

type Props = {
  product: Product;
  onOpen: () => void;
  /** 8 ảnh đầu tải ngay, còn lại tải khi cuộn tới */
  eager?: boolean;
};

export default function ProductCard({ product, onOpen, eager }: Props) {
  return (
    // Lưới kéo <article> cao bằng ô cao nhất trong hàng, nhưng cái nút bên
    // trong thì không tự cao theo. Cho <article> thành flex để nút được kéo
    // giãn đầy — nhờ vậy các thẻ cùng hàng mới bằng nhau.
    <article className="group relative flex">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Xem ảnh lớn: ${product.name}`}
        // Viền mảnh 1px + bóng mềm, thay cho viền 2px dày cộm trước đây:
        // trên nền kem đậm thì viền dày chỉ làm thẻ trông như bị đóng khung.
        className="relative flex w-full flex-col overflow-hidden rounded-[24px] border border-border/80 bg-card text-left shadow-[var(--shadow-s)] transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(.22,.61,.36,1)] hover:-translate-y-1.5 hover:border-accent/60 hover:shadow-[var(--shadow-l)] sm:rounded-[30px]"
      >
        <div className="relative aspect-square overflow-hidden bg-bg-alt">
          <Image
            src={product.image}
            alt={product.name}
            fill
            loading={eager ? "eager" : "lazy"}
            sizes="(max-width: 520px) 45vw, (max-width: 1024px) 33vw, 280px"
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.22,.61,.36,1)] group-hover:scale-[1.06]"
          />
        </div>

        {/* Một nhịp giãn cách duy nhất bằng gap, thay cho mỗi dòng một mb-*
            mỗi kiểu. Dòng cuối đẩy xuống đáy bằng mt-auto nên các thẻ cùng
            hàng đều thẳng chân. */}
        <div className="flex flex-1 flex-col gap-2 p-4 sm:gap-2.5 sm:p-5">
          {/* Danh mục dời từ nhãn đè lên ảnh xuống thành dòng dẫn ở đây: ảnh
              sạch hẳn, mà thứ tự đọc lại rõ — danh mục → tên → mô tả → hành
              động. Màu chữ lấy từ --cat-ink của chính danh mục đó. */}
          <span
            className={`cat-eyebrow cat-${product.categorySlug} inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em]`}
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

          {/* Chữ "Xem chi tiết" trơ trọi trông như link chưa làm xong. Ghép
              thêm nút tròn mũi tên ở góc phải cho thẻ có điểm neo rõ ràng. */}
          <div className="mt-auto flex items-center gap-3 pt-1.5">
            {/* Máy hẹp dưới 360px thì thẻ chỉ còn ~105px bề ngang, chữ này bị
                ép xuống hai dòng trông rất luộm thuộm — ẩn đi, để một mình
                nút mũi tên làm dấu hiệu bấm được. */}
            <span className="hidden text-[12px] font-extrabold text-ink-soft min-[360px]:inline sm:text-[14px]">
              Xem chi tiết
            </span>
            <span
              aria-hidden="true"
              className="ml-auto grid size-9 shrink-0 place-items-center rounded-full bg-bg-alt text-ink transition-[background-color,color] duration-300 group-hover:bg-ink group-hover:text-bg sm:size-10"
            >
              <ArrowRightIcon className="size-4 transition-transform duration-500 ease-[cubic-bezier(.22,.61,.36,1)] group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </button>
    </article>
  );
}
