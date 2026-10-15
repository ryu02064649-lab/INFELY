import { price } from "@/data/content";
import { site } from "@/config/site";
import { Burst, Sizzle, Star } from "@/components/ui/Doodles";

export default function Price() {
  return (
    <section id="price" aria-labelledby="price-title" className="bg-check relative overflow-hidden py-24 text-ivory md:py-32">
      <Star className="absolute left-[6%] top-14 size-9 text-yellow" />
      <Star className="absolute bottom-16 right-[8%] size-12 text-yellow" />
      <Star className="absolute right-[20%] top-24 size-5 text-ivory/80" />

      <div className="mx-auto max-w-[960px] px-4 text-center sm:px-6">
        <p data-reveal className="font-en text-[3.5rem] text-yellow sm:text-[5rem] md:text-[6.5rem]" aria-hidden="true">
          PRICE
        </p>
        <h2 id="price-title" data-reveal style={{ "--d": "0.1s" } as React.CSSProperties} className="font-display mt-2 text-[1.6rem] md:text-[2.25rem]">
          {price.heading}
        </h2>

        <div
          data-reveal="pop"
          style={{ "--rot": "-3deg", "--d": "0.2s" } as React.CSSProperties}
          className="relative mx-auto mt-16 max-w-[40rem] rounded-[32px] border-[3px] border-ink bg-ivory px-6 pb-10 pt-12 text-ink shadow-[0_10px_0_var(--color-ink)] md:px-12 md:pb-14 md:pt-14"
        >
          <Sizzle className="wiggle absolute -top-12 left-1/2 w-14 -translate-x-1/2 text-yellow" />
          <p className="font-display text-[1.5rem] md:text-[2rem]">{site.budget.label}</p>
          <p className="mt-2 flex items-end justify-center gap-1 leading-none">
            <span className="font-en text-[5.5rem] text-red sm:text-[7rem] md:text-[9rem]">{site.budget.price}</span>
            <span className="font-display pb-3 text-[1.75rem] sm:text-[2.25rem] md:pb-5 md:text-[2.75rem]">{site.budget.suffix}</span>
          </p>
          <p className="mt-6 text-[1rem] font-bold md:text-[1.125rem]">しっかり食べて、しっかり飲んで、みんな笑顔。</p>

          <div className="absolute -right-4 -top-8 grid size-24 rotate-12 place-items-center md:-right-10 md:size-28">
            <Burst className="absolute inset-0 size-full text-yellow drop-shadow-[0_3px_0_var(--color-ink)]" />
            <span className="font-display relative text-center text-[0.95rem] leading-tight md:text-[1.05rem]">
              目安
              <br />
              です
            </span>
          </div>
        </div>

        <ul data-reveal style={{ "--d": "0.3s" } as React.CSSProperties} className="mx-auto mt-10 max-w-[36rem] space-y-1 text-left text-[0.875rem] font-bold text-ivory/95">
          {price.notes.map((n) => (
            <li key={n} className="flex gap-2">
              <span aria-hidden="true" className="text-yellow">
                ※
              </span>
              {n}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
