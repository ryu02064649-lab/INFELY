import Image from "next/image";
import { formatPrice, menuIsSample, type MenuItem } from "@/data/menu";
import { DraftBadge } from "./Notice";

type Props = {
  item: MenuItem;
  /** large card used for the lead item */
  size?: "lg" | "md";
  delay?: number;
};

export default function MenuCard({ item, size = "md", delay = 0 }: Props) {
  const lg = size === "lg";
  return (
    <article
      data-reveal
      style={{ "--d": `${delay}s` } as React.CSSProperties}
      className={`group relative flex h-full flex-col overflow-hidden rounded-[22px] border-[2.5px] border-ink bg-white shadow-[0_6px_0_var(--color-ink)] transition-transform duration-300 pointer-fine:hover:-translate-y-1.5 ${
        lg ? "md:flex-row" : ""
      }`}
    >
      <div className={`relative aspect-[4/3] overflow-hidden bg-char ${lg ? "md:aspect-auto md:w-[58%]" : ""}`}>
        <Image
          src={item.image}
          alt={`${item.name}のイメージ`}
          fill
          sizes={lg ? "(min-width: 768px) 40vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
          className="object-cover transition-transform duration-700 ease-out pointer-fine:group-hover:scale-[1.06]"
        />
        {item.recommended && (
          <span
            className="absolute left-3 top-3 grid size-[4.25rem] rotate-[-12deg] place-items-center rounded-full border-[2.5px] border-ink bg-yellow text-center font-display text-[0.8rem] leading-tight text-ink shadow-[0_3px_0_var(--color-ink)] md:size-[4.75rem] md:text-[0.9rem]"
          >
            <span>
              おすすめ
              <span className="block text-[0.6rem] text-red">★★★</span>
            </span>
          </span>
        )}
      </div>
      <div className={`flex flex-1 flex-col p-5 ${lg ? "md:justify-center md:p-8" : ""}`}>
        <h3 className={`font-display ${lg ? "text-[1.6rem] md:text-[2rem]" : "text-[1.25rem]"}`}>{item.name}</h3>
        <p className={`mt-2 flex-1 text-brown ${lg ? "text-[0.95rem] md:text-base" : "text-[0.875rem] leading-relaxed"}`}>
          {item.description}
        </p>
        <p className="mt-4 flex flex-wrap items-end gap-x-2 gap-y-1">
          <span className={`font-en text-red ${lg ? "text-[2.75rem] md:text-[3.25rem]" : "text-[2rem]"}`}>
            {formatPrice(item.price)}
          </span>
          {item.unit && <span className="pb-1 text-xs font-bold text-brown">／{item.unit}</span>}
          {menuIsSample && (
            <span className="pb-1.5">
              <DraftBadge>サンプル価格</DraftBadge>
            </span>
          )}
        </p>
      </div>
    </article>
  );
}
