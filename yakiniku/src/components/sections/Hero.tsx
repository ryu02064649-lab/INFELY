import Link from "next/link";
import { getImageProps } from "next/image";
import { photosArePlaceholder, RESERVE_PATH, site } from "@/config/site";
import { Burst, Sizzle, Star } from "@/components/ui/Doodles";

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

export default function Hero() {
  // Art direction: portrait crop on phones, landscape on larger screens.
  // (With `images.unoptimized` there is no srcSet, so fall back to the plain src.)
  const common = { alt: "網の上でじゅわっと焼けるカルビとタンのイメージ", sizes: "100vw", fetchPriority: "high" as const };
  const { props: pc } = getImageProps({ ...common, src: "/images/hero.webp", width: 2000, height: 1250 });
  const {
    props: { srcSet: spSrcSet, ...rest },
  } = getImageProps({ ...common, src: "/images/hero-sp.webp", width: 1080, height: 1620 });
  const desktop = pc.srcSet ?? pc.src;
  const mobile = spSrcSet ?? rest.src;

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-char text-ivory"
    >
      <picture className="absolute inset-0 -z-20">
        <source media="(min-width: 768px)" srcSet={desktop} />
        <source srcSet={mobile} />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt is in `rest` */}
        <img {...rest} className="kenburns h-full w-full object-cover" />
      </picture>
      {/* Readability: dark at the bottom-left where the copy sits */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(26_13_8/0.55)_0%,rgb(26_13_8/0)_28%,rgb(26_13_8/0.15)_50%,rgb(26_13_8/0.88)_100%)] md:bg-[linear-gradient(90deg,rgb(26_13_8/0.85)_0%,rgb(26_13_8/0.45)_45%,rgb(26_13_8/0)_75%),linear-gradient(180deg,rgb(26_13_8/0.5)_0%,rgb(26_13_8/0)_25%)]"
      />

      <div className="relative mx-auto w-full max-w-[1240px] px-4 pb-24 pt-32 sm:px-6 md:pb-28">
        <p
          className="stamp-in inline-flex items-center gap-2 rounded-full border-[2.5px] border-ink bg-yellow px-4 py-1.5 text-[0.8125rem] font-black tracking-[0.2em] text-ink shadow-[0_3px_0_var(--color-ink)]"
          style={{ ...d(0.15), "--rot": "-4deg" } as React.CSSProperties}
        >
          <Star className="size-3.5 text-red" />
          {site.genre}
          <span className="font-display tracking-[0.12em]">{site.logoMark}</span>
        </p>

        <h1
          id="hero-title"
          className="font-display relative mt-5 text-[2.9rem] leading-[1.15] drop-shadow-[0_4px_0_rgb(26_13_8/0.6)] min-[400px]:text-[3.3rem] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[6.25rem]"
        >
          <span className="rise block" style={d(0.3)}>
            {site.catchcopy[0]}
          </span>
          <span className="rise block text-yellow" style={d(0.5)}>
            {site.catchcopy[1]}
          </span>
          <Sizzle className="wiggle absolute -top-10 left-[11.5rem] w-12 text-orange/90 min-[400px]:left-[13rem] sm:left-[17rem] sm:w-16 md:-top-12 md:left-[21rem] lg:left-[24rem]" />
        </h1>

        <p className="rise mt-5 max-w-[30rem] text-[0.98rem] font-bold leading-[1.9] text-ivory/95 md:text-[1.125rem]" style={d(0.75)}>
          {site.subcopy.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
        </p>

        <div className="rise mt-8 flex flex-wrap items-center gap-3 sm:gap-4" style={d(0.95)}>
          <Link href="#menu" className="btn bg-ivory text-ink">
            メニューを見る
          </Link>
          <Link href={RESERVE_PATH} className="btn bg-red text-ivory">
            予約する
            <span aria-hidden="true" className="text-yellow">
              →
            </span>
          </Link>
        </div>

        {/* Budget badge */}
        <div
          className="stamp-in absolute right-4 top-28 grid size-[7.5rem] place-items-center text-ink sm:right-8 sm:size-[9rem] md:bottom-28 md:right-10 md:top-auto md:size-[11rem]"
          style={{ ...d(1.15), "--rot": "8deg" } as React.CSSProperties}
        >
          <Burst className="absolute inset-0 size-full text-yellow drop-shadow-[0_4px_0_var(--color-ink)]" />
          <p className="relative text-center leading-none">
            <span className="block text-[0.7rem] font-black tracking-widest sm:text-[0.8rem] md:text-[0.95rem]">
              {site.budget.label}
            </span>
            <span className="font-en mt-1 block text-[2rem] text-red sm:text-[2.5rem] md:text-[3.1rem]">
              {site.budget.price}
            </span>
            <span className="block text-[0.75rem] font-black sm:text-[0.85rem] md:text-[1rem]">{site.budget.suffix}</span>
          </p>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#about"
        className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-ivory/85"
        aria-label="下へスクロール"
      >
        <span className="font-en text-[0.75rem] tracking-[0.3em]">SCROLL</span>
        <span className="block h-9 w-[2px] overflow-hidden bg-ivory/25">
          <span className="scroll-cue block h-full w-full bg-yellow" />
        </span>
      </a>

      {photosArePlaceholder && (
        <p className="absolute bottom-2 right-3 text-[0.625rem] text-ivory/60">※写真はイメージです</p>
      )}
    </section>
  );
}
