import Link from "next/link";
import { footerNav } from "@/data/navigation";
import { site } from "@/config/site";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-ink text-ivory">
      <div className="mx-auto max-w-[1440px] px-6 pb-28 pt-20 sm:px-8 md:pb-14 lg:px-12 lg:pt-28">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <p className="display text-[2.75rem] tracking-[0.3em] lg:text-[3.5rem]">{site.name}</p>
            <p className="label mt-5 text-mist">{site.category}</p>
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
        <div className="mt-20 flex flex-col gap-3 border-t border-white/[0.08] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="label text-mist">
            <small className="text-[length:inherit]">Copyright © {site.name}.</small>
          </p>
          <p className="label text-mist">TIME IS VALUABLE.</p>
        </div>
      </div>
    </footer>
  );
}
