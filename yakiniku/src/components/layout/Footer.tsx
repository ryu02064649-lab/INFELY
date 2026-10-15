import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { navigation } from "@/data/navigation";
import { MENU_PATH, photosArePlaceholder, RESERVE_PATH, site, sns } from "@/config/site";
import { InstagramIcon } from "@/components/ui/InstagramFollow";

export default function Footer() {
  return (
    <footer className="bg-char pb-28 pt-16 text-ivory md:pb-12">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <Logo tone="light" />
            <p className="mt-5 text-sm text-ivory/75">{site.description}</p>
            {/^https?:\/\//.test(sns.instagram) && (
              <a
                href={sns.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-ivory/40 px-4 py-2 text-sm font-bold hover:border-yellow hover:text-yellow"
              >
                <InstagramIcon className="size-5" />
                Instagram
                <span className="sr-only">（新しいタブで開きます）</span>
              </a>
            )}
          </div>
          <nav aria-label="フッターメニュー">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-3">
              {navigation.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="font-en text-lg tracking-[0.1em] hover:text-yellow">
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={MENU_PATH} className="font-en text-lg tracking-[0.1em] hover:text-yellow">
                  ALL MENU
                </Link>
              </li>
              <li>
                <Link href={RESERVE_PATH} className="font-en text-lg tracking-[0.1em] text-yellow hover:text-ivory">
                  RESERVE
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-ivory/15 pt-6 text-xs text-ivory/60 md:flex-row md:justify-between">
          {photosArePlaceholder && <p>※掲載の写真はすべてイメージです。実際の料理・店内とは異なります。</p>}
          <p>
            <small>© {site.name}</small>
          </p>
        </div>
      </div>
    </footer>
  );
}
