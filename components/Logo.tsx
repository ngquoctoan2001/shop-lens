import Image from "next/image";
import Link from "next/link";
import { site } from "@/site.config";

/**
 * Logo shop. Ảnh nằm ở public/images/logo-mark.webp — muốn đổi logo khác thì
 * thay đúng file đó (ảnh vuông), không cần sửa gì trong code này.
 *
 * `priority` chỉ bật ở header vì đó là chỗ hiện ngay khi mở trang; footer nằm
 * dưới cùng nên để trình duyệt tải sau cho nhẹ.
 */
export default function Logo({
  className = "",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 ${className}`}
      aria-label={`${site.name} — về trang chủ`}
    >
      <Image
        src="/images/logo-mark.webp"
        alt=""
        width={80}
        height={80}
        sizes="40px"
        priority={priority}
        className="size-10 shrink-0 rounded-[14px] object-cover shadow-[var(--shadow-s)]"
      />
      <span className="leading-none">
        <span className="block font-display text-[21px] font-bold tracking-[-0.02em]">
          {site.name}
        </span>
        <span className="mt-1 block text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink-soft">
          {site.tagline}
        </span>
      </span>
    </Link>
  );
}
