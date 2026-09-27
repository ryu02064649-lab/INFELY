"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Watches every `[data-reveal]` element and marks it visible once it
 * enters the viewport. One observer for the whole page keeps sections
 * as server components.
 */
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        "[data-reveal]:not([data-visible='true'])",
      ),
    );
    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => (el.dataset.visible = "true"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.visible = "true";
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
