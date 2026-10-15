import { site } from "@/config/site";

/**
 * 店舗情報。
 *
 * 現在はすべて「仮データ」です。実際の情報に書き換えたら、該当行の
 * `placeholder` を `false`（または削除）にしてください。「仮」バッジが消えます。
 * すべて確定したら `shopIsPlaceholder` も `false` に。
 */
export const shopIsPlaceholder = true;

export type ShopRow = {
  label: string;
  value: string | string[];
  placeholder?: boolean;
};

export const shop = {
  name: site.name,
  address: "〒000-0000 〇〇県〇〇市〇〇町0-0-0",
  /** Google Maps のURL。空なら住所から自動生成（住所が仮の間はボタンを無効化） */
  mapUrl: "",
  rows: [
    { label: "店名", value: site.name },
    { label: "住所", value: "〒000-0000 〇〇県〇〇市〇〇町0-0-0", placeholder: true },
    { label: "電話番号", value: "00-0000-0000", placeholder: true },
    {
      label: "営業時間",
      value: ["〇〇:〇〇〜〇〇:〇〇（L.O. 〇〇:〇〇）"],
      placeholder: true,
    },
    { label: "定休日", value: "〇曜日", placeholder: true },
    { label: "駐車場", value: "〇台（または なし）", placeholder: true },
    {
      label: "最寄り駅・目印",
      value: "〇〇駅 〇〇口から徒歩〇分 ／ 〇〇の向かい",
      placeholder: true,
    },
    {
      label: "予約方法",
      value: "お電話またはWEB予約（受付方法は準備中です）",
      placeholder: true,
    },
  ] satisfies ShopRow[],
};

/** Google Maps link, or null while the address is still a placeholder. */
export function mapHref(s = shop, isPlaceholder = shopIsPlaceholder): string | null {
  if (s.mapUrl) return s.mapUrl;
  if (isPlaceholder) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${s.name} ${s.address}`,
  )}`;
}
