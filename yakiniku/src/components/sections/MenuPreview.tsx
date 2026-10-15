import Link from "next/link";
import { menu, menuIsSample } from "@/data/menu";
import { MENU_PATH } from "@/config/site";
import SectionHeading from "@/components/ui/SectionHeading";
import MenuCard from "@/components/ui/MenuCard";
import { DraftNotice } from "@/components/ui/Notice";
import { Arrow } from "@/components/ui/Doodles";

export default function MenuPreview() {
  const featured = menu.filter((m) => m.featured);
  const [lead, ...rest] = featured;

  return (
    <section id="menu" aria-labelledby="menu-title" className="bg-dots relative bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading en="MENU" title="今日、なに焼く？" variant="label" id="menu-title">
            <p>定番のカルビから、さっぱりタン塩、ぷりぷりホルモンまで。まずは気になる一皿から。</p>
          </SectionHeading>
          {menuIsSample && (
            <DraftNotice className="md:max-w-[22rem]">
              掲載中のメニュー名・価格はサンプルです。実際の内容・価格とは異なります。
            </DraftNotice>
          )}
        </div>

        {lead && (
          <div className="mt-14">
            <MenuCard item={lead} size="lg" />
          </div>
        )}

        {/* Phones: swipeable row. Larger screens: grid. */}
        <p className="mt-8 flex items-center justify-end gap-2 text-[0.8125rem] font-black text-red sm:hidden" aria-hidden="true">
          スワイプしてね <span className="font-en text-lg">→</span>
        </p>
        <ul
          aria-label="おすすめメニュー"
          className="-mx-4 mt-3 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-6 pt-1 [scrollbar-width:none] sm:mx-0 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden"
        >
          {rest.map((item, i) => (
            <li key={item.id} className="w-[68%] shrink-0 snap-start sm:w-auto">
              <MenuCard item={item} delay={(i % 3) * 0.08} />
            </li>
          ))}
        </ul>

        <div className="relative mt-14 flex justify-center">
          <Arrow className="absolute -top-12 left-[calc(50%-9.5rem)] hidden w-16 -scale-x-100 rotate-[20deg] text-red sm:block" />
          <Link href={MENU_PATH} className="btn bg-red px-9 text-[1.0625rem] text-ivory">
            メニュー一覧を見る
            <span aria-hidden="true" className="text-yellow">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
