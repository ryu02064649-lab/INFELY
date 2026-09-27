import type { ReactNode } from "react";

type Props = {
  index: string;
  title: string;
  id: string;
  /** Japanese sub-copy under the English title. */
  lead?: ReactNode;
  tone?: "dark" | "light";
  className?: string;
};

/** "03 — SERVICE" eyebrow, large Didot title, optional Japanese lead. */
export default function SectionHeading({
  index,
  title,
  id,
  lead,
  tone = "dark",
  className = "",
}: Props) {
  const muted = tone === "dark" ? "text-mist" : "text-stone";
  return (
    <div className={className}>
      <p className={`label flex items-center gap-4 ${muted}`} data-reveal="fade">
        <span>{index}</span>
        <span aria-hidden="true" className="h-px w-10 bg-current opacity-60" />
        <span>{title}</span>
      </p>
      <h2
        id={id}
        className="display mt-8 text-[3.25rem] tracking-[0.08em] sm:text-[4.5rem] lg:text-[6.5rem]"
        data-reveal
      >
        {title}
      </h2>
      {lead ? (
        <p
          className="jp-heading mt-8 text-[1.125rem] sm:text-[1.375rem] lg:mt-10 lg:text-[1.625rem]"
          data-reveal
          style={{ "--reveal-delay": "0.15s" } as React.CSSProperties}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}
