import type { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/** Quiet, readable frame shared by the legal pages. */
export default function LegalPage({
  eyebrow,
  title,
  lead,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <Header variant="solid" />
      <main id="main" className="bg-ivory text-ink">
        <div className="mx-auto max-w-[1440px] px-6 pb-32 pt-36 sm:px-8 lg:px-12 lg:pb-48 lg:pt-48">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
            <header className="lg:col-span-4">
              <div className="lg:sticky lg:top-36">
                <p className="label text-stone">{eyebrow}</p>
                <h1 className="jp-heading mt-6 text-[1.625rem] leading-[1.7] sm:text-[2rem]">{title}</h1>
                {lead ? (
                  <p className="mt-6 max-w-sm text-[0.875rem] leading-[2.1] tracking-[0.06em] text-stone">{lead}</p>
                ) : null}
                <p className="label mt-10 text-stone">制定日　{updated}</p>
              </div>
            </header>
            <div className="lg:col-span-7 lg:col-start-6">{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
