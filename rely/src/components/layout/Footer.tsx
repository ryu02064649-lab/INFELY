import Link from "next/link";
import { footerNav, legalNav } from "@/data/navigation";
import { site } from "@/config/site";
import { business } from "@/config/business";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-ink text-ivory">
      <div className="mx-auto max-w-[1440px] px-6 pb-28 pt-20 sm:px-8 md:pb-14 lg:px-12 lg:pt-28">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <p className="display text-[2.75rem] tracking-[0.3em] lg:text-[3.5rem]">{site.name}</p>
            <p className="label mt-5 text-mist">{site.category}</p>
            {business.channels.instagram ? (
              <p className="mt-10">
                <a
                  href={business.channels.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram @rely_1001（新しいタブで開きます）"
                  className="label text-link text-ivory/75 hover:text-ivory"
                >
                  INSTAGRAM<span className="ml-4 normal-case tracking-[0.12em] text-mist">@rely_1001</span>
                </a>
              </p>
            ) : null}
          </div>
          <p className="jp-heading text-lg text-ivory/85 lg:col-span-3 lg:text-xl">
            {site.philosophy[0]}
            <br />
            {site.philosophy[1]}
          </p>
          <nav aria-label="フッターナビゲーション" className="lg:col-span-3 lg:justify-self-end">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-4 lg:grid-cols-1">
              {footerNav.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="label text-link text-ivory/75 hover:text-ivory">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-20 flex flex-col gap-6 border-t border-white/[0.08] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="label text-mist">
            <small className="text-[length:inherit]">Copyright © {site.name}.</small>
          </p>
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-[0.75rem] tracking-[0.08em] text-mist">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-link hover:text-ivory">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
