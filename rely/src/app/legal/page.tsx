import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { legalEffectiveDate, tokushoho } from "@/data/legal";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記｜RELY",
  description: "RELY の特定商取引法に基づく表記です。",
  alternates: { canonical: "/legal/" },
};

export default function TokushohoPage() {
  return (
    <LegalPage eyebrow="LEGAL" title="特定商取引法に基づく表記" updated={legalEffectiveDate}>
      <dl className="border-t border-ivory-line">
        {tokushoho.map((row) => (
          <div key={row.label} className="grid gap-3 border-b border-ivory-line py-7 sm:grid-cols-[11rem_1fr] sm:gap-8">
            <dt className="text-[0.8125rem] tracking-[0.1em] text-stone">{row.label}</dt>
            <dd className="space-y-2 text-[0.9375rem] leading-[2] tracking-[0.04em]">
              {row.body.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </LegalPage>
  );
}
