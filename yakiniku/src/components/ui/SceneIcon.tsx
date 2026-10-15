import type { SceneIcon as Kind } from "@/data/content";

const S = { stroke: "var(--color-ink)", strokeWidth: 4, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
const RED = "var(--color-red)";
const YEL = "var(--color-yellow)";
const IVO = "var(--color-ivory)";

function Mug({ x, rot }: { x: number; rot: number }) {
  return (
    <g transform={`rotate(${rot} ${x + 16} 70)`}>
      <path d={`M${x + 32} 52h8a8 8 0 0 1 0 16h-8`} fill="none" {...S} />
      <rect x={x} y={44} width={32} height={46} rx={5} fill={YEL} {...S} />
      <path d={`M${x - 3} 46c0-8 6-12 12-9 3-6 13-6 15 1 6-2 11 3 9 9z`} fill="#fff" {...S} />
      <path d={`M${x + 8} 58v22`} stroke="#fff" strokeWidth={4} strokeLinecap="round" opacity={0.7} />
    </g>
  );
}

const icons: Record<Kind, React.ReactNode> = {
  friends: (
    <>
      <Mug x={22} rot={-14} />
      <Mug x={64} rot={14} />
      <path d="M58 24v-10M44 30l-6-7M72 30l6-7" {...S} fill="none" stroke={RED} />
    </>
  ),
  afterwork: (
    <>
      <path d="M78 18a22 22 0 1 0 22 30 18 18 0 1 1-22-30z" fill={YEL} {...S} />
      <path d="M48 38l-10 8 6 6-8 40 12 12 12-12-8-40 6-6z" fill={RED} {...S} />
      <path d="M42 38h12" {...S} />
    </>
  ),
  family: (
    <>
      <path d="M22 60h76a38 38 0 0 1-76 0z" fill={RED} {...S} />
      <path d="M26 60c4-14 18-20 34-20s30 6 34 20z" fill="#fff" {...S} />
      <path d="M78 14l-26 38M92 18L60 52" {...S} stroke="#b07a3a" strokeWidth={5} />
      <path d="M58 104c-10-6-14-12-10-17 3-3 8-2 10 2 2-4 7-5 10-2 4 5 0 11-10 17z" fill={YEL} {...S} transform="translate(0 -6)" />
    </>
  ),
  date: (
    <>
      <path d="M44 92C22 78 12 64 18 50c5-11 19-12 26-3 7-9 21-8 26 3 6 14-4 28-26 42z" fill={RED} {...S} />
      <path d="M80 70c-14-9-20-18-16-27 3-7 12-8 16-2 5-6 13-5 17 2 3 9-3 18-17 27z" fill={YEL} {...S} />
      <path d="M30 56c2-4 6-6 10-5" stroke="#fff" strokeWidth={4} strokeLinecap="round" fill="none" />
    </>
  ),
  birthday: (
    <>
      <rect x={20} y={58} width={80} height={38} rx={8} fill={IVO} {...S} />
      <path d="M20 70c8 8 14 8 20 0s14 8 20 0 14 8 20 0 14 8 20 0" fill="none" {...S} stroke={RED} />
      <rect x={54} y={36} width={12} height={22} rx={3} fill={YEL} {...S} />
      <path d="M60 14c8 8 6 16 0 18-6-2-8-10 0-18z" fill="var(--color-orange)" {...S} />
      <path d="M16 96h88" {...S} />
    </>
  ),
  party: (
    <>
      <path d="M24 100l18-56 38 38z" fill={YEL} {...S} />
      <path d="M33 72l20 20M38 58l26 26" {...S} stroke={RED} />
      <path d="M70 40c4-10 14-12 20-6M80 56c8-4 16 0 18 6M62 26c-2-6 0-12 6-14" fill="none" {...S} />
      <circle cx={96} cy={30} r={5} fill={RED} {...S} strokeWidth={3} />
      <circle cx={52} cy={20} r={4} fill={YEL} {...S} strokeWidth={3} />
      <path d="M100 82l6 4-6 4" fill="none" {...S} strokeWidth={3} />
    </>
  ),
};

export default function SceneIcon({ kind, className }: { kind: Kind; className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      {icons[kind]}
    </svg>
  );
}
