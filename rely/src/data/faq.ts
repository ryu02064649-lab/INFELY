/**
 * FAQ content. Every answer restates something already decided elsewhere
 * (pricing, legal pages, business config) — no new promises here.
 */
import { business } from "@/config/business";

export type Faq = {
  q: string;
  a: string[];
  link?: { label: string; href: string };
  /** Show LINE / Instagram links under the answer once their URLs are set. */
  showChannels?: boolean;
};

export const faqs: Faq[] = [
  {
    q: "どんなことを頼めますか？",
    a: [
      "沖縄のレストラン・ホテル・体験のリサーチと、全国対応のギフト選びを承ります。",
      "「こんなことも調べられる？」というご相談も歓迎します。",
    ],
  },
  {
    q: "何を探しているか、まだ決まっていなくても相談できますか？",
    a: ["はい。「記念日をどう過ごすか迷っている」といった段階からでも構いません。お話を伺いながら、一緒に条件を整理します。"],
  },
  {
    q: "対応エリアはどこですか？",
    a: [
      "DINING・STAY・EXPERIENCE は沖縄が対象です。GIFT は全国に対応しています。",
    ],
  },
  {
    q: "相談の方法と、返信までの時間を教えてください。",
    a: [
      "ご依頼フォーム、メール、LINE、Instagram からご相談いただけます。",
      `いただいたご相談には、${business.replyTime}を目安にご返信します。`,
    ],
    showChannels: true,
  },
  {
    q: "料金はいつ、どのように支払いますか？",
    a: [
      "内容を伺ったうえでお見積もりをお送りし、ご同意いただいた後に前払いでお支払いいただきます。",
      `お支払い方法は${business.paymentMethods.join("・")}です。`,
    ],
  },
  {
    q: "予約まで代わりにしてもらえますか？",
    a: [
      "RESERVATION / ARRANGEMENT SUPPORT（¥2,000〜）として、予約・手配を代行します。",
      "空き状況などにより承れない場合があり、予約の成立を保証するものではありません。飲食・宿泊・体験などの代金は別途、各予約先へのお支払いとなります。",
    ],
  },
  {
    q: "調査結果は、どのような形で届きますか？",
    a: ["候補ごとの比較と、「なぜその候補なのか」という理由をまとめてお届けします。最終的に選ぶのは、お客様ご自身です。"],
  },
  {
    q: "キャンセルはできますか？",
    a: [
      "調査の開始前であれば、お支払い済みの料金を全額返金いたします（銀行振込で返金する場合の振込手数料はお客様のご負担）。調査の開始後は、ご返金いたしかねます。",
      "お届けした候補がお好みに合わなかった場合は、納品から3日以内のご連絡で、候補の再提案を1回承ります。",
    ],
    link: { label: "特定商取引法に基づく表記", href: "/legal/" },
  },
  {
    q: "RELY CONCIERGE（月額）は、いつでも解約できますか？",
    a: ["次回お支払い日の前日までにご連絡いただければ、翌月分から停止します。月の途中での解約による日割りの返金はありません。"],
  },
  {
    q: "相談した内容は、秘密にしてもらえますか？",
    a: [
      "ご依頼の内容は、ご依頼への対応と、予約・手配に必要な範囲でのみ使用します。それ以外の目的で第三者に伝えることはありません。",
    ],
    link: { label: "プライバシーポリシー", href: "/privacy/" },
  },
];
