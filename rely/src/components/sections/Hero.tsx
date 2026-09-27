import Image from "next/image";
import Link from "next/link";
import { REQUEST_PATH, site } from "@/config/site";

const delay = (s: number) => ({ "--intro-delay": `${s}s` }) as React.CSSProperties;

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex h-[100svh] min-h-[640px] items-end justify-center overflow-hidden bg-ink text-ivory"
    >
      <div className="absolute inset-0" data-parallax="0.35">
        <div className="hero-media absolute inset-0">
          <Image
            src="/images/hero.webp"
            alt="黒い大理石のロビーに浮かぶ、RELYのシルバーのエンブレム"
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
        </div>
      </div>
      {/* Overlay keeps type legible on any photo that replaces the default one. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/60 to-transparent"
      />

      <div
        className="relative z-10 flex flex-col items-center px-6 pb-[max(5.5rem,10svh)] text-center md:pb-[11svh]"
        data-scroll-fade
      >
        <h1
          id="hero-title"
          aria-label={site.name}
          className="display pl-[0.22em] text-[3.5rem] leading-none tracking-[0.22em] sm:text-[4.75rem] lg:text-[5.75rem]"
        >
          {site.name.split("").map((letter, i) => (
            <span key={i} aria-hidden="true" className="intro-letter" style={delay(0.2 + i * 0.14)}>
              {letter}
            </span>
          ))}
        </h1>
        <p
          className="intro label mt-5 pl-[0.36em] tracking-[0.36em] text-silver sm:mt-6 sm:text-[0.75rem]"
          style={delay(0.8)}
        >
          {site.category}
        </p>

        <p
          className="intro jp-heading mt-8 text-[1.125rem] sm:mt-10 sm:text-[1.5rem] lg:text-[1.75rem]"
          style={delay(1.4)}
        >
          {site.tagline}
        </p>
        <p
          className="intro mt-4 text-[0.8125rem] leading-[2.1] tracking-[0.14em] text-ivory/75 sm:mt-5 sm:text-[0.9375rem]"
          style={delay(1.9)}
        >
          探す。比較する。選ぶ。
          <br />
          その時間を、RELYが引き受けます。
        </p>

        <div className="intro mt-8 sm:mt-10" style={delay(2.4)}>
          <Link href={REQUEST_PATH} className="btn btn-light">
            <span className="sm:hidden">REQUEST</span>
            <span className="hidden sm:inline">REQUEST A SERVICE</span>
            <span className="arrow" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <a
        href="#concept"
        className="intro-fade label absolute bottom-10 right-8 hidden flex-col items-center gap-4 text-ivory/60 transition-colors duration-500 hover:text-ivory md:flex lg:right-12"
        style={delay(3)}
      >
        SCROLL
        <span aria-hidden="true" className="scroll-cue relative block h-12 w-px overflow-hidden bg-current/25">
          <span className="absolute inset-x-0 top-0 block h-1/2 bg-current" />
        </span>
      </a>
    </section>
  );
}
