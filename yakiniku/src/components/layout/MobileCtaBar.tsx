"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MENU_PATH, RESERVE_PATH } from "@/config/site";

/**
 * Bottom bar on small screens. Appears after the first screen so it never
 * covers the hero buttons, and hides while the reservation section itself
 * is on screen (its buttons are right there).
 */
export default function MobileCtaBar() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const reserve = document.getElementById("reserve");
    let pastTop = false;
    let atReserve = false;
    const update = () => setShow(pastTop && !atReserve);
    const onScroll = () => {
      pastTop = window.scrollY > window.innerHeight * 0.6;
      update();
    };
    const io = reserve
      ? new IntersectionObserver(([e]) => {
          atReserve = e.isIntersecting;
          update();
        })
      : null;
    if (reserve && io) io.observe(reserve);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, [pathname]);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom)+0.6rem)] pt-2 transition-[transform,opacity] duration-300 md:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
      inert={!show}
    >
      <div className="flex gap-2 rounded-full border-[2.5px] border-ink bg-ivory p-1.5 shadow-[0_4px_0_var(--color-ink)]">
        <Link
          href={pathname === MENU_PATH ? "/#menu" : MENU_PATH}
          className="flex h-11 flex-1 items-center justify-center rounded-full text-[0.9375rem] font-black text-ink"
        >
          メニュー
        </Link>
        <Link
          href={RESERVE_PATH}
          className="flex h-11 flex-[1.4] items-center justify-center gap-1.5 rounded-full bg-red text-[0.9375rem] font-black text-ivory"
        >
          今夜、予約する
          <span aria-hidden="true" className="text-yellow">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
