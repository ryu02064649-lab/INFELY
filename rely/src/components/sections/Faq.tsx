import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import InstagramIcon from "@/components/ui/InstagramIcon";
import { business } from "@/config/business";
import { faqs } from "@/data/faq";

const channelLinks = [
  { label: "LINE", href: business.channels.line },
  { label: "Instagram", href: business.channels.instagram },
].filter((c) => c.href);

export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-ivory text-ink">
      <div className="mx-auto grid max-w-[1440px] gap-16 px-6 py-32 sm:px-8 md:py-44 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:py-56">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionHeading
              index="08"
              title="FAQ"
              id="faq-title"
              tone="light"
              lead={
                <>
                  ご依頼の前に、
                  <br />
                  よくいただく質問。
                </>
              }
            />
          </div>
        </div>

        <div className="border-t border-ink/20 lg:col-span-7 lg:col-start-6">
          {faqs.map((item, i) => (
            <details
              key={item.q}
              className="faq group border-b border-ink/15"
              data-reveal
              style={{ "--reveal-delay": `${Math.min(i, 5) * 0.05}s` } as React.CSSProperties}
            >
              <summary className="flex cursor-pointer list-none items-start gap-6 py-7 [&::-webkit-details-marker]:hidden">
                <span className="display w-7 shrink-0 pt-[0.15em] text-[0.9375rem] text-stone" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-[0.9375rem] leading-[1.9] tracking-[0.06em] sm:text-[1.0625rem]">
                  {item.q}
                </span>
                <span aria-hidden="true" className="faq-icon relative mt-[0.7em] block size-3 shrink-0">
                  <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
                  <span className="faq-icon-v absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current" />
                </span>
              </summary>
              <div className="faq-body pb-8 pl-13 pr-6 text-[0.875rem] leading-[2.1] tracking-[0.04em] text-stone sm:text-[0.9375rem]">
                {item.a.map((line) => (
                  <p key={line} className="mt-2 first:mt-0">
                    {line}
                  </p>
                ))}
                {item.showChannels && channelLinks.length > 0 ? (
                  <p className="mt-5 flex flex-wrap gap-3">
                    {channelLinks.map((c) => (
                      <a
                        key={c.label}
                        href={c.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${c.label}（新しいタブで開きます）`}
                        className="inline-flex min-h-11 items-center gap-3 border border-ink/25 px-5 text-ink transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-ivory"
                      >
                        {c.label === "Instagram" ? <InstagramIcon className="size-[1.125rem]" /> : null}
                        <span className="label">{c.label}</span>
                      </a>
                    ))}
                  </p>
                ) : null}
                {item.link ? (
                  <p className="mt-4">
                    <Link href={item.link.href} className="underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
                      {item.link.label}
                    </Link>
                  </p>
                ) : null}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
