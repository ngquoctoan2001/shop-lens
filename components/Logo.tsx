import Link from "next/link";
import { site } from "@/site.config";
import { YarnIcon } from "./Icons";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 ${className}`}
      aria-label={`${site.name} — về trang chủ`}
    >
      <span className="grid size-10 shrink-0 -rotate-6 place-items-center rounded-[14px] bg-accent text-bg-deep shadow-[var(--shadow-s)]">
        <YarnIcon className="size-[23px]" />
      </span>
      <span className="leading-none">
        <span className="block font-display text-[21px] font-semibold tracking-[-0.02em]">
          {site.name}
        </span>
        <span className="-mt-0.5 block text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink-soft">
          {site.tagline}
        </span>
      </span>
    </Link>
  );
}
