import Image from "next/image";
import { gallery, type GalleryItem } from "@/data/content";
import { photosArePlaceholder } from "@/config/site";
import SectionHeading from "@/components/ui/SectionHeading";

const shapeClass: Record<GalleryItem["shape"], string> = {
  big: "col-span-2 aspect-[4/3] md:row-span-2 md:aspect-auto",
  wide: "col-span-2 aspect-[16/10] md:aspect-auto",
  tall: "aspect-[3/4] md:row-span-2 md:aspect-auto",
  square: "aspect-[3/4] md:aspect-auto",
};

const sizes: Record<GalleryItem["shape"], string> = {
  big: "(min-width: 768px) 50vw, 100vw",
  wide: "(min-width: 768px) 50vw, 100vw",
  tall: "(min-width: 768px) 25vw, 50vw",
  square: "(min-width: 768px) 25vw, 50vw",
};

export default function Gallery() {
  return (
    <section id="gallery" aria-labelledby="gallery-title" className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <SectionHeading en="GALLERY" title="焼ける音まで、おいしい。" id="gallery-title">
          <p>
            網の上でじゅわっと焼ける肉、テーブルいっぱいの料理、乾杯の音。お店の雰囲気をのぞいてみてください。
            {photosArePlaceholder && <span className="mt-1 block text-[0.8125rem] font-bold text-red">※現在の写真はすべてイメージです。</span>}
          </p>
        </SectionHeading>

        <ul className="mt-14 grid grid-flow-row-dense grid-cols-2 gap-3 sm:gap-4 md:auto-rows-[14rem] md:grid-cols-4 lg:auto-rows-[16.5rem]">
          {gallery.map((g, i) => (
            <li
              key={g.src + i}
              data-reveal
              style={{ "--d": `${(i % 4) * 0.07}s` } as React.CSSProperties}
              className={`group relative overflow-hidden rounded-[20px] border-[2.5px] border-ink bg-char ${shapeClass[g.shape]}`}
            >
              <Image
                src={g.src}
                alt={g.alt}
                fill
                sizes={sizes[g.shape]}
                className="object-cover transition-transform duration-700 ease-out pointer-fine:group-hover:scale-[1.05]"
              />
              <p className="absolute bottom-2.5 left-2.5 max-w-[calc(100%-1.25rem)] rounded-full border-2 border-ink bg-ivory px-3 py-0.5 text-[0.75rem] font-black text-ink shadow-[0_2px_0_var(--color-ink)] md:text-[0.8125rem]">
                {g.caption}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
