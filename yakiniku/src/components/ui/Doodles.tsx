/**
 * Hand-drawn style SVG ornaments. Purely decorative (aria-hidden).
 */
type P = { className?: string; style?: React.CSSProperties };

export function Star({ className, style }: P) {
  return (
    <svg viewBox="0 0 40 40" className={className} style={style} aria-hidden="true">
      <path
        d="M20 2.5c1.2 7.6 3.4 11.3 15.5 17.3-11.6 2.4-13.9 6.2-15.5 17.7C18.2 26 16 22.3 4.5 19.8 16.4 14.4 18.6 10.5 20 2.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Rising heat / sizzle marks. */
export function Sizzle({ className, style }: P) {
  return (
    <svg viewBox="0 0 60 48" className={className} style={style} aria-hidden="true" fill="none">
      <g stroke="currentColor" strokeWidth="4" strokeLinecap="round">
        <path d="M14 44c-6-7 6-11 0-19s5-12 1-20" />
        <path d="M30 44c-6-7 6-11 0-19s5-12 1-20" />
        <path d="M46 44c-6-7 6-11 0-19s5-12 1-20" />
      </g>
    </svg>
  );
}

/** Wavy marker underline. Animates in when its parent is revealed. */
export function Underline({ className, style }: P) {
  return (
    <svg viewBox="0 0 300 20" preserveAspectRatio="none" className={`draw-line ${className ?? ""}`} style={style} aria-hidden="true" fill="none">
      <path
        d="M4 13c40-9 76-9 104-4s58 6 92-1 62-6 96 0"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Loose hand-drawn arrow. */
export function Arrow({ className, style }: P) {
  return (
    <svg viewBox="0 0 90 70" className={className} style={style} aria-hidden="true" fill="none">
      <g stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 10c22-6 52 2 62 32" />
        <path d="M54 34l15 12 7-18" />
      </g>
    </svg>
  );
}

/** Zig-zag starburst used behind prices / badges. */
export function Burst({ className, style, points = 18 }: P & { points?: number }) {
  const d: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 ? 41 : 50;
    const a = (Math.PI * i) / points - Math.PI / 2;
    d.push(`${(50 + Math.cos(a) * r).toFixed(2)},${(50 + Math.sin(a) * r).toFixed(2)}`);
  }
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden="true">
      <polygon points={d.join(" ")} fill="currentColor" />
    </svg>
  );
}

/** Speech bubble shape. */
export function Bubble({ className, style }: P) {
  return (
    <svg viewBox="0 0 160 100" className={className} style={style} aria-hidden="true" preserveAspectRatio="none">
      <path
        d="M14 6h132a10 10 0 0 1 10 10v52a10 10 0 0 1-10 10H62l-26 18 4-18H14A10 10 0 0 1 4 68V16A10 10 0 0 1 14 6Z"
        fill="currentColor"
      />
    </svg>
  );
}
