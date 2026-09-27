import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RequestForm from "@/components/request/RequestForm";
import { steps } from "@/data/steps";

export const metadata: Metadata = {
  title: "REQUEST｜RELY",
  description:
    "RELYへのご依頼・ご相談はこちらから。何を探しているか分からない段階でも、そのままお聞かせください。",
  alternates: { canonical: "/request/" },
  openGraph: { url: "/request/" },
};

export default function RequestPage() {
  return (
    <>
      <Header variant="solid" />
      <main id="main" className="bg-ivory text-ink">
        <div className="mx-auto grid max-w-[1440px] gap-20 px-6 pb-32 pt-36 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:pb-48 lg:pt-52">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-36">
              <p className="intro label flex items-center gap-4 text-stone" style={{ "--intro-delay": "0.1s" } as React.CSSProperties}>
                <span>REQUEST</span>
                <span aria-hidden="true" className="h-px w-10 bg-current opacity-60" />
                <span>依頼する</span>
              </p>
              <h1
                className="intro display mt-8 text-[3.25rem] tracking-[0.08em] sm:text-[4.5rem] lg:text-[5.5rem]"
                style={{ "--intro-delay": "0.25s" } as React.CSSProperties}
              >
                REQUEST
              </h1>
              <p className="intro jp-heading mt-8 text-[1.25rem] sm:text-[1.5rem]" style={{ "--intro-delay": "0.5s" } as React.CSSProperties}>
                探してほしいことを、
                <br />
                そのままお聞かせください。
              </p>
              <p style={{ "--intro-delay": "0.7s" } as React.CSSProperties} className="intro mt-8 max-w-md text-[0.9375rem] leading-[2.1] tracking-[0.08em] text-stone">
                何を探しているか、まだはっきりしない。
                <br className="hidden sm:block" />
                そんな段階でも構いません。分かる範囲でご記入ください。
              </p>

              <ol className="intro-fade mt-14 hidden border-t border-ivory-line lg:block" style={{ "--intro-delay": "1s" } as React.CSSProperties}>
                {steps.map((s) => (
                  <li key={s.number} className="flex items-baseline gap-6 border-b border-ivory-line py-4">
                    <span className="display w-7 text-stone" aria-hidden="true">{s.number}</span>
                    <span className="label w-24">{s.name}</span>
                    <span className="text-[0.8125rem] tracking-[0.06em] text-stone">{s.text}</span>
                  </li>
                ))}
              </ol>
              <Link href="/#price" className="label text-link mt-10 hidden text-stone hover:text-ink lg:inline-block">
                PRICE を見る
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <RequestForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
