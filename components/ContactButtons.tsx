import { fbLink, zaloDisplay, zaloLink } from "@/site.config";
import { ChatIcon, MessengerIcon } from "./Icons";

/**
 * Cặp nút "Nhắn Zalo" / "Nhắn Messenger".
 *
 * Khuyên tròn của Zalo lấy màu vàng mật (--accent-2) của shop thay vì xanh
 * dương thương hiệu — xanh dương chọi hẳn với bảng màu kem–nâu. Vẫn nhận ra
 * nút nhờ hình bong bóng chat và chữ, không cần mượn màu app.
 *
 * Trên điện thoại hai nút thu gọn lại cho vừa MỘT hàng: nút nhỏ hơn, bỏ dòng
 * chữ phụ, chữ rút còn "Nhắn Zalo" / "Nhắn Mes". Từ sm trở lên mới trả lại
 * dáng đầy đủ có số điện thoại và dòng "Trả lời trong ngày".
 *
 * tone="light"  → dùng trên nền sáng
 * tone="dark"   → dùng trên nền nâu đậm (khối liên hệ cuối trang)
 */

const CHIP =
  "grid size-7 shrink-0 place-items-center rounded-full sm:size-8";
const ZALO_CHIP = `${CHIP} bg-accent-2 text-ink [--chip-bg:var(--accent-2)]`;
/** Dải màu chính thức của Messenger: xanh → tím → hồng → cam */
const MESS_CHIP = `${CHIP} text-white bg-[linear-gradient(43deg,#0099FF_10%,#A033FF_45%,#FF5280_75%,#FF7061_95%)]`;

const BTN =
  "group/btn inline-flex items-center whitespace-nowrap rounded-full font-extrabold shadow-[var(--shadow-m)] transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-l)]";
/** Dáng gọn cho điện thoại — hai nút chia đôi một hàng */
const BTN_SNUG =
  "min-h-[46px] min-w-0 flex-1 basis-0 justify-center gap-2 px-3 text-[13.5px] sm:min-h-[54px] sm:flex-none sm:justify-start sm:gap-3 sm:pl-2.5 sm:pr-6 sm:text-[15px]";
/** Dáng đầy đủ khi xếp dọc */
const BTN_WIDE =
  "min-h-[54px] w-full justify-center gap-3 pl-2.5 pr-6 text-[15px]";
/** Dòng chữ phụ dưới tên nút — chỉ hiện từ màn hình sm trở lên */
const SUBLINE = "hidden text-[12.5px] font-bold opacity-65 sm:block";

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
  const shape = stacked ? BTN_WIDE : BTN_SNUG;

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
        stacked ? "flex-col" : "justify-center sm:flex-wrap"
      } ${className}`}
    >
      <a
        href={zaloLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`${BTN} ${shape} ${zaloSkin}`}
      >
        <span className={ZALO_CHIP} aria-hidden="true">
          <ChatIcon className="size-4 sm:size-[18px]" />
        </span>
        <span className="flex flex-col items-start leading-tight">
          Nhắn Zalo
          <span className={SUBLINE}>{zaloDisplay}</span>
        </span>
      </a>

      <a
        href={fbLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`${BTN} ${shape} ${messSkin}`}
      >
        <span className={MESS_CHIP} aria-hidden="true">
          <MessengerIcon className="size-4 sm:size-[18px]" />
        </span>
        <span className="flex flex-col items-start leading-tight">
          <span className="sm:hidden">Nhắn Mes</span>
          <span className="hidden sm:inline">Nhắn Messenger</span>
          <span className={SUBLINE}>Trả lời trong ngày</span>
        </span>
      </a>
    </div>
  );
}
