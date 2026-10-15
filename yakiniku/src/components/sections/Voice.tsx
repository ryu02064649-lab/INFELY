import { voices } from "@/data/content";
import SectionHeading from "@/components/ui/SectionHeading";
import { Bubble } from "@/components/ui/Doodles";

/** Customer voices. Renders nothing until real voices are added in content.ts. */
export default function Voice() {
  if (voices.length === 0) return null;
  return (
    <section id="voice" aria-labelledby="voice-title" className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <SectionHeading en="VOICE" title="お客さまの声" variant="outline" align="center" id="voice-title" />
        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {voices.map((v, i) => (
            <li key={i} data-reveal style={{ "--d": `${(i % 3) * 0.08}s` } as React.CSSProperties} className="relative">
              <Bubble className="absolute inset-0 h-full w-full text-white drop-shadow-[0_4px_0_var(--color-ink)]" />
              <figure className="relative px-7 pb-14 pt-7">
                <blockquote className="text-[0.95rem] font-bold leading-relaxed">「{v.text}」</blockquote>
                <figcaption className="mt-3 text-right text-[0.8125rem] font-black text-red">{v.name}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
