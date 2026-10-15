import Image from "next/image";
import { recommends } from "@/data/content";
import { findItem, formatPrice, menuIsSample } from "@/data/menu";
import { photosArePlaceholder } from "@/config/site";
import SectionHeading from "@/components/ui/SectionHeading";
import { DraftBadge } from "@/components/ui/Notice";
import { Star } from "@/components/ui/Doodles";

export default function Recommend() {
  return (
    <section
      id="recommend"
      aria-labelledby="recommend-title"
      className="relative overflow-hidden bg-char py-24 text-ivory md:py-32"
    >
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <SectionHeading en="RECOMMEND" title={["まずはコレ、", "食べてみて！"]} tone="light" id="recommend-title">
          <p>はじめての方に食べてほしい、お店のおすすめ。</p>
        </SectionHeading>

        <ol className="mt-16 space-y-20 md:mt-20 md:space-y-28">
          {recommends.map((r, i) => {
            const item = findItem(r.menuId);
            const flip = i % 2 === 1;
            return (
              <li key={r.menuId} className="grid items-center gap-8 md:grid-cols-12 md:gap-6">
                <div
                  data-reveal={flip ? "right" : "left"}
                  className={`relative -mx-4 sm:mx-0 md:col-span-7 ${flip ? "md:order-2 md:col-start-6" : ""}`}
                >
                  <div
                    className={`relative aspect-[4/3] overflow-hidden border-y-[3px] border-ink sm:rounded-[28px] sm:border-[3px] ${
                      flip ? "sm:rotate-[1.5deg] sm:shadow-[-12px_12px_0_var(--color-yellow)]" : "sm:-rotate-[1.5deg] sm:shadow-[12px_12px_0_var(--color-red)]"
                    }`}
                  >
                    <Image
                      src={r.image.src}
                      alt={r.image.alt}
                      fill
                      sizes="(min-width: 768px) 58vw, 100vw"
                      className="object-cover"
                    />
                    {photosArePlaceholder && (
                      <span className="absolute bottom-2 right-3 text-[0.625rem] text-ivory/70">※写真はイメージです</span>
                    )}
                  </div>
                  <span
                    className={`font-en absolute -top-10 text-[6rem] text-yellow drop-shadow-[0_4px_0_var(--color-red)] md:-top-14 md:text-[8.5rem] ${
                      flip ? "right-3 md:-right-4" : "left-3 md:-left-4"
                    }`}
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div
                  data-reveal
                  style={{ "--d": "0.15s" } as React.CSSProperties}
                  className={`md:col-span-5 ${flip ? "md:order-1 md:col-start-1 md:row-start-1" : "md:pl-6"}`}
                >
                  <p className="inline-flex items-center gap-2 rounded-full bg-red px-4 py-1 text-[0.85rem] font-black">
                    <Star className="size-3.5 text-yellow" />
                    {r.catch}
                  </p>
                  <h3 className="font-display mt-4 text-[2.4rem] leading-tight md:text-[3.25rem]">{item.name}</h3>
                  <p className="mt-4 text-[0.98rem] leading-[1.95] text-ivory/85">{r.text}</p>
                  <p className="mt-6 flex flex-wrap items-end gap-3">
                    <span className="font-en text-[3rem] text-yellow md:text-[3.5rem]">{formatPrice(item.price)}</span>
                    {item.unit && <span className="pb-2 text-sm font-bold text-ivory/80">／{item.unit}</span>}
                    {menuIsSample && (
                      <span className="pb-2.5 [&>span]:border-yellow [&>span]:text-yellow">
                        <DraftBadge>サンプル価格</DraftBadge>
                      </span>
                    )}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
