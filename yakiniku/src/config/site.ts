/**
 * Brand-level settings. Copy that appears in several places lives here
 * so it only has to be changed once.
 */
export const site = {
  /** 正式な店名 */
  name: "大衆焼肉 美味",
  /** ロゴの大きな文字 */
  logoMark: "美味",
  /** ロゴの小さな文字（業態） */
  genre: "大衆焼肉",
  /** 英字のアクセント表記（店名の読みに依存しない表記にしています） */
  genreEn: "TAISHU YAKINIKU",
  title: "大衆焼肉 美味｜今日は、焼肉で決まり！",
  description:
    "仲間と、家族と、気の合う人と。おいしい焼肉を気軽に楽しめる大衆焼肉店「美味」。ご予算の目安はお一人様5,000円〜。",
  catchcopy: ["今日は、", "焼肉で決まり！"],
  subcopy: ["仲間と、家族と、気の合う人と。", "おいしい焼肉を気軽に楽しもう。"],
  budget: { label: "お一人様", price: "5,000", suffix: "円〜" },
  locale: "ja_JP",
  /**
   * Public URL used for canonical / OGP. Set NEXT_PUBLIC_SITE_URL in the
   * hosting environment once a domain is decided.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.URL ??
    "http://localhost:3000",
} as const;

/**
 * 写真について。現在の画像は撮影写真ではなく、プログラムで描いた仮のイメージです。
 * 実際の店舗・料理写真に差し替えたら `false` にすると「イメージ」表記が消えます。
 */
export const photosArePlaceholder = true;

/**
 * SNS。URLを入れると「フォローする」ボタンが有効になります（空なら「準備中」表示）。
 * 例: instagram: "https://www.instagram.com/xxxxx/"
 */
export const sns = {
  instagram: "",
} as const;

/** Section anchors on the top page. */
export const RESERVE_PATH = "/#reserve";
export const MENU_PATH = "/menu/";
