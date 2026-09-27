import Image from "next/image";
import Link from "next/link";
import { REQUEST_PATH, site } from "@/config/site";

const delay = (s: number) => ({ "--intro-delay": `${s}s` }) as React.CSSProperties;

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex h-[100svh] min-h-[600px] items-center justify-center overflow-hidden bg-ink text-ivory"
    >
      <div className="hero-media absolute inset-0">
        <Image
          src="/images/hero.webp"
          alt="夜のラウンジ。窓の向こうに街の灯りが滲んでいる"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      {/* Overlay keeps type legible on any photo that replaces the default one. */}
      <div aria-hidden="true" className="absolute inset-0 bg-ink/45" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/80 to-transparent"
      />

      <div className="relative z-10 flex flex-col items-center px-6 pb-10 text-center md:pb-0">
        <h1
          id="hero-title"
          className="intro display pl-[0.22em] text-[4.75rem] tracking-[0.22em] sm:text-[7rem] lg:text-[9.5rem]"
          style={delay(0.2)}
        >
          {site.name}
        </h1>
        <p
          className="intro label mt-5 pl-[0.36em] tracking-[0.36em] text-silver sm:mt-7 sm:text-[0.75rem]"
          style={delay(0.8)}
        >
          {site.category}
        </p>

        <span
          aria-hidden="true"
          className="intro-fade mt-10 block h-px w-10 bg-ivory/40 sm:mt-12"
          style={delay(1.2)}
        />

        <p
          className="intro jp-heading mt-10 text-[1.25rem] sm:mt-12 sm:text-[1.75rem] lg:text-[2rem]"
          style={delay(1.4)}
        >
          {site.tagline}
        </p>
        <p
          className="intro mt-6 text-[0.8125rem] leading-[2.2] tracking-[0.14em] text-ivory/75 sm:text-[0.9375rem]"
          style={delay(1.9)}
        >
          探す。比較する。選ぶ。
          <br />
          その時間を、RELYが引き受けます。
        </p>

        <div className="intro mt-12 sm:mt-14" style={delay(2.4)}>
          <Link href={REQUEST_PATH} className="btn btn-light">
            <span className="sm:hidden">REQUEST</span>
            <span className="hidden sm:inline">REQUEST A SERVICE</span>
            <span className="arrow" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <a
        href="#concept"
        className="intro-fade label absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-4 text-ivory/60 transition-colors duration-500 hover:text-ivory md:flex"
        style={delay(3)}
      >
        SCROLL
        <span aria-hidden="true" className="block h-12 w-px bg-current opacity-60" />
      </a>
    </section>
  );
}
