import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Header solid />
      <main id="main" className="bg-paper grid min-h-[80svh] place-items-center px-4 pt-24 text-center">
        <div>
          <p className="font-en text-[7rem] leading-none text-red">404</p>
          <h1 className="font-display mt-4 text-[1.75rem]">おっと、焦げちゃった…</h1>
          <p className="mt-3 font-bold text-brown">お探しのページは見つかりませんでした。</p>
          <Link href="/" className="btn mt-8 bg-yellow text-ink">
            トップへ戻る
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
