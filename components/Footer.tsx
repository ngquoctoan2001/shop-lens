import { fbLink, site, zaloDisplay, zaloLink } from "@/site.config";
import Logo from "./Logo";
import CurrentYear from "./CurrentYear";
import { FlowerIcon } from "./Icons";

/**
 * Chân trang gọn: một hàng (logo · điều hướng · liên hệ) rồi tới dòng bản quyền.
 *
 * Lề âm -mx-3 là để bù phần đệm hai bên của mấy viên link — nhờ vậy chữ đầu
 * dòng thẳng hàng với logo chứ không bị thụt vào 12px.
 */

/** Viên link nhỏ, cao 44px cho ngón tay bấm trên điện thoại vẫn trúng */
const LINK =
  "inline-flex min-h-11 items-center rounded-full px-3 text-[14.5px] font-semibold text-ink-soft transition-colors hover:bg-bg-alt hover:text-ink";

export default function Footer() {
  // Năm lúc build. Trên web tĩnh con số này đông cứng trong file HTML, nên
  // CurrentYear sẽ lấy năm thật của máy khách ghi đè lên — xem chú thích
  // trong components/CurrentYear.tsx.
  const namBuild = new Date().getFullYear();

  // pb-28 chừa chỗ cho thanh điều hướng nổi ở đáy màn hình điện thoại; từ md
  // trở lên không còn thanh đó nên trả về khoảng đệm thường.
  return (
    <footer className="mt-14 border-t-2 border-border pb-28 pt-8 md:mt-16 md:pb-7">
      <div className="mx-auto w-[min(100%-1.75rem,1180px)] sm:w-[min(100%-2.5rem,1180px)]">
        <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-5">
          <div>
            <Logo />
            <p className="mt-2 max-w-[38ch] text-[14px] font-medium text-ink-soft">
              Tiệm len nhỏ, móc tay từng chiếc. Mỗi bạn nhỏ là một món quà.
            </p>
          </div>

          <div className="-mx-3 flex flex-col gap-y-0.5 sm:items-end">
            <nav className="flex flex-wrap" aria-label="Điều hướng chân trang">
              {site.nav.map((item) => (
                <a key={item.href} href={item.href} className={LINK}>
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex flex-wrap">
              <a
                href={zaloLink}
                target="_blank"
                rel="noopener noreferrer"
                className={LINK}
              >
                Zalo · {zaloDisplay}
              </a>
              <a
                href={fbLink}
                target="_blank"
                rel="noopener noreferrer"
                className={LINK}
              >
                Facebook
              </a>
            </div>
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
