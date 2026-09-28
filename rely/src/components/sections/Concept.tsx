import { site } from "@/config/site";

const tasks = [
  "レストランを探す。",
  "ホテルを比較する。",
  "ギフトを選ぶ。",
  "旅行先を調べる。",
];

const d = (s: number) => ({ "--reveal-delay": `${s}s` }) as React.CSSProperties;

export default function Concept() {
  return (
    <section
      id="concept"
      aria-labelledby="concept-title"
      className="bg-ivory text-ink"
    >
      <div className="mx-auto grid max-w-[1440px] gap-16 px-6 py-32 sm:px-8 md:py-44 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:py-60">
        <div className="lg:col-span-3">
          <p className="label flex items-center gap-4 text-stone lg:sticky lg:top-32" data-reveal="fade">
            <span>02</span>
            <span aria-hidden="true" className="h-px w-10 bg-current opacity-60" data-reveal="line" />
            <span>CONCEPT</span>
          </p>
        </div>

        <div className="lg:col-span-8 lg:col-start-5">
          <h2
            id="concept-title"
            className="jp-heading text-[2rem] leading-[1.6] sm:text-[3rem] lg:text-[4.25rem] lg:leading-[1.55]"
          >
            <span className="block" data-reveal="mask">
              <span>{site.philosophy[0]}</span>
            </span>
            <span className="block" data-reveal="mask" style={d(0.18)}>
              <span>{site.philosophy[1]}</span>
            </span>
          </h2>

          <div className="mt-20 text-[1.0625rem] leading-[2.3] tracking-[0.1em] sm:text-[1.1875rem] lg:mt-28 lg:text-[1.3125rem]">
            <ul className="text-stone">
              {tasks.map((t, i) => (
                <li key={t} data-reveal style={d(i * 0.08)}>
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-14 lg:mt-20" data-reveal>
              本当に時間を使いたいのは、
              <br />
              その先のことかもしれません。
            </p>
            <p className="mt-14 lg:mt-20" data-reveal>
              RELYは、
              <br />
              探す・調べる・比較する・整理する
              <br className="sm:hidden" />
              時間を引き受けます。
            </p>
          </div>

          <p
            className="display mt-24 text-[1.75rem] italic tracking-[0.04em] text-stone sm:text-[2.25rem] lg:mt-32"
            data-reveal="mask"
            lang="en"
          >
            <span className="pr-3">Time is valuable.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
