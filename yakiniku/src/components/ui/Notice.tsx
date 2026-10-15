/** Small badge marking placeholder / sample content. */
export function DraftBadge({ children = "仮" }: { children?: React.ReactNode }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-[4px] border-[1.5px] border-dashed border-red px-1.5 text-[0.6875rem] font-black leading-[1.5] tracking-wider text-red">
      {children}
    </span>
  );
}

/** Dashed notice box for “this is sample data” messages. */
export function DraftNotice({
  children,
  tone = "dark",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <p
      role="note"
      className={`flex items-start gap-2 rounded-xl border-2 border-dashed px-4 py-3 text-[0.8125rem] font-bold leading-relaxed ${
        tone === "light"
          ? "border-yellow/70 text-ivory"
          : "border-red/50 bg-white/50 text-ink"
      } ${className}`}
    >
      <span aria-hidden="true" className={tone === "light" ? "text-yellow" : "text-red"}>
        ※
      </span>
      <span>{children}</span>
    </p>
  );
}
