import ContactButtons from "./ContactButtons";

export default function ContactCTA() {
  return (
    <div
      id="lien-he"
      className="neo-muc mx-auto w-[min(100%-1.75rem,1180px)] sm:w-[min(100%-2.5rem,1180px)]"
    >
      <div className="relative overflow-hidden rounded-[34px] bg-bg-deep px-6 py-12 text-center text-white sm:rounded-[44px] sm:px-11 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-[60px] -top-[110px] size-[340px] rounded-full bg-accent opacity-25 blur-[64px]"
        />

        <h2 className="relative text-[clamp(29px,4vw,44px)] font-bold tracking-[-0.025em] text-white">
          Muốn móc riêng một bạn cho mình?
        </h2>
        <p className="relative mx-auto mb-8 mt-4 max-w-[50ch] font-medium text-white/75">
          Gửi shop ảnh mẫu hoặc kể ý tưởng — màu gì, size bao nhiêu, tặng dịp
          nào. Shop báo giá và thời gian làm ngay nha!
        </p>

        <ContactButtons tone="dark" className="relative" />
      </div>
    </div>
  );
}
