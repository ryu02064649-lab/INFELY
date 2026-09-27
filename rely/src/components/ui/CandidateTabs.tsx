"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import type { Candidate, CandidateRow } from "@/data/example";

/** Accessible tab set (WAI-ARIA tabs pattern) for comparing candidates on phones. */
export default function CandidateTabs({
  candidates,
  rows,
}: {
  candidates: Candidate[];
  rows: CandidateRow[];
}) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = candidates.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight") next = active === last ? 0 : active + 1;
    if (e.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="候補" className="grid grid-cols-3 border-b border-white/10">
        {candidates.map((c, i) => {
          const selected = i === active;
          return (
            <button
              key={c.name}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`candidate-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`candidate-panel-${i}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={onKeyDown}
              className={`relative flex flex-col items-start py-5 text-left transition-colors duration-500 ${
                selected ? "text-ivory" : "text-mist"
              }`}
            >
              <span className="display text-[1.25rem]">{c.number}</span>
              <span className="label mt-1 text-[0.625rem] tracking-[0.18em]">
                {c.name.replace("RESTAURANT ", "REST. ")}
              </span>
              <span
                aria-hidden="true"
                className={`absolute -bottom-px left-0 h-px bg-ivory transition-[width] duration-700 ease-[var(--ease-quiet)] ${
                  selected ? "w-full" : "w-0"
                }`}
              />
            </button>
          );
        })}
      </div>

      {candidates.map((c, i) => (
        <div
          key={c.name}
          id={`candidate-panel-${i}`}
          role="tabpanel"
          aria-labelledby={`candidate-tab-${i}`}
          hidden={i !== active}
          tabIndex={0}
          className="pt-8"
        >
          <p className="display text-[1.5rem] tracking-[0.14em]">{c.name}</p>
          <dl className="mt-6 border-t border-white/10">
            {rows.map((row) => (
              <div key={row.key} className="flex gap-6 border-b border-white/10 py-4">
                <dt className="label w-20 shrink-0 pt-0.5 text-mist">{row.label}</dt>
                <dd className="text-[0.9375rem] tracking-[0.06em]">{c.values[row.key]}</dd>
              </div>
            ))}
          </dl>
          <p className="label mt-8 text-ivory">なぜこの候補か</p>
          <p className="mt-3 text-[0.9375rem] leading-[2.1] tracking-[0.06em] text-ivory/85">{c.reason}</p>
        </div>
      ))}
    </div>
  );
}
