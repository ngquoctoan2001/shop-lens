import type { ReactNode } from "react";
import { FlowerIcon } from "./Icons";

/**
 * Cụm tiêu đề dùng chung cho các phần giữa trang (Khám phá / Bộ sưu tập /
 * Đặt hàng thế nào).
 *
 * Trước đây dòng chữ nhỏ phía trên chỉ là chữ in hoa trơn nên chìm nghỉm
 * giữa nền kem. Giờ nó nằm trong huy hiệu viền nét đứt — đúng kiểu nhãn
 * "Nhận đặt móc theo yêu cầu" ở đầu trang — nên cả trang thống nhất một
 * ngôn ngữ.
 *
 * `title` nhận JSX chứ không phải chuỗi để bọc được một cụm từ trong
 * <span className="marker">, chỗ đó sẽ có vệt bút highlight hồng đào.
 * Lưu ý: .marker đặt white-space: nowrap nên chỉ quét cụm ngắn, quét cả
 * câu dài là tràn ngang trên điện thoại.
 *
 * Quicksand chỉ có tới weight 700 nên h2 giữ font-bold — đặt font-extrabold
 * trình duyệt phải tự bôi đậm giả, chữ bệt và xấu hơn.
 */
export default function SectionHeading({
  eyebrow,
  title,
  desc,
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  desc?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-[620px] text-center ${className}`}>
      <span className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-dashed border-accent bg-card px-4 py-1.5 text-[12.5px] font-extrabold uppercase tracking-[0.16em] text-accent-3 shadow-[var(--shadow-s)]">
        <FlowerIcon className="size-3 text-accent" />
        {eyebrow}
      </span>

      <h2 className="text-[clamp(31px,4.4vw,50px)] font-bold tracking-[-0.03em]">
        {title}
      </h2>

      {desc ? <p className="mt-4 font-medium text-ink-soft">{desc}</p> : null}
    </div>
  );
}
