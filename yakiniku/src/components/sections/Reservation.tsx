import { reservation, reserveChannels, hasReserveChannel } from "@/config/reservation";
import { Burst, Sizzle, Star } from "@/components/ui/Doodles";
import { DraftNotice } from "@/components/ui/Notice";
import InstagramFollow from "@/components/ui/InstagramFollow";

export default function Reservation() {
  const channels = reserveChannels();
  const ready = hasReserveChannel();

  return (
    <section
      id="reserve"
      aria-labelledby="reserve-title"
      className="relative isolate overflow-hidden bg-red py-24 text-ivory md:py-32"
    >
      {/* big background burst */}
      <Burst points={28} className="absolute -right-40 -top-40 -z-10 size-[34rem] text-red-deep md:-right-24 md:size-[44rem]" />
      <Star className="absolute left-[7%] top-16 size-10 text-yellow" />
      <Star className="absolute bottom-20 left-[14%] size-6 text-ivory/70" />

      <div className="mx-auto max-w-[960px] px-4 text-center sm:px-6">
        <p data-reveal className="font-en text-[3.25rem] text-yellow sm:text-[5rem] md:text-[6.5rem]" aria-hidden="true">
          RESERVE
        </p>
        <h2
          id="reserve-title"
          data-reveal
          style={{ "--d": "0.1s" } as React.CSSProperties}
          className="font-display relative mt-2 text-[2.4rem] leading-[1.25] drop-shadow-[0_4px_0_var(--color-red-deep)] sm:text-[3.25rem] md:text-[4.25rem]"
        >
          <span className="inline-block">今夜は、</span>
          <span className="inline-block">焼肉にしよう。</span>
          <Sizzle className="wiggle absolute -top-8 right-[8%] w-12 text-yellow md:right-[4%]" />
        </h2>
        <p data-reveal style={{ "--d": "0.2s" } as React.CSSProperties} className="mt-5 text-[1.05rem] font-bold md:text-[1.25rem]">
          おいしい肉を囲んで、楽しい時間を。
        </p>

        <div
          data-reveal
          style={{ "--d": "0.3s" } as React.CSSProperties}
          className="mx-auto mt-10 flex max-w-[36rem] flex-col items-stretch justify-center gap-4 sm:flex-row"
        >
          {channels.map((c) =>
            c.href ? (
              <a
                key={c.kind}
                href={c.href}
                {...(c.kind === "web" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`btn min-h-16 flex-1 text-[1.125rem] ${c.kind === "web" ? "bg-yellow text-ink" : "bg-ivory text-ink"}`}
              >
                <span className="flex flex-col leading-tight">
                  {c.label}
                  {c.detail && <span className="font-en mt-1 text-[1.1rem] tracking-[0.06em] text-red">{c.detail}</span>}
                </span>
                {c.kind === "web" && <span className="sr-only">（新しいタブで開きます）</span>}
              </a>
            ) : (
              <span
                key={c.kind}
                aria-disabled="true"
                className="btn min-h-16 flex-1 bg-ivory text-[1.0625rem] text-ink"
              >
                <span className="flex flex-col leading-tight">
                  {c.label}
                  <span className="mt-1 text-[0.75rem] font-bold text-brown">受付準備中</span>
                </span>
              </span>
            ),
          )}
        </div>

        {!ready && (
          <DraftNotice tone="light" className="mx-auto mt-8 max-w-[36rem] text-left">
            ご予約の受付方法は現在準備中です。開始まで、もうしばらくお待ちください。
          </DraftNotice>
        )}

        <ul className="mx-auto mt-8 max-w-[36rem] space-y-1 text-left text-[0.875rem] font-bold text-ivory/90">
          {reservation.notes.map((n) => (
            <li key={n} className="flex gap-2">
              <span aria-hidden="true" className="text-yellow">
                ※
              </span>
              {n}
            </li>
          ))}
        </ul>

        <div data-reveal className="mx-auto mt-14 max-w-[40rem]">
          <InstagramFollow />
        </div>
      </div>
    </section>
  );
}
