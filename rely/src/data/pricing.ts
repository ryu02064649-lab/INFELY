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
    scene: "滞在、食事、体験。いくつもの手配を、一度に考えたいときに。",
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
  },
  {
    id: "business",
    name: "BUSINESS RESEARCH",
    price: "¥30,000",
    suffix: "〜",
    lead: "判断の前にある調査を、整理して届ける。",
    scene: "市場、競合、新規事業。意思決定に必要な材料を、任せたいときに。",
    items: [
      "市場調査",
      "競合調査",
      "商品調査",
      "新規事業調査",
      "その他カスタムリサーチ",
    ],
    note: "内容により個別見積もり。",
  },
];

export const option: Plan = {
  id: "arrangement",
  name: "RESERVATION / ARRANGEMENT SUPPORT",
  price: "¥2,000",
  suffix: "〜",
  lead: "予約・手配サポート。",
  items: [],
};

export const pricingNotes = [
  "※ 実際の商品・飲食・宿泊・体験などの料金は別途。",
  "※ 予約・手配は、先方の空き状況や条件により承れない場合があります。",
];

/** What the fee pays for — shown above the plans to set the frame. */
export const pricingPrinciples = [
  { en: "TIME", text: "対価は、情報ではなく時間に。" },
  { en: "REASON", text: "候補の数ではなく、選ぶ理由を。" },
  { en: "PRIVATE", text: "ひとりの依頼に、ひとつの調査を。" },
];
