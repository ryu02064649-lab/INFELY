import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { REQUEST_PATH } from "@/config/site";
import { option, plans, pricingNotes, type Plan } from "@/data/pricing";

export default function Pricing() {
  return (
    <section id="price" aria-labelledby="price-title" className="bg-ivory text-ink">
      <div className="mx-auto max-w-[1440px] px-6 py-32 sm:px-8 md:py-44 lg:px-12 lg:py-56">
        <SectionHeading
          index="06"
          title="PRICE"
          id="price-title"
          tone="light"
          lead={
            <>
              依頼の大きさに、
              <br className="sm:hidden" />
              合わせて。
            </>
          }
        />

        <ul className="mt-20 border-t border-ink/20 lg:mt-28">
          {plans.map((plan, i) => (
            <PlanRow key={plan.id} plan={plan} index={i} />
          ))}
        </ul>

        {/* Add-on */}
        <div
          className="mt-16 grid gap-6 border border-ink/15 px-6 py-8 sm:px-8 md:grid-cols-12 md:items-center lg:mt-20 lg:px-12 lg:py-10"
          data-reveal
        >
          <p className="label text-stone md:col-span-2">OPTION</p>
          <div className="md:col-span-6">
            <h3 className="display text-[1.125rem] leading-[1.6] tracking-[0.14em] sm:text-[1.25rem]">
              {option.name}
            </h3>
            <p className="mt-2 text-[0.875rem] tracking-[0.08em] text-stone">{option.lead}</p>
          </div>
          <p className="md:col-span-4 md:text-right">
            <span className="display text-[2rem] tracking-[0.04em]">{option.price}</span>
            <PriceSuffix suffix={option.suffix} className="ml-2" />
          </p>
        </div>

        <div className="mt-10 space-y-1 text-[0.8125rem] leading-[2] tracking-[0.06em] text-stone">
          {pricingNotes.map((n) => (
            <p key={n}>{n}</p>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-start gap-8 border-t border-ink/15 pt-14 md:flex-row md:items-center md:justify-between lg:mt-28">
          <p className="text-[0.9375rem] leading-[2.1] tracking-[0.08em]">
            どのプランが合うか分からない場合も、
            <br className="sm:hidden" />
            そのままご相談ください。
          </p>
          <Link href={REQUEST_PATH} className="btn btn-dark w-full sm:w-auto">
            REQUEST A SERVICE
            <span className="arrow" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function PlanRow({ plan, index }: { plan: Plan; index: number }) {
  return (
    <li
      className="relative grid gap-8 py-12 lg:grid-cols-12 lg:gap-8 lg:py-16"
      data-reveal
      style={{ "--reveal-delay": `${index * 0.06}s` } as React.CSSProperties}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-ink/20"
        data-reveal="line"
        style={{ "--reveal-delay": "0.3s" } as React.CSSProperties}
      />
      <div className="lg:col-span-4">
        <p className="label text-stone" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="display mt-4 text-[1.75rem] tracking-[0.12em] lg:text-[2.125rem]">{plan.name}</h3>
        <p className="mt-4 text-[0.9375rem] tracking-[0.08em] text-stone">{plan.lead}</p>
      </div>

      <div className="lg:col-span-5">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-[0.875rem] tracking-[0.06em] sm:grid-cols-3 lg:grid-cols-2">
          {plan.items.map((item) => (
            <li key={item} className="flex items-baseline gap-3">
              <span aria-hidden="true" className="size-[3px] shrink-0 translate-y-[-0.3em] bg-ink/45" />
              {item}
            </li>
          ))}
        </ul>
        {plan.example ? (
          <div className="mt-8 border-l border-ink/25 pl-5 text-[0.875rem] leading-[2] tracking-[0.08em]">
            <p className="label text-stone">{plan.example.label}</p>
            {plan.example.lines.map((l) => (
              <p key={l} className="mt-1">
                {l}
              </p>
            ))}
          </div>
        ) : null}
        {plan.note ? (
          <p className="mt-6 text-[0.8125rem] tracking-[0.06em] text-stone">{plan.note}</p>
        ) : null}
      </div>

      <p className="flex items-baseline gap-2 lg:col-span-3 lg:flex-col lg:items-end lg:gap-1">
        <span
          className="display inline-block text-[2.5rem] tracking-[0.04em] lg:text-[3.25rem]"
          data-reveal="mask"
          style={{ "--reveal-delay": "0.35s" } as React.CSSProperties}
        >
          <span>{plan.price}</span>
        </span>
        <PriceSuffix suffix={plan.suffix} />
      </p>
    </li>
  );
}

/** "〜" in the serif at a readable size, followed by an optional unit such as "/ MONTH". */
function PriceSuffix({ suffix, className = "" }: { suffix: string; className?: string }) {
  const [, from, unit] = suffix.match(/^(〜)?\s*(.*)$/) ?? [];
  return (
    <span className={`inline-flex items-baseline gap-2 text-stone ${className}`}>
      {from ? <span className="font-mincho text-[1.125rem]">{from}</span> : null}
      {unit ? <span className="label">{unit}</span> : null}
    </span>
  );
}
