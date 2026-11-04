import type { Metadata, Viewport } from "next";
import {
  Bodoni_Moda,
  Jost,
  Shippori_Mincho,
  Zen_Kaku_Gothic_New,
} from "next/font/google";
import { site } from "@/config/site";
import RevealObserver from "@/components/ui/RevealObserver";
import "./globals.css";

// Didot is used first where installed (macOS / iOS); Bodoni Moda is the web fallback.
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-jost",
  display: "swap",
});

const mincho = Shippori_Mincho({
  weight: ["400", "500"],
  variable: "--font-mincho-jp",
  display: "swap",
  preload: false,
});

const gothic = Zen_Kaku_Gothic_New({
  weight: ["300", "400"],
  variable: "--font-gothic-jp",
  display: "swap",
  preload: false,
});

/**
 * Runs before first paint.
 * - Marks JS as available.
 * - Turns off the browser's own scroll memory on every load, so that by the
 *   time someone reloads, Safari already knows not to restore the old spot
 *   (setting it during the reload itself is too late on iOS).
 * - On a reload: drops any #section and keeps the page at the very top.
 * - When Safari shows the home page from its back/forward memory without
 *   loading it, reloads it so the opening plays and it starts at the top.
 * - Plays the opening on every visit to the home page when motion is allowed.
 */
const OPENING_SCRIPT = `(function(){var d=document.documentElement;d.classList.add('js');var home=function(){var p=location.pathname;return p==='/'||p==='/index.html';};try{if('scrollRestoration' in history){history.scrollRestoration='manual';}var n=performance.getEntriesByType('navigation')[0];if(n&&n.type==='reload'){if(location.hash){history.replaceState(history.state,'',location.pathname+location.search);}var top=function(){window.scrollTo(0,0);};top();addEventListener('DOMContentLoaded',top);addEventListener('load',function(){top();setTimeout(top,0);setTimeout(top,150);});}addEventListener('pageshow',function(e){if(e.persisted&&home()){location.reload();}});}catch(e){}try{if(home()&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('with-opening');}}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: site.locale,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0b",
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${bodoni.variable} ${jost.variable} ${mincho.variable} ${gothic.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Enables reveal styles only when JS runs, so content never stays hidden. */}
        <script
          dangerouslySetInnerHTML={{
            __html: OPENING_SCRIPT,
          }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="label sr-only bg-ivory px-4 py-3 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
        >
          本文へスキップ
        </a>
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
