"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "@/components/ui/Logo";
import { navigation } from "@/data/navigation";
import { MENU_PATH, RESERVE_PATH } from "@/config/site";

/**
 * Transparent over the hero, solid once the page scrolls.
 * `solid` forces the solid look (pages without a photo hero).
 */
export default function Header({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isSolid = solid || scrolled;
  const close = () => setOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,padding] duration-300 ${
        isSolid
          ? "bg-ivory py-2 shadow-[0_2px_0_var(--color-ink)]"
          : "bg-transparent py-3 md:py-5"
      }`}
    >
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-6">
        <Logo tone={isSolid && !open ? "dark" : "light"} />

        <nav aria-label="メインメニュー" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {navigation.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className={`font-en text-[1.0625rem] tracking-[0.12em] transition-colors hover:text-red ${
                    isSolid ? "text-ink" : "text-ivory"
                  }`}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={RESERVE_PATH}
            className="btn hidden min-h-11 bg-yellow px-5 text-[0.9rem] text-ink sm:inline-flex"
          >
            予約する
          </Link>
          <button
            type="button"
            className={`grid size-12 place-items-center rounded-full border-[2.5px] border-ink bg-red text-ivory shadow-[0_3px_0_var(--color-ink)] lg:hidden`}
            aria-label={open ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={open}
            aria-controls="site-drawer"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3.5 w-5" aria-hidden="true">
              <span
                className={`absolute left-0 top-0 h-[3px] w-full rounded bg-current transition-transform duration-300 ${open ? "translate-y-[5.5px] rotate-45" : ""}`}
              />
              <span
                className={`absolute bottom-0 left-0 h-[3px] w-full rounded bg-current transition-transform duration-300 ${open ? "-translate-y-[5.5px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="site-drawer"
        className={`bg-check fixed inset-0 top-0 -z-10 flex flex-col overflow-y-auto px-6 pb-10 pt-24 transition-[opacity,visibility] duration-300 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
        aria-hidden={!open}
        inert={!open}
      >
        <nav aria-label="スマートフォン用メニュー">
          <ul className="space-y-1">
            {[...navigation, { href: MENU_PATH, label: "ALL MENU", jp: "メニュー一覧" }].map((n, i) => (
              <li
                key={n.href}
                className={`transition-[opacity,transform] duration-500 ${open ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0"}`}
                style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}
              >
                <Link
                  href={n.href}
                  onClick={close}
                  className="flex items-baseline justify-between border-b-2 border-ivory/30 py-3.5 text-ivory"
                >
                  <span className="font-en text-[2.25rem]">{n.label}</span>
                  <span className="text-sm font-bold text-yellow">{n.jp}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link href={RESERVE_PATH} onClick={close} className="btn mt-8 w-full bg-yellow text-lg text-ink">
          予約する
        </Link>
      </div>
    </header>
  );
}
