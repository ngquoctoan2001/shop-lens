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
    <article className="group relative">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Xem ảnh lớn: ${product.name}`}
        className="stitch relative block w-full overflow-hidden rounded-[24px] border-2 border-border bg-card text-left shadow-[var(--shadow-s)] transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(.34,1.4,.64,1)] hover:-translate-y-2 hover:-rotate-[0.7deg] hover:border-accent hover:shadow-[var(--shadow-l)] sm:rounded-[32px]"
      >
        <div className="relative aspect-square overflow-hidden bg-bg-alt">
          <Image
            src={product.image}
            alt={product.name}
            fill
            loading={eager ? "eager" : "lazy"}
            sizes="(max-width: 520px) 45vw, (max-width: 1024px) 33vw, 280px"
            className="object-cover transition-transform duration-[550ms] ease-[cubic-bezier(.2,.7,.3,1)] group-hover:scale-[1.07]"
          />
          <span className="absolute left-2.5 top-2.5 z-[3] rounded-full bg-card px-2.5 py-1.5 text-[10px] font-extrabold shadow-[var(--shadow-s)] sm:left-3 sm:top-3 sm:px-3 sm:text-[11.5px]">
            {product.categoryName}
          </span>
        </div>

        <div className="px-3.5 pb-4 pt-3.5 sm:px-5 sm:pb-5 sm:pt-[18px]">
          <h3 className="mb-1 text-[15.5px] font-semibold sm:text-[19px]">
            {product.name}
          </h3>
          <p className="mb-2.5 text-[12px] font-semibold text-ink-soft sm:mb-3.5 sm:text-[13.5px]">
            {product.desc}
          </p>
          <span className="inline-flex items-center gap-1.5 text-[12.5px] font-extrabold text-ring sm:text-sm">
            Xem chi tiết
            <ArrowRightIcon className="size-4 transition-transform duration-250 group-hover:translate-x-1" />
          </span>
        </div>
      </button>
    </article>
  );
}
