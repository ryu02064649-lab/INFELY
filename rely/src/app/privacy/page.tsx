import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { legalEffectiveDate, privacyPolicy } from "@/data/legal";

export const metadata: Metadata = {
  title: "プライバシーポリシー｜RELY",
  description: "RELY における個人情報の取り扱いについて。",
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="PRIVACY POLICY"
      title="プライバシーポリシー"
      lead="お預かりする情報を、どのように扱うかをまとめています。"
      updated={legalEffectiveDate}
    >
      <div className="border-t border-ivory-line">
        {privacyPolicy.map((section, i) => (
          <section key={section.title} className="border-b border-ivory-line py-10" aria-labelledby={`privacy-${i}`}>
            <h2 id={`privacy-${i}`} className="flex items-baseline gap-5 text-[1.0625rem] tracking-[0.08em]">
              <span className="display text-[0.9375rem] text-stone" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              {section.title}
            </h2>
            <div className="mt-5 space-y-3 text-[0.9375rem] leading-[2.05] tracking-[0.04em]">
              {section.body.map((line) => (
                <p key={line}>{line}</p>
              ))}
              {section.list ? (
                <ul className="space-y-2 pl-1">
                  {section.list.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[0.95em] size-[3px] shrink-0 bg-ink/45" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </section>
        ))}
      </div>
    </LegalPage>
  );
}
