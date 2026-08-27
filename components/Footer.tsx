import {
  fbLink,
  igLink,
  shopeeLink,
  site,
  ttLink,
  zaloLink,
} from "@/site.config";
import Logo from "./Logo";
import CurrentYear from "./CurrentYear";
import {
  FacebookIcon,
  FlowerIcon,
  InstagramIcon,
  ShopeeIcon,
  TikTokIcon,
  ZaloIcon,
} from "./Icons";

/**
 * Chân trang gọn: một hàng (logo · các icon mạng xã hội) rồi tới dòng bản quyền.
 *
 * Không lặp lại menu ở đây nữa: trên máy tính menu đã nằm sẵn trên header,
 * trên điện thoại thì có thanh nổi ở đáy màn hình (components/BottomNav.tsx)
 * lúc nào cũng trong tầm ngón cái.
 *
 * Mốc đổi kiểu là md (768px) — cùng mốc mà thanh nổi ở đáy tự ẩn đi và phần
 * đệm pb-28 chừa chỗ cho nó được trả về bình thường, nên cả chân trang đổi
 * dáng một lượt. Dưới md: xếp dọc, căn giữa hết. Từ md: logo bên trái, các
 * icon bên phải.
 */

/**
 * Nút tròn của các mạng xã hội.
 *
 * Rộng 44px cho ngón tay bấm trên điện thoại vẫn trúng. Lúc thường là
 * khuyên trắng viền kem, icon nâu (--accent-3); rê chuột vào thì đảo lại —
 * nền nâu, icon màu kem — kèm nhích lên nửa nấc cho mềm. Tất cả dùng chung
 * một tông nâu của shop, không mượn màu thương hiệu để khỏi chọi bảng màu.
 */
const SOCIAL =
  "grid size-11 place-items-center rounded-full border-2 border-border bg-card text-accent-3 shadow-[var(--shadow-s)] transition-[transform,color,background-color,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-accent-3 hover:bg-accent-3 hover:text-bg hover:shadow-[var(--shadow-m)]";

/** Các mạng xã hội của shop — thêm bớt ở đây là hàng icon tự đổi theo */
const MANG_XA_HOI = [
  { ten: "Zalo", href: zaloLink, Icon: ZaloIcon },
  { ten: "Facebook", href: fbLink, Icon: FacebookIcon },
  { ten: "Instagram", href: igLink, Icon: InstagramIcon },
  { ten: "TikTok", href: ttLink, Icon: TikTokIcon },
  { ten: "Shopee", href: shopeeLink, Icon: ShopeeIcon },
];

export default function Footer() {
  // Năm lúc build. Trên web tĩnh con số này đông cứng trong file HTML, nên
  // CurrentYear sẽ lấy năm thật của máy khách ghi đè lên — xem chú thích
  // trong components/CurrentYear.tsx.
  const namBuild = new Date().getFullYear();

  // pb-28 chừa chỗ cho thanh điều hướng nổi ở đáy màn hình điện thoại; từ md
  // trở lên không còn thanh đó nên trả về khoảng đệm thường.
  // Nền kem đậm (--bg-alt) dùng chung với khu sản phẩm, tách chân trang khỏi
  // nền kem sữa của phần nội dung phía trên.
  return (
    <footer className="mt-14 border-t-2 border-border bg-bg-alt bg-[image:var(--nen-footer)] pb-28 pt-8 md:mt-16 md:pb-7">
      <div className="mx-auto w-[min(100%-1.75rem,1180px)] sm:w-[min(100%-2.5rem,1180px)]">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5 md:justify-between">
          <div className="w-full md:w-auto">
            <Logo className="justify-center md:justify-start" />
            {/* Hai câu tách hẳn thành hai dòng, không để trình duyệt tự
                xuống dòng theo bề ngang — kiểu cũ hay cắt ngang giữa câu
                thành "... Mỗi bạn / nhỏ là một món quà." nhìn rất kỳ. */}
            <p className="mt-2 text-center text-[14px] font-medium text-ink-soft md:text-left">
              <span className="block">Tiệm len nhỏ, móc tay từng chiếc.</span>
              <span className="block">Mỗi bạn nhỏ là một món quà.</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {MANG_XA_HOI.map(({ ten, href, Icon }) => (
              <a
                key={ten}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${site.name} trên ${ten}`}
                title={ten}
                className={SOCIAL}
              >
                <Icon className="size-[21px]" />
              </a>
            ))}
          </div>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 border-t border-border pt-5 text-[13px] font-semibold text-ink-soft">
          © <CurrentYear namBuild={namBuild} /> {site.name} · Made with
          <FlowerIcon className="size-3 text-accent" />
          và rất nhiều len
        </p>
      </div>
    </footer>
  );
}
