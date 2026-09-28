/**
 * EXAMPLE section content.
 *
 * The three candidates are a *format illustration* — placeholders named
 * "RESTAURANT A/B/C". They carry no ratings, reviews or claims about any
 * real business. If real venues are ever shown here, every field must be
 * replaced with verified, current information.
 */
export const exampleRequest = {
  quote: "沖縄で取引先との会食場所を探してほしい。",
  conditions: [
    { label: "人数", value: "4名" },
    { label: "席", value: "個室" },
    { label: "予算", value: "1人 10,000円程度" },
    { label: "エリア", value: "那覇周辺" },
  ],
  process: [
    "候補を調査",
    "条件を比較",
    "雰囲気を確認",
    "アクセスを確認",
    "予約情報を確認",
    "3候補程度に厳選",
    "それぞれの違いを整理",
  ],
  closing: "そして、「なぜこの候補なのか」まで。",
};

export type CandidateRow = { key: string; label: string };

export const candidateRows: CandidateRow[] = [
  { key: "focus", label: "選定の軸" },
  { key: "room", label: "個室" },
  { key: "budget", label: "予算" },
  { key: "mood", label: "雰囲気" },
  { key: "access", label: "アクセス" },
  { key: "booking", label: "予約" },
];

export type Candidate = {
  number: string;
  name: string;
  values: Record<string, string>;
  reason: string;
};

export const candidates: Candidate[] = [
  {
    number: "01",
    name: "RESTAURANT A",
    values: {
      focus: "落ち着きを優先",
      room: "完全個室",
      budget: "条件内",
      mood: "静かな和の空間",
      access: "那覇中心部",
      booking: "電話予約",
    },
    reason:
      "商談を落ち着いて進めたい場合に。会話を妨げにくい、静かな個室を優先しました。",
  },
  {
    number: "02",
    name: "RESTAURANT B",
    values: {
      focus: "印象を優先",
      room: "個室・眺望あり",
      budget: "条件内",
      mood: "眺望のある洋の空間",
      access: "那覇中心部",
      booking: "オンライン予約",
    },
    reason:
      "取引先に、沖縄らしい特別な印象を残したい場合に。空間そのものが会話のきっかけになります。",
  },
  {
    number: "03",
    name: "RESTAURANT C",
    values: {
      focus: "柔軟さを優先",
      room: "個室・人数調整可",
      budget: "条件内",
      mood: "沖縄の食材を活かすコース",
      access: "那覇中心部から車で少し",
      booking: "電話予約",
    },
    reason:
      "当日の人数変更が起こりうる場合に。席の融通が利きやすいことを重視しました。",
  },
];

export const exampleDisclaimer =
  "※ 提案レポートの形式を示すイメージです。実在の店舗・評価・実績を示すものではありません。";
