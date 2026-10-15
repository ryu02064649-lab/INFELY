import { Star, Underline } from "./Doodles";

type Props = {
  en: string;
  /** Japanese heading; array items are rendered on separate lines on small screens */
  title: string | readonly string[];
  tone?: "dark" | "light";
  align?: "left" | "center";
  /**
   * Heading styles, varied between sections so the page keeps a rhythm:
   * - stack   : big English word, Japanese title with a marker underline
   * - label   : small rotated English sticker, Japanese title as the hero
   * - outline : huge outlined English word with the Japanese title overlapping it
   */
  variant?: "stack" | "label" | "outline";
  id?: string;
  children?: React.ReactNode;
};

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

export default function SectionHeading({
  en,
  title,
  tone = "dark",
  align = "left",
  variant = "stack",
  id,
  children,
}: Props) {
  const lines = typeof title === "string" ? [title] : title;
  const center = align === "center";
  const light = tone === "light";

  const titleText = lines.map((l, i) => (
    <span key={i} className="inline-block">
      {l}
    </span>
  ));

  return (
    <div className={center ? "text-center" : ""}>
      {variant === "stack" && (
        <>
          <p
            data-reveal="left"
            className={`font-en text-[3.5rem] sm:text-[5rem] md:text-[6.5rem] ${light ? "text-yellow" : "text-red"}`}
            aria-hidden="true"
          >
            {en}
          </p>
          <h2
            id={id}
            data-reveal
            style={d(0.1)}
            className={`font-display relative mt-3 inline-block text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] ${light ? "text-ivory" : "text-ink"}`}
          >
            {titleText}
            <Underline className="absolute -bottom-3 left-0 h-3 w-full text-yellow" />
          </h2>
        </>
      )}

      {variant === "label" && (
        <>
          <p
            data-reveal="pop"
            style={{ "--rot": "-4deg" } as React.CSSProperties}
            className="inline-flex items-center gap-2 rounded-full border-[2.5px] border-ink bg-red px-4 py-1 text-ivory shadow-[0_3px_0_var(--color-ink)]"
            aria-hidden="true"
          >
            <Star className="size-3.5 text-yellow" />
            <span className="font-en text-[1.25rem] tracking-[0.14em] md:text-[1.5rem]">{en}</span>
          </p>
          <h2
            id={id}
            data-reveal
            style={d(0.1)}
            className={`font-display mt-5 text-[2.25rem] leading-[1.2] sm:text-[3rem] md:text-[3.75rem] ${light ? "text-ivory" : "text-ink"}`}
          >
            {titleText}
          </h2>
        </>
      )}

      {variant === "outline" && (
        <div className="relative">
          <p
            data-reveal={center ? undefined : "left"}
            className={`font-en text-outline select-none text-[4.5rem] leading-[0.9] sm:text-[7rem] md:text-[9.5rem] ${light ? "text-yellow" : "text-red"}`}
            aria-hidden="true"
          >
            {en}
          </p>
          <h2
            id={id}
            data-reveal
            style={d(0.12)}
            className={`font-display relative -mt-5 text-[2rem] leading-[1.25] sm:-mt-8 sm:text-[2.6rem] md:-mt-12 md:text-[3.25rem] ${
              light ? "text-ivory drop-shadow-[0_3px_0_var(--color-red)]" : "text-ink"
            }`}
          >
            {titleText}
          </h2>
        </div>
      )}

      {children && (
        <div
          data-reveal
          style={d(0.2)}
          className={`mt-7 max-w-[34rem] text-[0.95rem] md:text-base ${center ? "mx-auto" : ""} ${light ? "text-ivory/90" : "text-brown"}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
