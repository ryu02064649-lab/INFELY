import SectionHeading from "@/components/ui/SectionHeading";
import { steps } from "@/data/steps";

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-title"
      className="bg-ivory text-ink"
    >
      <div className="mx-auto max-w-[1440px] px-6 py-32 sm:px-8 md:py-44 lg:px-12 lg:py-56">
        <SectionHeading
          index="04"
          title="HOW IT WORKS"
          id="how-title"
          tone="light"
          lead={
            <>
              「RELYに頼む。」
              <br />
              それだけ。
            </>
          }
        />

        <ol className="mt-20 grid gap-0 md:grid-cols-2 md:gap-x-10 lg:mt-32 lg:grid-cols-4 lg:gap-x-8">
          {steps.map((step, i) => (
            <li
              key={step.number}
              className="relative flex gap-8 py-9 md:block md:py-10 lg:pt-12"
              data-reveal
              style={{ "--reveal-delay": `${i * 0.12}s` } as React.CSSProperties}
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-ink/20"
                data-reveal="line"
                style={{ "--reveal-delay": `${0.2 + i * 0.15}s` } as React.CSSProperties}
              />
              <span
                className="display w-14 shrink-0 text-[2.5rem] text-stone md:block md:w-auto lg:text-[4rem]"
                aria-hidden="true"
              >
                {step.number}
              </span>
              <div className="md:mt-10 lg:mt-14">
                <h3 className="label text-[0.75rem] tracking-[0.32em]">
                  <span className="sr-only">STEP {step.number} </span>
                  {step.name}
                </h3>
                <p className="mt-3 text-[1rem] tracking-[0.1em] lg:mt-4 lg:text-[1.0625rem]">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
