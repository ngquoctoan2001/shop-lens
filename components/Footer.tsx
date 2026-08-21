import { fbLink, site, zaloDisplay, zaloLink } from "@/site.config";
import { categories } from "@/lib/products";
import Logo from "./Logo";
import { FlowerIcon } from "./Icons";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t-2 border-border pb-8 pt-14 md:mt-20">
      <div className="mx-auto w-[min(100%-1.75rem,1180px)] sm:w-[min(100%-2.5rem,1180px)]">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div>
            <Logo />
            <p className="mt-3 max-w-[34ch] text-[14.5px] font-medium text-ink-soft">
              Tiệm len nhỏ, móc tay từng chiếc. Mỗi bạn nhỏ là một món quà.
            </p>
          </div>

          <div className="flex flex-wrap gap-10 sm:gap-11">
            <nav aria-labelledby="ft-danh-muc">
              <h3
                id="ft-danh-muc"
                className="mb-3 font-display text-[15px] font-semibold"
              >
                Danh mục
              </h3>
              {categories.map((c) => (
                <a
                  key={c.slug}
                  href="#san-pham"
                  className="flex min-h-11 items-center text-[14.5px] font-semibold text-ink-soft transition-colors hover:text-ink"
                >
                  {c.name}
                </a>
              ))}
            </nav>

            <nav aria-labelledby="ft-lien-he">
              <h3
                id="ft-lien-he"
                className="mb-3 font-display text-[15px] font-semibold"
              >
                Liên hệ
              </h3>
              <a
                href={zaloLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center text-[14.5px] font-semibold text-ink-soft transition-colors hover:text-ink"
              >
                Zalo · {zaloDisplay}
              </a>
              <a
                href={fbLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center text-[14.5px] font-semibold text-ink-soft transition-colors hover:text-ink"
              >
                Facebook
              </a>
            </nav>
          </div>
        </div>

        <p className="mt-10 flex items-center justify-center gap-1.5 border-t border-border pt-5 text-[13px] font-semibold text-ink-soft">
          © {year} {site.name} · Made with
          <FlowerIcon className="size-3 text-accent" />
          và rất nhiều len
        </p>
      </div>
    </footer>
  );
}
