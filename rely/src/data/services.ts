/**
 * Service catalogue. Order here is the display order.
 * Images live in /public/images — replace the files (keeping the names)
 * or change `image.src` to swap photography.
 */
export type ServiceId =
  | "dining"
  | "stay"
  | "experience"
  | "gift"
  | "research"
  | "other";

export type Service = {
  id: ServiceId;
  number: string;
  name: string;
  /** Small label showing where / for whom the service applies. */
  scope: string;
  lead: string;
  keywords: string[];
  /** Optional highlighted list, e.g. what RELY checks. */
  checkpoints?: { label: string; items: string[] };
  note?: string;
  image?: { src: string; alt: string };
};

export const services: Service[] = [
  {
    id: "dining",
    number: "01",
    name: "DINING",
    scope: "OKINAWA",
    lead: "沖縄のレストラン・飲食店をリサーチ。",
    keywords: [
      "会食",
      "接待",
      "記念日",
      "デート",
      "家族との食事",
      "個室",
      "高級店",
      "隠れた名店",
    ],
    checkpoints: {
      label: "調査項目",
      items: ["料理", "価格", "個室", "雰囲気", "場所", "口コミ", "予約情報"],
    },
    image: {
      src: "/images/dining.webp",
      alt: "間接照明が滲む、夜のダイニングの静かなテーブル",
    },
  },
  {
    id: "stay",
    number: "02",
    name: "STAY",
    scope: "OKINAWA",
    lead: "沖縄のホテル・宿泊施設をリサーチ。",
    keywords: [
      "高級ホテル",
      "リゾート",
      "ヴィラ",
      "記念日",
      "家族旅行",
      "出張",
      "長期滞在",
    ],
    note: "目的や予算、希望条件から候補を選定します。",
    image: {
      src: "/images/stay.webp",
      alt: "客室の窓越しに広がる、夜の街の灯り",
    },
  },
  {
    id: "experience",
    number: "03",
    name: "EXPERIENCE",
    scope: "OKINAWA",
    lead: "沖縄でできる体験をリサーチ。",
    keywords: [
      "ゴルフ",
      "クルーズ",
      "マリンアクティビティ",
      "ダイビング",
      "スパ",
      "サウナ",
      "観光",
      "デート",
      "家族向け体験",
      "記念日",
    ],
    note: "「何をするか」からではなく、「どんな時間を過ごしたいか」を基準に提案します。",
    image: {
      src: "/images/experience.webp",
      alt: "月明かりが細く伸びる、夜の静かな海",
    },
  },
  {
    id: "gift",
    number: "04",
    name: "GIFT",
    scope: "NATIONWIDE",
    lead: "贈り物をリサーチ。全国対応。",
    keywords: [
      "誕生日",
      "記念日",
      "結婚祝い",
      "取引先へのギフト",
      "手土産",
      "特別なプレゼント",
    ],
    note: "相手の年齢、関係性、趣味、予算などから調査します。",
    image: {
      src: "/images/gift.webp",
      alt: "柔らかな光の中に置かれた、上質なギフトボックス",
    },
  },
  {
    id: "research",
    number: "05",
    name: "RESEARCH",
    scope: "FOR BUSINESS",
    lead: "企業・店舗・事業者のためのリサーチ。",
    keywords: [
      "市場調査",
      "競合調査",
      "商品調査",
      "店舗調査",
      "SNS調査",
      "新規事業調査",
    ],
    image: {
      src: "/images/research.webp",
      alt: "デスクの上に置かれた調査資料とペン",
    },
  },
  {
    id: "other",
    number: "—",
    name: "OTHER",
    scope: "ANYTHING",
    lead: "「こんなことも調べられる？」",
    keywords: [],
    note: "「探してほしい」という依頼そのものを、引き受けます。何を探しているかが、まだはっきりしていなくても構いません。",
  },
];

export const serviceCategories = services.map((s) => ({
  id: s.id,
  label: s.name,
}));
