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
          <SectionHeading en="MENU" title="今日、なに焼く？" id="menu-title">
            <p>定番のカルビから、さっぱりタン塩、ぷりぷりホルモンまで。まずは気になる一皿から。</p>
          </SectionHeading>
          {menuIsSample && (
            <DraftNotice className="md:max-w-[22rem]">
              掲載中のメニュー名・価格はサンプルです。実際の内容・価格とは異なります。
            </DraftNotice>
          )}
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lead && (
            <div className="sm:col-span-2 lg:col-span-3">
              <MenuCard item={lead} size="lg" />
            </div>
          )}
          {rest.map((item, i) => (
            <MenuCard key={item.id} item={item} delay={(i % 3) * 0.08} />
          ))}
        </div>

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
