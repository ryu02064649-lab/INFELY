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
  items: string[];
  example?: { label: string; lines: string[] };
  note?: string;
};

export const plans: Plan[] = [
  {
    id: "one-request",
    name: "ONE REQUEST",
    price: "¥5,000",
    suffix: "〜",
    lead: "ひとつの「探してほしい」を、一度だけ。",
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
    price: "¥15,000",
    suffix: "〜",
    lead: "条件が重なる依頼を、まとめて深く。",
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
    price: "¥30,000",
    suffix: "〜 / MONTH",
    lead: "継続的に、いつでも任せられる。",
    items: ["レストラン", "ホテル", "ギフト", "体験", "各種リサーチ"],
  },
  {
    id: "business",
    name: "BUSINESS RESEARCH",
    price: "¥30,000",
    suffix: "〜",
    lead: "事業の判断材料を、整理して届ける。",
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
