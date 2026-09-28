import { business } from "@/config/business";

/**
 * Price list. Amounts are strings so formatting stays exactly as written.
 */
export type Plan = {
  id: string;
  name: string;
  price: string;
  /** Printed after the amount, e.g. "〜" or "〜 / MONTH". */
  suffix: string;
  lead: string;
  /** The moment this plan is for — framed as time handed over, not searches bought. */
  scene?: string;
  /** Shown as an inverted (dark) panel to mark the continuing membership. */
  emphasis?: boolean;
  items: string[];
  example?: { label: string; lines: string[] };
  note?: string;
};

export const plans: Plan[] = [
  {
    id: "one-request",
    name: "ONE REQUEST",
    price: "¥10,000",
    suffix: "〜",
    lead: "ひとつの依頼に、選ぶ理由まで。",
    scene: "大切な会食、週末の手土産。ひとつの「探す」を、まるごと任せたいときに。",
    items: [
      "基本リサーチ",
      "条件ヒアリング",
      "候補調査",
      "比較",
      "3〜5候補",
      "おすすめ理由",
      "公式情報 / 予約情報",
    ],
  },
  {
    id: "deep-research",
    name: "DEEP RESEARCH",
    price: "¥25,000",
    suffix: "〜",
    lead: "重なる条件を、ひとつの計画に。",
    scene: "滞在、食事、体験。いくつもの予定を、一度に考えたいときに。",
    items: [
      "複数条件のリサーチ",
      "詳細ヒアリング",
      "複数サービスの調査",
      "比較",
      "最終候補の選定",
      "詳細レポート",
    ],
    example: {
      label: "例",
      lines: ["沖縄で記念日を過ごしたい。", "ホテル ＋ ディナー ＋ 体験"],
    },
  },
  {
    id: "concierge",
    name: "RELY CONCIERGE",
    price: "¥48,000",
    suffix: "〜 / MONTH",
    lead: "探す時間を、毎月まとめて手放す。",
    scene: "会食、出張、贈り物。繰り返し訪れる「探す」を、継続して任せたいときに。",
    emphasis: true,
    items: ["レストラン", "ホテル", "ギフト", "体験", "各種リサーチ"],
    note: "ご依頼は月4件まで。5件目以降は、1件ごとに ONE REQUEST の料金で承ります。",
  },
];

export const option: Plan = {
  id: "arrangement",
  name: "RESERVATION SUPPORT",
  price: "¥2,000",
  suffix: "〜",
  lead: "レストランの予約代行。ホテル・体験は、予約先のご案内までとなります。",
  items: [],
};

export const pricingNotes = [
  business.taxStatus === "exempt"
    ? "※ 表示価格がお支払いいただく総額です（消費税の別途請求はありません）。"
    : "※ 表示価格はすべて税込です。",
  "※ 最終的な料金は、ご依頼内容を伺ったうえで個別にお見積もりします。",
  "※ 実際の商品・飲食・宿泊・体験などの料金は別途。",
  "※ 予約代行は、先方の空き状況や条件により承れない場合があります。",
  "※ ホテル・宿泊施設・体験のご予約は、お客様ご自身でお願いしております（予約先をご案内します）。",
];

/** What the fee pays for — shown above the plans to set the frame. */
export const pricingPrinciples = [
  { en: "TIME", text: "対価は、情報ではなく時間に。" },
  { en: "REASON", text: "候補の数ではなく、選ぶ理由を。" },
  { en: "PRIVATE", text: "ひとりの依頼に、ひとつの調査を。" },
];
