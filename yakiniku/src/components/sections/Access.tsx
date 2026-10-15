import { mapHref, shop, shopIsPlaceholder } from "@/data/shop";
import SectionHeading from "@/components/ui/SectionHeading";
import { DraftBadge, DraftNotice } from "@/components/ui/Notice";

export default function Access() {
  const map = mapHref();
  return (
    <section id="access" aria-labelledby="access-title" className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <SectionHeading en="ACCESS" title="お店の場所" id="access-title" />

        {shopIsPlaceholder && (
          <DraftNotice className="mt-10 max-w-[40rem]">
            店舗情報は準備中です。現在は<strong className="text-red">仮のデータ</strong>
            を表示しています（「仮」と付いた項目は実際の情報ではありません）。
          </DraftNotice>
        )}

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
          <dl
            data-reveal
            className="overflow-hidden rounded-[22px] border-[2.5px] border-ink bg-white shadow-[0_6px_0_var(--color-ink)]"
          >
            {shop.rows.map((r) => (
              <div
                key={r.label}
                className="grid gap-1 border-b-2 border-dashed border-line px-5 py-4 last:border-b-0 sm:grid-cols-[9rem_1fr] sm:gap-4 md:px-7"
              >
                <dt className="flex items-center gap-2 text-[0.8125rem] font-black text-red">{r.label}</dt>
                <dd className="flex flex-wrap items-start gap-2 text-[0.95rem] font-bold">
                  <span className={r.placeholder ? "text-brown/80" : ""}>
                    {Array.isArray(r.value)
                      ? r.value.map((v) => (
                          <span key={v} className="block">
                            {v}
                          </span>
                        ))
                      : r.value}
                  </span>
                  {r.placeholder && <DraftBadge />}
                </dd>
              </div>
            ))}
          </dl>

          <div data-reveal style={{ "--d": "0.15s" } as React.CSSProperties} className="flex flex-col gap-5">
            {/* Illustrated map card (swap for an embedded map once the address is fixed) */}
            <div className="bg-dots relative grid min-h-[16rem] flex-1 place-items-center overflow-hidden rounded-[22px] border-[2.5px] border-ink bg-cream shadow-[0_6px_0_var(--color-ink)]">
              <svg viewBox="0 0 400 260" className="absolute inset-0 size-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
                <g fill="none" stroke="var(--color-ivory)" strokeWidth="18" strokeLinecap="round">
                  <path d="M-10 170C80 150 160 190 240 150s120-40 180-30" />
                  <path d="M120 -10c10 80-20 150 10 280" />
                  <path d="M300 -10c-20 90 20 180-10 280" />
                </g>
                <g fill="none" stroke="var(--color-line)" strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round">
                  <path d="M-10 70h420" />
                  <path d="M210 -10v280" />
                </g>
              </svg>
              <div className="relative flex flex-col items-center">
                <svg viewBox="0 0 48 64" className="wiggle h-16 w-12 drop-shadow-[0_3px_0_var(--color-ink)]" aria-hidden="true">
                  <path d="M24 2C12 2 3 11 3 23c0 16 21 37 21 37s21-21 21-37C45 11 36 2 24 2Z" fill="var(--color-red)" stroke="var(--color-ink)" strokeWidth="3.5" />
                  <circle cx="24" cy="23" r="8" fill="var(--color-yellow)" stroke="var(--color-ink)" strokeWidth="3" />
                </svg>
                <p className="font-display mt-2 rounded-full border-2 border-ink bg-ivory px-4 py-1 text-[0.95rem]">{shop.name}</p>
              </div>
            </div>

            {map ? (
              <a href={map} target="_blank" rel="noopener noreferrer" className="btn bg-yellow text-ink">
                Google Mapsで見る
                <span className="sr-only">（新しいタブで開きます）</span>
              </a>
            ) : (
              <span className="btn bg-ivory text-ink" aria-disabled="true">
                Google Maps（住所確定後に表示）
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
