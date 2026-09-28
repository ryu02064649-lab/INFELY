import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { REQUEST_PATH } from "@/config/site";
import {
  option,
  plans,
  pricingNotes,
  pricingPrinciples,
  type Plan,
} from "@/data/pricing";

const delay = (s: number) => ({ "--reveal-delay": `${s}s` }) as React.CSSProperties;

export default function Pricing() {
  return (
    <section id="price" aria-labelledby="price-title" className="bg-ivory text-ink">
      <div className="mx-auto max-w-[1440px] px-6 py-32 sm:px-8 md:py-44 lg:px-12 lg:py-60">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-8">
          <SectionHeading
            className="lg:col-span-7"
            index="06"
            title="PRICE"
            id="price-title"
            tone="light"
            lead={
              <>
                料金は、情報の対価ではなく、
                <br />
                あなたの時間の対価です。
              </>
            }
          />
          <p
            className="max-w-md text-[0.9375rem] leading-[2.3] tracking-[0.08em] text-stone lg:col-span-4 lg:col-start-9"
            data-reveal
            style={delay(0.25)}
          >
            RELYが引き受けるのは、検索そのものではなく、その前後にある時間です。条件を伺い、調べ、比べ、選ぶ理由まで整理してお届けします。
          </p>
        </div>

        {/* What the fee pays for */}
        <ul className="mt-24 grid gap-10 sm:grid-cols-3 sm:gap-8 lg:mt-36">
          {pricingPrinciples.map((p, i) => (
            <li key={p.en} className="relative pt-8" data-reveal style={delay(i * 0.12)}>
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-ink/20"
                data-reveal="line"
                style={delay(0.2 + i * 0.15)}
              />
              <p className="label text-stone">{p.en}</p>
              <p className="jp-heading mt-4 text-[1.0625rem] lg:text-[1.1875rem]">{p.text}</p>
            </li>
          ))}
        </ul>

        <ul className="mt-24 lg:mt-36">
          {plans.map((plan, i) => (
            <PlanRow key={plan.id} plan={plan} index={i} />
          ))}
        </ul>

        {/* Add-on */}
        <div
          className="mt-4 grid gap-6 border-b border-ink/15 py-10 md:grid-cols-12 md:items-center lg:py-12"
          data-reveal
        >
          <p className="label text-stone md:col-span-2">OPTION</p>
          <div className="md:col-span-6">
            <h3 className="display text-[1.125rem] leading-[1.6] tracking-[0.14em] sm:text-[1.25rem]">
              {option.name}
            </h3>
            <p className="mt-2 text-[0.875rem] tracking-[0.08em] text-stone">{option.lead}</p>
          </div>
          <div className="md:col-span-4 md:text-right">
            <PriceFigure plan={option} size="small" />
          </div>
        </div>

        <div className="mt-10 space-y-1 text-[0.8125rem] leading-[2] tracking-[0.06em] text-stone">
          {pricingNotes.map((n) => (
            <p key={n}>{n}</p>
          ))}
        </div>

        <div className="mt-28 flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between lg:mt-40">
          <p className="jp-heading text-[1.25rem] leading-[1.9] sm:text-[1.5rem]" data-reveal>
            何を任せるか、まだ決まっていなくても。
            <br />
            まずはご相談ください。
          </p>
          <div className="w-full sm:w-auto" data-reveal style={delay(0.15)}>
            <Link href={REQUEST_PATH} className="btn btn-dark w-full sm:w-auto">
              REQUEST A SERVICE
              <span className="arrow" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlanRow({ plan, index }: { plan: Plan; index: number }) {
  const dark = !!plan.emphasis;
  const muted = dark ? "text-mist" : "text-stone";
  const rule = dark ? "bg-white/15" : "bg-ink/15";

  return (
    <li
      className={`relative grid gap-12 py-20 lg:grid-cols-12 lg:gap-8 lg:py-28 ${
        dark ? "-mx-6 my-6 bg-ink px-6 text-ivory sm:-mx-8 sm:px-8 lg:mx-0 lg:my-10 lg:px-14" : ""
      }`}
      data-reveal
      style={delay(index * 0.06)}
    >
      {!dark ? (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px bg-ink/20"
          data-reveal="line"
          style={delay(0.3)}
        />
      ) : null}

      {/* name and the moment it is for */}
      <div className="lg:col-span-5">
        <p className={`label ${muted}`}>
          <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          {dark ? <span className="ml-5">MEMBERSHIP</span> : null}
        </p>
        <h3 className="display mt-6 text-[1.875rem] leading-[1.2] tracking-[0.12em] lg:text-[2.5rem]">
          {plan.name}
        </h3>
        <p className="jp-heading mt-6 text-[1.0625rem] lg:text-[1.1875rem]">{plan.lead}</p>
        {plan.scene ? (
          <p className={`mt-5 max-w-sm text-[0.875rem] leading-[2.2] tracking-[0.08em] ${muted}`}>{plan.scene}</p>
        ) : null}
      </div>

      {/* price: its own quiet column */}
      <div
        className={`order-2 lg:order-none lg:col-span-3 lg:col-start-10 lg:row-start-1 lg:border-l lg:pl-10 lg:text-right ${
          dark ? "lg:border-white/15" : "lg:border-ink/15"
        }`}
      >
        <PriceFigure plan={plan} tone={dark ? "dark" : "light"} />
      </div>

      {/* what is included */}
      <div className="order-3 lg:order-none lg:col-span-3 lg:col-start-6 lg:row-start-1">
        <p className={`label ${muted}`}>INCLUDED</p>
        <span aria-hidden="true" className={`mt-4 block h-px w-8 ${rule}`} />
        <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-1.5 text-[0.875rem] leading-[2] tracking-[0.06em] sm:grid-cols-3 lg:grid-cols-1">
          {plan.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {plan.example ? (
          <div className={`mt-8 border-l pl-5 text-[0.8125rem] leading-[2] tracking-[0.08em] ${dark ? "border-white/25" : "border-ink/25"}`}>
            <p className={`label ${muted}`}>{plan.example.label}</p>
            {plan.example.lines.map((l) => (
              <p key={l} className="mt-1">
                {l}
              </p>
            ))}
          </div>
        ) : null}
        {plan.note ? <p className={`mt-6 text-[0.8125rem] tracking-[0.06em] ${muted}`}>{plan.note}</p> : null}
      </div>
    </li>
  );
}

/**
 * "FROM" / amount / unit, set like a menu price rather than a sale tag.
 * The visible "FROM" replaces "〜"; screen readers get the plain reading.
 */
function PriceFigure({
  plan,
  size = "large",
  tone = "light",
}: {
  plan: Plan;
  size?: "large" | "small";
  tone?: "light" | "dark";
}) {
  const unit = plan.suffix.replace(/^〜\s*/, "");
  const fromPrice = plan.suffix.startsWith("〜");
  const muted = tone === "dark" ? "text-mist" : "text-stone";
  const spoken = `${plan.price.replace("¥", "")}円${fromPrice ? "から" : ""}${unit ? `（${unit.replace("/ ", "")}）` : ""}`;

  const amount = (
    <span
      className={`display inline-block tracking-[0.03em] ${
        size === "large" ? "mt-4 text-[3rem] leading-none lg:mt-6 lg:text-[4rem]" : "text-[2rem] leading-none"
      }`}
      data-reveal="mask"
      style={delay(0.35)}
    >
      <span>{plan.price}</span>
    </span>
  );

  if (size === "small") {
    return (
      <p className="inline-flex items-baseline gap-4">
        <span className="sr-only">{spoken}</span>
        {fromPrice ? (
          <span aria-hidden="true" className={`label ${muted}`}>
            FROM
          </span>
        ) : null}
        <span aria-hidden="true">{amount}</span>
      </p>
    );
  }

  return (
    <p>
      <span className="sr-only">{spoken}</span>
      <span aria-hidden="true" className="block">
        {fromPrice ? <span className={`label block ${muted}`}>FROM</span> : null}
        {amount}
        {unit ? <span className={`label mt-4 block ${muted}`}>{unit}</span> : null}
      </span>
    </p>
  );
}
