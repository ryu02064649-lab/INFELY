import { Underline } from "./Doodles";

type Props = {
  en: string;
  /** Japanese heading; array items are rendered on separate lines on small screens */
  title: string | readonly string[];
  tone?: "dark" | "light";
  align?: "left" | "center";
  id?: string;
  children?: React.ReactNode;
};

export default function SectionHeading({
  en,
  title,
  tone = "dark",
  align = "left",
  id,
  children,
}: Props) {
  const lines = typeof title === "string" ? [title] : title;
  const center = align === "center";
  return (
    <div className={center ? "text-center" : ""}>
      <p
        data-reveal="left"
        className={`font-en text-[3.5rem] sm:text-[5rem] md:text-[6.5rem] ${
          tone === "light" ? "text-yellow" : "text-red"
        }`}
        aria-hidden="true"
      >
        {en}
      </p>
      <h2
        id={id}
        data-reveal
        style={{ "--d": "0.1s" } as React.CSSProperties}
        className={`font-display relative mt-3 inline-block text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] ${
          tone === "light" ? "text-ivory" : "text-ink"
        }`}
      >
        {lines.map((l, i) => (
          <span key={i} className="inline-block">
            {l}
          </span>
        ))}
        <Underline
          className={`absolute -bottom-3 left-0 h-3 w-full ${tone === "light" ? "text-yellow" : "text-yellow"}`}
        />
      </h2>
      {children && (
        <div
          data-reveal
          style={{ "--d": "0.2s" } as React.CSSProperties}
          className={`mt-7 max-w-[34rem] text-[0.95rem] md:text-base ${center ? "mx-auto" : ""} ${
            tone === "light" ? "text-ivory/90" : "text-brown"
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
