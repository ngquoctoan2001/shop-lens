import ContactButtons from "./ContactButtons";
import { FlowerIcon } from "./Icons";

export default function ContactCTA() {
  return (
    <div
      id="lien-he"
      className="neo-muc mx-auto w-[min(100%-1.75rem,1180px)] sm:w-[min(100%-2.5rem,1180px)]"
    >
      {/* Thẻ trắng viền kem như thẻ sản phẩm / thẻ ba bước — không dùng nền
          nâu nữa, chữ đọc trên nền sáng */}
      <div className="relative overflow-hidden rounded-[34px] border-2 border-border bg-card px-6 py-12 text-center shadow-[var(--shadow-m)] sm:rounded-[44px] sm:px-11 sm:py-16">
        {/* Viền nét đứt bên trong — cùng họ với huy hiệu ở header và menu dưới */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[9px] rounded-[26px] border-2 border-dashed border-accent/45 sm:inset-3 sm:rounded-[33px]"
        />
        {/* Hai mảng màu loang chéo nhau cho khối đỡ trống */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-[60px] -top-[110px] size-[340px] rounded-full bg-accent opacity-25 blur-[64px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[130px] -left-[70px] size-[320px] rounded-full bg-accent-2 opacity-15 blur-[70px]"
        />

        <span className="relative inline-flex items-center gap-2 rounded-full border-2 border-dashed border-accent bg-card px-4 py-1.5 text-[12.5px] font-extrabold uppercase tracking-[0.16em] text-accent-3 shadow-[var(--shadow-s)]">
          <FlowerIcon className="size-3 text-accent" />
          Nhận custom theo ý bạn
        </span>

        <h2 className="relative mt-5 text-[clamp(29px,4vw,44px)] font-bold tracking-[-0.025em]">
          Muốn móc riêng <span className="marker">một bạn</span> cho mình?
        </h2>
        <p className="relative mx-auto mb-8 mt-4 max-w-[50ch] font-medium text-ink-soft">
          Gửi shop ảnh mẫu hoặc kể ý tưởng — màu gì, size bao nhiêu, tặng dịp
          nào. Shop báo giá và thời gian hoàn thành nha!
        </p>

        <ContactButtons tone="light" className="relative" />
      </div>
    </div>
  );
}
