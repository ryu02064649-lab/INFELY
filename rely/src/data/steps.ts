export type Step = {
  number: string;
  name: string;
  text: string;
};

export const steps: Step[] = [
  { number: "01", name: "REQUEST", text: "依頼する。" },
  { number: "02", name: "RESEARCH", text: "RELYが調査する。" },
  { number: "03", name: "CURATION", text: "条件に合う候補を厳選する。" },
  { number: "04", name: "DELIVERY", text: "比較・理由とともに結果を提案。" },
];
