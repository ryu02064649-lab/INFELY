import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "THANK YOU｜RELY",
  robots: { index: false, follow: false },
};

export default function ThanksPage() {
  return (
    <>
      <Header variant="solid" />
      <main id="main" className="flex min-h-[100svh] items-center bg-ivory text-ink">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-40 text-center sm:px-8 lg:px-12">
          <p className="label intro text-stone">REQUEST RECEIVED</p>
          <h1 className="display intro mt-8 text-[3rem] tracking-[0.1em] sm:text-[4.5rem]" style={{ "--intro-delay": "0.3s" } as React.CSSProperties}>
            THANK YOU
          </h1>
          <p className="jp-heading intro mt-10 text-[1.25rem] sm:text-[1.5rem]" style={{ "--intro-delay": "0.7s" } as React.CSSProperties}>
            ご相談を受け付けました。
          </p>
          <p className="intro mx-auto mt-6 max-w-lg text-[0.9375rem] leading-[2.1] tracking-[0.08em] text-stone" style={{ "--intro-delay": "1s" } as React.CSSProperties}>
            内容を確認のうえ、
            <br className="sm:hidden" />
            ご入力いただいたメールアドレスへお見積もりをお送りします。
          </p>
          <div className="intro mt-14" style={{ "--intro-delay": "1.3s" } as React.CSSProperties}>
            <Link href="/" className="btn btn-dark">
              BACK TO {site.name}
              <span className="arrow" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
