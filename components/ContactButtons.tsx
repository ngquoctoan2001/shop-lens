import { fbLink, zaloDisplay, zaloLink } from "@/site.config";
import { ChatIcon, MessengerIcon } from "./Icons";

/**
 * Cặp nút "Nhắn Zalo" / "Nhắn Messenger".
 *
 * Khuyên tròn của Zalo lấy màu vàng mật (--accent-2) của shop thay vì xanh
 * dương thương hiệu — xanh dương chọi hẳn với bảng màu kem–nâu. Vẫn nhận ra
 * nút nhờ hình bong bóng chat và chữ, không cần mượn màu app.
 *
 * tone="light"  → dùng trên nền sáng
 * tone="dark"   → dùng trên nền nâu đậm (khối liên hệ cuối trang)
 */

const CHIP = "grid size-8 shrink-0 place-items-center rounded-full";
const ZALO_CHIP = `${CHIP} bg-accent-2 text-ink [--chip-bg:var(--accent-2)]`;
/** Dải màu chính thức của Messenger: xanh → tím → hồng → cam */
const MESS_CHIP = `${CHIP} text-white bg-[linear-gradient(43deg,#0099FF_10%,#A033FF_45%,#FF5280_75%,#FF7061_95%)]`;

const BTN =
  "group/btn inline-flex min-h-[54px] items-center gap-3 rounded-full pl-2.5 pr-6 text-[15px] font-extrabold shadow-[var(--shadow-m)] transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-l)]";

type Props = {
  tone?: "light" | "dark";
  /** true = hai nút xếp dọc, chiếm hết bề ngang */
  stacked?: boolean;
  className?: string;
};

export default function ContactButtons({
  tone = "light",
  stacked = false,
  className = "",
}: Props) {
  const zaloSkin =
    tone === "dark"
      ? "bg-bg text-ink hover:bg-white"
      : "bg-ink text-bg hover:bg-[#35271a]";

  const messSkin =
    tone === "dark"
      ? "bg-white/10 text-white ring-2 ring-inset ring-white/25 hover:bg-white/16"
      : "bg-card text-ink ring-2 ring-inset ring-border hover:ring-ink-soft";

  return (
    <div
      className={`flex gap-2.5 ${
        stacked ? "flex-col" : "flex-wrap justify-center"
      } ${className}`}
    >
      <a
        href={zaloLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`${BTN} ${zaloSkin} ${stacked ? "justify-center" : ""}`}
      >
        <span className={ZALO_CHIP} aria-hidden="true">
          <ChatIcon className="size-[18px]" />
        </span>
        <span className="flex flex-col items-start leading-tight">
          Nhắn Zalo
          <span className="text-[12.5px] font-bold opacity-65">
            {zaloDisplay}
          </span>
        </span>
      </a>

      <a
        href={fbLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`${BTN} ${messSkin} ${stacked ? "justify-center" : ""}`}
      >
        <span className={MESS_CHIP} aria-hidden="true">
          <MessengerIcon className="size-[18px]" />
        </span>
        <span className="flex flex-col items-start leading-tight">
          Nhắn Messenger
          <span className="text-[12.5px] font-bold opacity-65">
            Trả lời trong ngày
          </span>
        </span>
      </a>
    </div>
  );
}
