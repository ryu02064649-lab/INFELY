import Link from "next/link";
import { site } from "@/config/site";

type Props = {
  /** light = on dark/photo backgrounds */
  tone?: "light" | "dark";
  className?: string;
};

/**
 * Text logo built from `site` so the shop name can be changed in one place.
 * Replace with an <Image> once an official logo file exists.
 */
export default function Logo({ tone = "dark", className = "" }: Props) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label={`${site.name} トップへ`}
    >
      <span className="relative grid size-11 shrink-0 place-items-center rounded-full border-[2.5px] border-ink bg-red shadow-[0_3px_0_var(--color-ink)] transition-transform duration-300 group-hover:-rotate-12 md:size-12">
        <svg viewBox="0 0 32 32" className="size-6 md:size-7" aria-hidden="true">
          <path
            d="M16 2c6 6 9 10 6 16-.8-3-2.8-4-4.2-3.4 1.6 3.4-.6 6.8-3.6 6.8-3.6 0-5.2-4.4-2.8-8 .8 2 2 2.2 2.8 1.4C12 11 13.6 6.6 16 2Z"
            fill="var(--color-yellow)"
            stroke="var(--color-ink)"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M5 25h22M7 29.5h18" stroke="var(--color-ivory)" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`text-[0.625rem] font-black tracking-[0.3em] ${tone === "light" ? "text-yellow" : "text-red"}`}
        >
          {site.genre}
        </span>
        <span
          className={`font-display mt-1 text-[1.35rem] leading-none tracking-[0.12em] md:text-[1.5rem] ${tone === "light" ? "text-ivory" : "text-ink"}`}
        >
          {site.logoMark}
        </span>
      </span>
    </Link>
  );
}
