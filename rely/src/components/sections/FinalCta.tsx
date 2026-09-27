import Image from "next/image";
import Link from "next/link";
import { REQUEST_PATH, site } from "@/config/site";

export default function FinalCta() {
  return (
    <section
      aria-labelledby="final-cta-title"
      className="relative overflow-hidden bg-ink text-ivory"
    >
      <div aria-hidden="true" className="absolute inset-x-0 -inset-y-[18%]" data-parallax="0.22">
        <div className="cta-media absolute inset-0 opacity-70" data-reveal="fade">
          <Image src="/images/concept.webp" alt="" fill sizes="100vw" className="object-cover" />
        </div>
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-ink/40" />

      <div className="relative mx-auto flex max-w-[1440px] flex-col items-center px-6 py-40 text-center sm:px-8 md:py-52 lg:py-64">
        <h2
          id="final-cta-title"
          className="jp-heading text-[1.875rem] leading-[1.7] sm:text-[2.75rem] lg:text-[3.75rem]"
        >
          <span className="block sm:inline-block" data-reveal="mask">
            <span>探しているものが</span>
          </span>
          <span
            className="block sm:inline-block"
            data-reveal="mask"
            style={{ "--reveal-delay": "0.16s" } as React.CSSProperties}
          >
            <span>ありますか？</span>
          </span>
        </h2>
        <p
          className="mt-8 text-[0.9375rem] tracking-[0.14em] text-ivory/80 sm:text-[1.0625rem]"
          data-reveal
          style={{ "--reveal-delay": "0.15s" } as React.CSSProperties}
        >
          まずはRELYにご相談ください。
        </p>
        <div className="mt-14" data-reveal style={{ "--reveal-delay": "0.3s" } as React.CSSProperties}>
          <Link href={REQUEST_PATH} className="btn btn-light">
            REQUEST NOW
            <span className="arrow" aria-hidden="true" />
          </Link>
        </div>
        <p className="label mt-20 text-mist" data-reveal="fade">
          {site.signature}
        </p>
      </div>
    </section>
  );
}
