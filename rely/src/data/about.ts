/**
 * ABOUT copy — written from the operator's own words (2026-09-28).
 * Keep it to facts they gave: strengths in research and surprises, enjoying
 * the work, customer satisfaction first, starting from their home, Okinawa.
 */
import { business } from "@/config/business";

export const about = {
  lead: "探すことが、好きだから。",
  paragraphs: [
    ["探す。調べる。比べる。整理する。", "多くの方にとっては手間のかかることが、私にとっては、心から楽しい時間です。"],
    [
      "大切な人を驚かせる場所を見つけること。",
      "条件に合うひとつを、根気よく探し出すこと。",
      "その「見つける力」で、時間のない方や、探すことが苦手な方の力になりたい。",
      "そう思い、RELYを始めました。",
    ],
    ["どんなに小さなご依頼でも、目指すのはひとつ。", "あなたが心から満足できる選択です。"],
    ["まずは、生まれ育った沖縄から。"],
  ],
  closing: "選ぶまでの手間を、RELYが。",
  signature: {
    role: business.entity === "corporation" ? "代表" : "運営責任者",
    name: business.operatorName,
  },
};
