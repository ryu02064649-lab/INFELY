/**
 * メニューデータ。
 *
 * 現在の料理名・価格・説明は「サンプル」です（実際の販売価格ではありません）。
 * 実際のメニューに置き換えたら `menuIsSample` を `false` にしてください。
 * 「サンプル」表記が消えます。
 *
 * 写真は `public/images/menu/` にあります。差し替えるときは同じファイル名で上書きするか、
 * `image` のパスを変更してください。
 */
export const menuIsSample = true;

export const categories = [
  { id: "beef", label: "牛肉", en: "BEEF" },
  { id: "pork-chicken", label: "豚肉・鶏肉", en: "PORK & CHICKEN" },
  { id: "horumon", label: "ホルモン", en: "HORUMON" },
  { id: "platter", label: "盛り合わせ", en: "PLATTER" },
  { id: "side", label: "サイドメニュー", en: "SIDE" },
  { id: "rice-soup", label: "ご飯・スープ", en: "RICE & SOUP" },
  { id: "dessert", label: "デザート", en: "DESSERT" },
  { id: "drink", label: "ドリンク", en: "DRINK" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

export type MenuItem = {
  id: string;
  category: CategoryId;
  name: string;
  /** 税込価格（円）。未定なら null */
  price: number | null;
  /** 「1人前」「2〜3人前」など */
  unit?: string;
  description: string;
  image: string;
  /** おすすめマークを付ける */
  recommended?: boolean;
  /** トップページのMENUセクションに載せる */
  featured?: boolean;
};

export const menu: MenuItem[] = [
  {
    id: "kalbi",
    category: "beef",
    name: "美味カルビ",
    price: 1280,
    description: "甘辛ダレがからむ、王道のカルビ。ごはんが止まらない一皿。",
    image: "/images/menu/kalbi.webp",
    recommended: true,
    featured: true,
  },
  {
    id: "negitan",
    category: "beef",
    name: "ネギタン塩",
    price: 1580,
    description: "ネギをたっぷりのせて、レモンをきゅっと。さっぱり系の人気者。",
    image: "/images/menu/tan.webp",
    recommended: true,
    featured: true,
  },
  {
    id: "rosu",
    category: "beef",
    name: "上ロース",
    price: 1480,
    description: "赤身のうまみと、ほどよい脂のバランス。さっと炙って。",
    image: "/images/menu/rosu.webp",
  },
  {
    id: "harami",
    category: "beef",
    name: "ハラミ",
    price: 1380,
    description: "やわらかくて、ジューシー。タレでも塩でも。",
    image: "/images/menu/harami.webp",
    featured: true,
  },
  {
    id: "buta-kalbi",
    category: "pork-chicken",
    name: "豚カルビ",
    price: 780,
    description: "カリッと焼いた脂が香ばしい。お酒のおともに。",
    image: "/images/menu/pork.webp",
    featured: true,
  },
  {
    id: "tori",
    category: "pork-chicken",
    name: "鶏もも 塩ダレ",
    price: 680,
    description: "皮目をパリッと。塩ダレとレモンで軽やかに。",
    image: "/images/menu/chicken.webp",
  },
  {
    id: "shiro",
    category: "horumon",
    name: "白ホルモン 味噌ダレ",
    price: 680,
    description: "じっくり焼いて、ぷりっと香ばしく。味噌ダレでどうぞ。",
    image: "/images/menu/horumon.webp",
    featured: true,
  },
  {
    id: "moriawase",
    category: "platter",
    name: "美味盛り",
    price: 3980,
    unit: "2〜3人前",
    description: "いろんな部位をちょっとずつ。迷ったらまずはこれ。",
    image: "/images/menu/moriawase.webp",
    recommended: true,
    featured: true,
  },
  {
    id: "kimchi",
    category: "side",
    name: "キムチ",
    price: 480,
    description: "焼肉の合間にシャキッとひと口。",
    image: "/images/menu/kimchi.webp",
  },
  {
    id: "rice",
    category: "rice-soup",
    name: "ライス",
    price: 250,
    unit: "中",
    description: "焼肉の相棒。大盛りもどうぞ。",
    image: "/images/menu/rice.webp",
  },
  {
    id: "soup",
    category: "rice-soup",
    name: "カルビスープ",
    price: 680,
    description: "ピリ辛スープにふわふわ玉子。〆にも、合間にも。",
    image: "/images/menu/soup.webp",
  },
  {
    id: "reimen",
    category: "rice-soup",
    name: "冷麺",
    price: 880,
    description: "つるっと冷たい〆の定番。",
    image: "/images/menu/reimen.webp",
  },
  {
    id: "ice",
    category: "dessert",
    name: "バニラアイス",
    price: 380,
    description: "焼肉のあとは、ひんやり甘いので締めくくり。",
    image: "/images/menu/icecream.webp",
  },
  {
    id: "beer",
    category: "drink",
    name: "生ビール",
    price: 580,
    description: "焼肉にはやっぱりこれ。まずは乾杯！",
    image: "/images/menu/beer.webp",
    featured: true,
  },
  {
    id: "lemon-sour",
    category: "drink",
    name: "レモンサワー",
    price: 480,
    description: "脂をさっぱり流してくれる、すっきりレモン。",
    image: "/images/menu/sour.webp",
  },
];

export function formatPrice(price: number | null): string {
  return price === null ? "価格準備中" : `¥${price.toLocaleString("ja-JP")}`;
}

export function itemsByCategory(id: CategoryId): MenuItem[] {
  return menu.filter((m) => m.category === id);
}

export function findItem(id: string): MenuItem {
  const item = menu.find((m) => m.id === id);
  if (!item) throw new Error(`Unknown menu item: ${id}`);
  return item;
}
