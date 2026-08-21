import { site } from "@/site.config";
import { FlowerIcon } from "./Icons";

/**
 * Dải băng chữ chạy ngang, hơi nghiêng cho vui mắt.
 * Danh sách được lặp 2 lần để vòng chạy nối liền không bị hụt.
 */
export default function Marquee() {
  const items = [...site.marquee, ...site.marquee];

  return (
    <div className="mt-6 overflow-hidden">
      <div className="-rotate-[1.1deg] scale-[1.06] overflow-hidden bg-ink py-4 text-bg">
        <div
          className="animate-marquee flex w-max gap-9 whitespace-nowrap font-display text-base"
          aria-hidden="true"
        >
          {items.map((text, i) => (
            <span key={i} className="flex items-center gap-9">
              {text}
              <FlowerIcon className="size-3.5 text-accent" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
