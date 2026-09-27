import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Header variant="solid" />
      <main id="main" className="flex min-h-[100svh] items-center bg-ink text-ivory">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-40 text-center sm:px-8 lg:px-12">
          <p className="label text-mist">404</p>
          <h1 className="display mt-8 text-[2.5rem] tracking-[0.1em] sm:text-[4rem]">NOT FOUND</h1>
          <p className="mt-8 text-[0.9375rem] tracking-[0.08em] text-ivory/75">お探しのページは見つかりませんでした。</p>
          <div className="mt-14">
            <Link href="/" className="btn btn-light">
              BACK TO TOP
              <span className="arrow" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
