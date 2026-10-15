import { marquee } from "@/data/content";
import { Star } from "./Doodles";

/** Endless scrolling band between sections. */
export default function Marquee({ tone = "red", tilt = false }: { tone?: "red" | "yellow"; tilt?: boolean }) {
  const words = [...marquee, ...marquee];
  return (
    <div
      aria-hidden="true"
      className={`relative z-10 overflow-hidden border-y-[2.5px] border-ink py-3 ${
        tone === "red" ? "bg-red text-ivory" : "bg-yellow text-ink"
      } ${tilt ? "-my-3 -rotate-2 scale-[1.04]" : ""}`}
    >
      <div className="marquee-track flex w-max items-center gap-6 whitespace-nowrap">
        {words.map((w, i) => (
          <span key={i} className="flex items-center gap-6">
            <span className={/[A-Z]/.test(w) ? "font-en text-[1.6rem] tracking-[0.08em]" : "font-display text-[1.25rem]"}>
              {w}
            </span>
            <Star className={`size-5 ${tone === "red" ? "text-yellow" : "text-red"}`} />
          </span>
        ))}
      </div>
    </div>
  );
}
