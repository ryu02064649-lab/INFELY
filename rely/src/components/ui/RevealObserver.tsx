"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Page-wide motion controller (one instance in the root layout):
 *
 * - `[data-reveal]`          marked visible once it enters the viewport
 * - `[data-parallax="0.2"]`  drifts at a fraction of the scroll speed,
 *                            relative to its parent section's centre
 * - `[data-scroll-fade]`     fades and lifts away as the page scrolls past it
 *
 * All motion is skipped for `prefers-reduced-motion: reduce`.
 */
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── reveal ──
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-visible='true'])"),
    );
    let observer: IntersectionObserver | null = null;
    if (reduce || !("IntersectionObserver" in window)) {
      targets.forEach((el) => (el.dataset.visible = "true"));
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              (entry.target as HTMLElement).dataset.visible = "true";
              observer?.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
      );
      targets.forEach((el) => observer?.observe(el));
    }

    if (reduce) return () => observer?.disconnect();

    // ── scroll-linked drift ──
    const parallax = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    const fades = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-fade]"));
    let frame = 0;

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const el of parallax) {
        const host = el.parentElement;
        if (!host) continue;
        const rect = host.getBoundingClientRect();
        if (rect.bottom < -vh * 0.2 || rect.top > vh * 1.2) continue;
        const factor = Number(el.dataset.parallax) || 0.2;
        const offset = (rect.top + rect.height / 2 - vh / 2) * -factor;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      }
      const y = window.scrollY;
      for (const el of fades) {
        const p = Math.min(1, Math.max(0, y / (vh * 0.65)));
        el.style.opacity = String(1 - p);
        el.style.transform = `translate3d(0, ${(y * 0.18).toFixed(1)}px, 0)`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
