import SectionHeading from "@/components/ui/SectionHeading";
import { site } from "@/config/site";
import { about } from "@/data/about";

const d = (s: number) => ({ "--reveal-delay": `${s}s` }) as React.CSSProperties;

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="bg-ink text-ivory">
      <div className="mx-auto grid max-w-[1440px] gap-16 px-6 py-32 sm:px-8 md:py-44 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:py-56">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionHeading index="07" title="ABOUT" id="about-title" lead={about.lead} />
          </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <div className="space-y-12 text-[1rem] leading-[2.3] tracking-[0.08em] text-ivory/85 sm:text-[1.0625rem] lg:space-y-14 lg:text-[1.125rem]">
            {about.paragraphs.map((lines, i) => (
              <p key={i} data-reveal style={d(i * 0.08)}>
                {lines.map((line, j) => (
                  <span key={j} className="block">
                    {line}
                  </span>
                ))}
              </p>
            ))}
          </div>

          <div className="mt-20 border-t border-white/10 pt-12 lg:mt-24" data-reveal>
            <p className="jp-heading text-[1.375rem] leading-[1.8] sm:text-[1.625rem]">{about.closing}</p>
            <p className="mt-8 flex flex-wrap items-baseline gap-x-5 gap-y-2">
              <span className="display text-[1.125rem] tracking-[0.3em]">{site.name}</span>
              <span className="label text-mist">{about.signature.role}</span>
              <span className="text-[0.9375rem] tracking-[0.2em]">{about.signature.name}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
