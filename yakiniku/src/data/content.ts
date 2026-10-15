/**
 * セクションごとの文言・写真。店舗の特徴が決まったらここを書き換えてください。
 * ※ 仕入れ先・産地・品質などの具体的なこだわりは、事実確認ができてから追記してください。
 */

export const about = {
  heading: ["うまい肉を、", "もっと楽しく。"],
  lead: "かしこまらずに、腹いっぱい。網の上でじゅわっと焼ける音と、テーブルいっぱいの笑い声。そんな“いつもの焼肉”を、いちばんおいしく楽しめるお店をめざしています。",
  image: { src: "/images/about.webp", alt: "網の上で焼かれるカルビやハラミのイメージ" },
  points: [
    {
      no: "01",
      title: "気軽にふらっと",
      text: "仕事帰りにも、休日にも。かしこまらずに楽しめる大衆焼肉です。",
    },
    {
      no: "02",
      title: "肉が、うまい。",
      text: "一枚一枚をおいしく食べてほしいから。肉のうまさにまっすぐ向き合います。",
    },
    {
      no: "03",
      title: "みんなでワイワイ",
      text: "友達、家族、仲間と。網を囲めば、自然と会話がはずみます。",
    },
  ],
};

/** RECOMMEND: menu id + big visual + copy. */
export const recommends = [
  {
    menuId: "kalbi",
    image: { src: "/images/kalbi-grill.webp", alt: "タレをまとって焼けるカルビのイメージ" },
    catch: "白ごはん、準備OK？",
    text: "甘辛いタレをまとったカルビを、さっと焼いてごはんにワンバウンド。最初の一枚はこれで決まり。",
  },
  {
    menuId: "negitan",
    image: { src: "/images/menu/tan.webp", alt: "ネギをのせたタン塩とレモンのイメージ" },
    catch: "ネギ、どっさり。",
    text: "ネギをのせたら片面だけ焼いて、レモンをきゅっと。さっぱりなのに、うまみはしっかり。",
  },
  {
    menuId: "moriawase",
    image: { src: "/images/platter.webp", alt: "カルビ・ロース・タン・ハラミ・豚カルビの盛り合わせのイメージ" },
    catch: "迷ったら、盛り合わせ。",
    text: "いろんな部位をちょっとずつ。みんなでシェアするなら、まずはこの一皿から。",
  },
];

export const price = {
  heading: "ご予算の目安",
  notes: [
    "ご予算は、ご注文内容やお飲み物の量によって変わります。",
    "上記はお食事とドリンクを楽しんだ場合のおおよその目安です。",
  ],
};

export type GalleryItem = {
  src: string;
  alt: string;
  caption: string;
  /** grid shape */
  shape: "wide" | "tall" | "square" | "big";
};

/**
 * Order matters: on PC (4 columns) the shapes interlock as
 * big · tall · square · square / wide · tall · square · wide · square.
 * On phones (2 columns) tall / square tiles pair up side by side.
 */
export const gallery: GalleryItem[] = [
  { src: "/images/hero.webp", alt: "網の上に並ぶカルビとタンのイメージ", caption: "じゅわっと焼けたら食べごろ", shape: "big" },
  { src: "/images/horumon-grill.webp", alt: "網の上で焼かれるホルモンのイメージ", caption: "ぷりっとホルモン", shape: "tall" },
  { src: "/images/drinks.webp", alt: "生ビールとレモンサワーのイメージ", caption: "まずは乾杯！", shape: "square" },
  { src: "/images/menu/kimchi.webp", alt: "キムチのイメージ", caption: "箸休めのキムチ", shape: "square" },
  { src: "/images/platter.webp", alt: "肉の盛り合わせのイメージ", caption: "盛り合わせでシェア", shape: "wide" },
  { src: "/images/lantern.webp", alt: "赤ちょうちんが灯る店内の雰囲気のイメージ", caption: "活気ある店内", shape: "tall" },
  { src: "/images/kalbi-grill.webp", alt: "焼き色のついたカルビのイメージ", caption: "焼きたてカルビ", shape: "square" },
  { src: "/images/table.webp", alt: "焼き網とご飯・キムチ・ビールが並ぶテーブルのイメージ", caption: "テーブルいっぱいに", shape: "wide" },
  { src: "/images/menu/reimen.webp", alt: "冷麺のイメージ", caption: "〆は冷麺で", shape: "square" },
];

export type SceneIcon = "friends" | "afterwork" | "family" | "date" | "birthday" | "party";

/**
 * 利用シーン。実際に対応できるシーン・設備（個室、貸切、ケーキ持ち込み等）は
 * 店舗で確認のうえ、文言を調整してください。
 */
export const scenes: { icon: SceneIcon; title: string; text: string }[] = [
  { icon: "friends", title: "友達とワイワイ", text: "焼いて、食べて、しゃべって。気づけばあっという間。" },
  { icon: "afterwork", title: "仕事帰りの一杯", text: "今日もおつかれさま。ビールと焼肉でリセット。" },
  { icon: "family", title: "家族でごはん", text: "みんなの好きな肉を頼んで、わいわい囲もう。" },
  { icon: "date", title: "デートにも", text: "気取らないから、自然体で楽しめる。" },
  { icon: "birthday", title: "誕生日・お祝い", text: "特別な日も、うまい肉でかんぱい。" },
  { icon: "party", title: "仲間と飲み会", text: "大人数でも、焼肉なら盛り上がり間違いなし。" },
];

export const marquee = ["うまい肉、食べようぜ。", "YAKINIKU", "焼いて、食べて、笑おう。", "TAISHU YAKINIKU", "腹いっぱい、幸せいっぱい。"];
