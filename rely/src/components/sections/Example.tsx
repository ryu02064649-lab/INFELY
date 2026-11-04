import SectionHeading from "@/components/ui/SectionHeading";
import CandidateTabs from "@/components/ui/CandidateTabs";
import {
  candidateRows,
  candidates,
  exampleDisclaimer,
  exampleRequest,
} from "@/data/example";

export default function Example() {
  return (
    <section
      id="example"
      aria-labelledby="example-title"
      className="bg-ink-soft text-ivory"
    >
      <div className="mx-auto max-w-[1440px] px-6 py-32 sm:px-8 md:py-44 lg:px-12 lg:py-56">
        <SectionHeading index="05" title="EXAMPLE" id="example-title" />

        <div className="mt-20 grid gap-20 lg:mt-28 lg:grid-cols-12 lg:gap-8">
          {/* The request */}
          <div className="lg:col-span-5">
            <p className="label text-mist" data-reveal="fade">REQUEST — 依頼</p>
            <blockquote
              className="jp-heading mt-8 text-[1.5rem] leading-[1.9] sm:text-[1.875rem] lg:text-[2.125rem]"
              data-reveal="mask"
            >
              <span>「{exampleRequest.quote}」</span>
            </blockquote>
            <dl className="mt-12 grid grid-cols-2 border-t border-white/10" data-reveal>
              {exampleRequest.conditions.map((c, i) => (
                <div
                  key={c.label}
                  className={`border-b border-white/10 py-5 ${i % 2 === 0 ? "pr-4" : "border-l pl-5"}`}
                >
                  <dt className="label text-mist">{c.label}</dt>
                  <dd className="mt-2 text-[0.9375rem] tracking-[0.08em]">{c.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* What RELY does */}
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="label text-mist" data-reveal="fade">RELY — 対応</p>
            <ol className="mt-8 border-t border-white/10">
              {exampleRequest.process.map((item, i) => (
                <li
                  key={item}
                  className="flex items-baseline gap-6 border-b border-white/10 py-4 text-[0.9375rem] tracking-[0.1em]"
                  data-reveal
                  style={{ "--reveal-delay": `${i * 0.06}s` } as React.CSSProperties}
                >
                  <span className="display w-7 text-[0.9375rem] text-mist" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
            <p className="jp-heading mt-10 text-[1.125rem] sm:text-[1.25rem]" data-reveal="mask">
              <span>{exampleRequest.closing}</span>
            </p>
          </div>
        </div>

        {/* Proposal comparison */}
        <div className="mt-28 lg:mt-40">
          <div className="flex items-end justify-between gap-6 border-b border-white/15 pb-6" data-reveal="fade">
            <p className="label text-mist">PROPOSAL — 提案イメージ</p>
            <p className="label hidden text-mist sm:block">3 CANDIDATES</p>
          </div>

          {/* Desktop / tablet: side-by-side table */}
          <div className="hidden md:block">
            <table className="w-full table-fixed border-collapse text-left">
              <caption className="sr-only">3候補の比較（イメージ）</caption>
              <thead>
                <tr data-reveal>
                  <td className="w-[18%]" />
                  {candidates.map((c) => (
                    <th key={c.name} scope="col" className="px-6 pb-10 pt-12 align-bottom font-normal lg:px-8">
                      <span className="display block text-[1.5rem] text-mist lg:text-[1.75rem]" aria-hidden="true">
                        {c.number}
                      </span>
                      <span className="display mt-4 block text-[1.25rem] tracking-[0.14em] lg:text-[1.5rem]">
                        {c.name}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {candidateRows.map((row, i) => (
                  <tr
                    key={row.key}
                    className="border-t border-white/10"
                    data-reveal
                    style={{ "--reveal-delay": `${0.1 + i * 0.07}s` } as React.CSSProperties}
                  >
                    <th scope="row" className="label py-5 pr-4 align-top font-normal text-mist">
                      {row.label}
                    </th>
                    {candidates.map((c) => (
                      <td key={c.name} className="px-6 py-5 align-top text-[0.9375rem] tracking-[0.08em] lg:px-8">
                        {c.values[row.key]}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr
                  className="border-t border-white/25"
                  data-reveal
                  style={{ "--reveal-delay": "0.3s" } as React.CSSProperties}
                >
                  <th scope="row" className="label py-8 pr-4 align-top font-normal text-ivory">
                    なぜこの候補か
                  </th>
                  {candidates.map((c) => (
                    <td
                      key={c.name}
                      className="px-6 py-8 align-top text-[0.875rem] leading-[2.1] tracking-[0.06em] text-ivory/85 lg:px-8"
                    >
                      {c.reason}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Phone: one candidate at a time */}
          <div className="md:hidden">
            <CandidateTabs candidates={candidates} rows={candidateRows} />
          </div>

          <p className="mt-10 text-[0.75rem] leading-[2] tracking-[0.06em] text-mist">{exampleDisclaimer}</p>
        </div>
      </div>
    </section>
  );
}
