import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileCtaBar from "@/components/layout/MobileCtaBar";
import MenuCard from "@/components/ui/MenuCard";
import { DraftNotice } from "@/components/ui/Notice";
import { Star } from "@/components/ui/Doodles";
import { categories, itemsByCategory, menuIsSample } from "@/data/menu";
import { photosArePlaceholder, RESERVE_PATH, site } from "@/config/site";

export const metadata: Metadata = {
  title: "メニュー",
  description: `${site.name}のメニュー一覧。牛肉・豚肉・鶏肉・ホルモン・盛り合わせから、サイド、ご飯もの、デザート、ドリンクまで。`,
  alternates: { canonical: "/menu/" },
  openGraph: { url: "/menu/", title: `メニュー｜${site.name}` },
};

export default function MenuPage() {
  const groups = categories
    .map((c) => ({ ...c, items: itemsByCategory(c.id) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <Header solid />
      <main id="main" className="pt-[4.25rem]">
        <section aria-labelledby="menu-page-title" className="bg-check relative overflow-hidden py-16 text-ivory md:py-24">
          <Star className="absolute right-[10%] top-10 size-10 text-yellow" />
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
            <p className="font-en text-[4rem] text-yellow sm:text-[6rem] md:text-[8rem]" aria-hidden="true">
              MENU
            </p>
            <h1 id="menu-page-title" className="font-display mt-2 text-[2rem] md:text-[2.75rem]">
              お品書き
            </h1>
            <p className="mt-4 max-w-[34rem] font-bold">
              迷ったら、まずはカルビとタン塩。〆までしっかり楽しんでください。
            </p>
          </div>
        </section>

        {/* Category jump links */}
        <nav
          aria-label="メニューカテゴリ"
          className="sticky top-[3.9rem] z-30 border-b-[2.5px] border-ink bg-ivory/95 backdrop-blur-md"
        >
          <ul className="mx-auto flex max-w-[1240px] gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden">
            {groups.map((g) => (
              <li key={g.id} className="shrink-0">
                <a
                  href={`#${g.id}`}
                  className="inline-flex min-h-10 items-center rounded-full border-2 border-ink bg-white px-4 text-[0.875rem] font-black transition-colors hover:bg-yellow"
                >
                  {g.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="bg-paper py-14 md:py-20">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
            {(menuIsSample || photosArePlaceholder) && (
              <DraftNotice className="max-w-[44rem]">
                {menuIsSample && "掲載中のメニュー名・価格・説明はサンプルです。実際の内容・価格とは異なります。"}
                {photosArePlaceholder && "写真はすべてイメージです。"}
              </DraftNotice>
            )}

            {groups.map((g) => (
              <section key={g.id} id={g.id} aria-labelledby={`${g.id}-title`} className="mt-14 scroll-mt-36 first-of-type:mt-10">
                <div className="flex items-baseline gap-4 border-b-[2.5px] border-ink pb-3">
                  <h2 id={`${g.id}-title`} className="font-display text-[1.6rem] md:text-[2rem]">
                    {g.label}
                  </h2>
                  <span className="font-en text-[1.25rem] text-red" aria-hidden="true">
                    {g.en}
                  </span>
                </div>
                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {g.items.map((item, i) => (
                    <MenuCard key={item.id} item={item} delay={(i % 3) * 0.06} />
                  ))}
                </div>
              </section>
            ))}

            <div className="mt-20 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/" className="btn bg-ivory text-ink">
                トップへ戻る
              </Link>
              <Link href={RESERVE_PATH} className="btn bg-red text-ivory">
                予約する
                <span aria-hidden="true" className="text-yellow">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  );
}
