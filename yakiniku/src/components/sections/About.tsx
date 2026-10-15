import Image from "next/image";
import { about } from "@/data/content";
import SectionHeading from "@/components/ui/SectionHeading";
import { Bubble, Star } from "@/components/ui/Doodles";

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="bg-paper relative overflow-hidden py-24 md:py-32">
      <Star className="absolute right-[8%] top-16 size-8 text-yellow md:size-12" />
      <Star className="absolute bottom-24 left-[4%] size-6 text-red/70" />
      <div className="mx-auto grid max-w-[1240px] items-center gap-14 px-4 sm:px-6 md:grid-cols-[1fr_1.05fr] md:gap-16">
        <div className="relative order-2 md:order-1">
          <div
            data-reveal="left"
            className="relative mx-auto aspect-[4/5] max-w-[30rem] -rotate-2 overflow-hidden rounded-[28px] border-[3px] border-ink shadow-[10px_10px_0_var(--color-red)]"
          >
            <Image
              src={about.image.src}
              alt={about.image.alt}
              fill
              sizes="(min-width: 768px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
          <div
            data-reveal="pop"
            style={{ "--rot": "6deg", "--d": "0.35s" } as React.CSSProperties}
            className="absolute -right-1 -top-6 w-40 text-ink sm:right-4 md:-right-6 md:w-44"
          >
            <Bubble className="absolute inset-0 h-full w-full text-yellow drop-shadow-[0_3px_0_var(--color-ink)]" />
            <p className="font-display relative px-4 pb-6 pt-4 text-center text-[1.05rem] leading-snug">
              じゅわっと
              <br />
              焼こうぜ！
            </p>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <SectionHeading en="ABOUT" title={about.heading} id="about-title">
            <p>{about.lead}</p>
          </SectionHeading>

          <ul className="mt-10 grid gap-4">
            {about.points.map((p, i) => (
              <li
                key={p.no}
                data-reveal
                style={{ "--d": `${0.15 + i * 0.1}s` } as React.CSSProperties}
                className="flex items-start gap-4 rounded-2xl border-[2.5px] border-ink bg-white p-4 shadow-[0_4px_0_var(--color-ink)] md:p-5"
              >
                <span className="font-en grid size-12 shrink-0 place-items-center rounded-full bg-red text-[1.35rem] text-ivory">
                  {p.no}
                </span>
                <span>
                  <span className="font-display block text-[1.15rem]">{p.title}</span>
                  <span className="mt-1 block text-[0.9rem] leading-relaxed text-brown">{p.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
