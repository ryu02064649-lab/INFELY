/**
 * Business facts used by the legal pages (特定商取引法に基づく表記 /
 * プライバシーポリシー) and the price notes.
 *
 * Fill in every empty string before going live. Empty values render as
 * 「【公開前に記入】」 so a missing item is obvious on the page.
 */
export const business = {
  /** 屋号 (or company name once incorporated). */
  tradeName: "RELY",
  /** 運営責任者の氏名 (or 代表者名 for a company). */
  operatorName: "宮城龍優",
  /** Contact address shown on the legal pages. */
  email: "",
  /** "individual" (個人：フリーランス・個人事業主) or "corporation" (法人). */
  entity: "individual" as "individual" | "corporation",
  /**
   * Consumption tax status. "exempt" = 免税事業者: prices are shown as the
   * total with no tax added. Switch to "taxable" once registered; prices in
   * data/pricing.ts must then be shown tax-inclusive.
   */
  taxStatus: "exempt" as "exempt" | "taxable",
  paymentMethods: ["銀行振込", "クレジットカード"],
  /** Typical first-reply time, shown in the FAQ. */
  replyTime: "24時間以内",
  /**
   * Other ways to get in touch. Leave a URL empty until the account exists;
   * the channel is still named in the FAQ, but no link is shown.
   */
  channels: {
    line: "",
    instagram: "https://www.instagram.com/rely_1001/",
  },
  /** Date the legal pages take effect, e.g. "2026年10月1日". */
  legalEffectiveDate: "",
};

export const MISSING = "【公開前に記入】";

export function filled(value: string): string {
  return value.trim() ? value : MISSING;
}
