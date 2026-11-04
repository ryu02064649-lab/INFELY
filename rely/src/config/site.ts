/**
 * Brand-level settings. Copy that appears in several places lives here
 * so it only has to be changed once.
 */
export const site = {
  name: "RELY",
  category: "PRIVATE RESEARCH & CONCIERGE",
  title: "RELY｜PRIVATE RESEARCH & CONCIERGE",
  description:
    "探す・調べる・比較する時間を、RELYが引き受ける。沖縄のレストラン・ホテル・体験から、全国対応のギフトまで。",
  tagline: "あなたの時間を、もっと自由に。",
  philosophy: ["あなたが選ぶ。", "その前を、RELYが。"],
  signature: "探すことなら、RELY。",
  locale: "ja_JP",
  /**
   * Public URL used for canonical / OGP. Set NEXT_PUBLIC_SITE_URL in the
   * Netlify environment once a custom domain is decided. Netlify's own
   * `URL` build variable is used as a fallback.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.URL ??
    "http://localhost:3000",
} as const;

/** Path of the request (order) form page. */
export const REQUEST_PATH = "/request/";

export function requestHref(category?: string) {
  return category ? `${REQUEST_PATH}?category=${category}` : REQUEST_PATH;
}
