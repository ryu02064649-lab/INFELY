"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { primaryNav, requestNav } from "@/data/navigation";
import { site } from "@/config/site";

type Props = {
  /** `overlay` starts transparent over the hero; `solid` is always filled. */
  variant?: "overlay" | "solid";
};

export default function Header({ variant = "overlay" }: Props) {
  const [scrolled, setScrolled] = useState(false);
  // Header steps aside while reading downward and returns on the way up.
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > window.innerHeight * 0.8);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // Scroll lock, Escape to close, and a simple focus trap while the menu is open.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.documentElement.dataset.menuOpen = "true";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = [
        toggleRef.current,
        ...panelRef.current.querySelectorAll<HTMLElement>("a, button"),
      ].filter(Boolean) as HTMLElement[];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      delete document.documentElement.dataset.menuOpen;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // Close the menu if the viewport grows to desktop size.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const filled = variant === "solid" || scrolled || open;

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 text-ivory transition-[background-color,border-color,backdrop-filter,transform] duration-700 ease-[var(--ease-quiet)] ${
        hidden && !open ? "-translate-y-full focus-within:translate-y-0" : "translate-y-0"
      } ${
        filled
          ? "border-b border-white/[0.07] bg-ink/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:h-20 lg:px-12">
        <Link
          href="/"
          className="display relative z-10 text-[1.375rem] tracking-[0.32em] lg:text-2xl"
          aria-label={`${site.name} ホーム`}
          onClick={() => open && close(false)}
        >
          {site.name}
        </Link>

        <nav aria-label="メインナビゲーション" className="hidden lg:block">
          <ul className="flex items-center gap-10 xl:gap-12">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="label text-link text-ivory/80 transition-colors duration-500 hover:text-ivory">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={requestNav.href}
                className="label inline-flex items-center border border-ivory/50 px-6 py-2.5 transition-colors duration-700 hover:border-ivory hover:bg-ivory hover:text-ink"
              >
                {requestNav.label}
              </Link>
            </li>
          </ul>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="label relative z-10 -mr-2 flex h-11 items-center gap-3 px-2 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => (open ? close() : setOpen(true))}
        >
          <span>{open ? "CLOSE" : "MENU"}</span>
          <span aria-hidden="true" className="relative block h-2.5 w-6">
            <span
              className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 ${
                open ? "translate-y-[5px] rotate-[20deg]" : ""
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500 ${
                open ? "-translate-y-[4px] -rotate-[20deg]" : ""
              }`}
            />
          </span>
        </button>
      </div>
    </header>

      {/* Mobile menu — kept outside <header> so its backdrop-filter doesn't trap `position: fixed`. */}
      <div
        id="mobile-menu"
        ref={panelRef}
        className={`fixed inset-0 z-[45] flex h-[100dvh] flex-col bg-ink text-ivory px-6 pb-[calc(env(safe-area-inset-bottom)+2.5rem)] pt-28 transition-[opacity,visibility] duration-700 ease-[var(--ease-quiet)] sm:px-10 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
        inert={!open}
      >
        <nav aria-label="モバイルナビゲーション" className="flex-1">
          <ul className="space-y-1">
            {primaryNav.map((item, i) => (
              <li
                key={item.href}
                className={`transition-[opacity,transform] duration-1000 ease-[var(--ease-quiet)] ${
                  open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                }`}
                style={{ transitionDelay: open ? `${150 + i * 80}ms` : "0ms" }}
              >
                <Link
                  href={item.href}
                  onClick={() => close(false)}
                  className="flex items-baseline gap-5 border-b border-white/[0.08] py-5"
                >
                  <span className="label text-mist">0{i + 1}</span>
                  <span className="display text-[1.75rem] tracking-[0.14em]">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div
            className={`mt-10 transition-opacity duration-1000 ${open ? "opacity-100" : "opacity-0"}`}
            style={{ transitionDelay: open ? "500ms" : "0ms" }}
          >
            <Link
              href={requestNav.href}
              onClick={() => close(false)}
              className="btn btn-light w-full"
            >
              REQUEST A SERVICE
              <span className="arrow" aria-hidden="true" />
            </Link>
          </div>
        </nav>
        <p className="jp-heading text-sm text-mist">
          {site.philosophy[0]}
          <br />
          {site.philosophy[1]}
        </p>
      </div>
    </>
  );
}
