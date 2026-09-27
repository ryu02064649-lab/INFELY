"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Horizontal, snap-scrolling rail on phones; a plain grid from `md` up.
 * Shows a quiet "01 / 06" position indicator while swiping.
 */
export default function ServiceRail({
  children,
  count,
}: {
  children: ReactNode;
  count: number;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const current = Math.min(count, Math.round(progress * (count - 1)) + 1);

  return (
    <>
      <ul
        ref={ref}
        aria-label="サービス一覧"
        data-reveal="group"
        className="rail mt-16 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-2 sm:scroll-px-8 sm:px-8 md:mx-8 md:grid md:snap-none md:grid-cols-2 md:gap-0 md:overflow-visible md:border-l md:border-t md:border-white/10 md:px-0 lg:mx-12 lg:mt-24 lg:grid-cols-3"
      >
        {children}
        {/* trailing spacer so the last card can snap fully into view */}
        <li aria-hidden="true" className="w-2 shrink-0 md:hidden" />
      </ul>
      <div className="mt-8 flex items-center gap-5 px-6 sm:px-8 md:hidden" aria-hidden="true">
        <span className="label tabular-nums text-mist">
          {String(current).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
        <span className="relative h-px flex-1 bg-white/15">
          <span
            className="absolute inset-y-0 left-0 bg-ivory/70"
            style={{ width: `${Math.max(1 / count, progress) * 100}%` }}
          />
        </span>
        <span className="label text-mist">SWIPE</span>
      </div>
    </>
  );
}
