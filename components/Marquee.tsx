import { site } from "@/site.config";
import { FlowerIcon } from "./Icons";

/**
 * Số lần lặp danh sách trong một dải. Vòng chạy dịch sang trái đúng một nửa
 * dải nên chỗ nối không thấy mối; lặp nhiều lần (chứ không phải 2) là để nửa
 * dải luôn dài hơn màn hình — có vậy màn hình rộng mới không bị hở khoảng
 * trống lúc chạy hết chữ.
 */
const LOOPS = 6;

/** Chạy hết một lượt danh sách mất chừng này giây. Sửa để nhanh/chậm hơn. */
const SECONDS_PER_LOOP = 32;

/**
 * Dải băng chữ chạy ngang, nằm ngay dưới banner đầu trang và trên phần
 * "Khám phá". Không đặt lề dưới ở đây — phần "Khám phá" ngay sau đã có sẵn
 * lề trên rồi, thêm nữa là hở một khoảng trống to.
 * Chỉ để trang trí nên ẩn với trình đọc màn hình (chữ đã lặp lại nhiều lần).
 */
export default function Marquee() {
  const items = Array.from({ length: LOOPS }, () => site.marquee).flat();

  return (
    <div className="marquee-band py-3.5 md:py-4" aria-hidden="true">
      <div className="marquee-fade overflow-hidden">
        <div
          className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap font-display text-[11px] font-bold uppercase tracking-[0.2em] text-accent-3 sm:gap-10 sm:text-[12.5px]"
          style={{ animationDuration: `${(LOOPS / 2) * SECONDS_PER_LOOP}s` }}
        >
          {items.map((text, i) => (
            <span key={i} className="flex items-center gap-8 sm:gap-10">
              {text}
              <FlowerIcon className="size-3 shrink-0 text-accent" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
