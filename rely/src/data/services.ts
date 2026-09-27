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
      alt: "キャンドルとシャンデリアの灯るレストラン。白いクロスのテーブルに料理とワイングラス",
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
      alt: "石とウッドに包まれた、夜のホテルロビー。レザーのベンチと柔らかな間接照明",
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
      alt: "夕暮れのゴルフコース。芝の上に停まるカートと、染まりはじめた空",
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
      alt: "夜の車内、黒いレザーシートに置かれた深紅のバラの花束。赤いサテンのリボン",
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
      alt: "ウォールナットのデスクに置かれたリサーチ資料、万年筆、ノートPC",
    },
  },
  {
    id: "other",
    number: "06",
    name: "OTHER",
    scope: "ANYTHING",
    lead: "「こんなことも調べられる？」",
    keywords: [],
    note: "「探してほしい」という依頼そのものを、引き受けます。何を探しているかが、まだはっきりしていなくても構いません。",
    image: {
      src: "/images/other.webp",
      alt: "黒い大理石のカウンターに置かれたコンシェルジュベルと鍵",
    },
  },
];

export const serviceCategories = services.map((s) => ({
  id: s.id,
  label: s.name,
}));
