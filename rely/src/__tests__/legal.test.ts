import { describe, expect, it } from "vitest";
import { MISSING, filled } from "@/config/business";
import { privacyPolicy, tokushoho } from "@/data/legal";
import { pricingNotes } from "@/data/pricing";

describe("特定商取引法に基づく表記", () => {
  it("covers the items a mail-order service must show", () => {
    const labels = tokushoho.map((r) => r.label);
    for (const required of [
      "販売事業者",
      "所在地",
      "電話番号",
      "メールアドレス",
      "販売価格",
      "料金以外に必要な費用",
      "お支払い方法",
      "お支払い時期",
      "サービスの提供時期",
      "キャンセル・返金",
    ]) {
      expect(labels).toContain(required);
    }
  });

  it("never promises that a reservation will succeed", () => {
    expect(JSON.stringify(tokushoho)).not.toContain("必ず予約");
  });
});

describe("プライバシーポリシー", () => {
  it("explains purpose, third-party provision and how to make requests", () => {
    const titles = privacyPolicy.map((s) => s.title);
    expect(titles).toEqual(expect.arrayContaining(["利用目的", "第三者への提供", "開示・訂正・利用停止などのご請求", "お問い合わせ窓口"]));
  });
});

describe("price notes", () => {
  it("state how tax is handled", () => {
    expect(pricingNotes.some((n) => n.includes("総額") || n.includes("税込"))).toBe(true);
  });
});

describe("filled()", () => {
  it("marks empty business facts so they are visible before launch", () => {
    expect(filled("")).toBe(MISSING);
    expect(filled("RELY")).toBe("RELY");
  });
});
