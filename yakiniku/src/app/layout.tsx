import type { Metadata, Viewport } from "next";
import { Anton, Dela_Gothic_One, Zen_Kaku_Gothic_New } from "next/font/google";
import { site } from "@/config/site";
import RevealObserver from "@/components/ui/RevealObserver";
import "./globals.css";

const dela = Dela_Gothic_One({
  weight: "400",
  variable: "--font-dela",
  display: "swap",
  preload: false,
});

const zen = Zen_Kaku_Gothic_New({
  weight: ["500", "700", "900"],
  variable: "--font-zen",
  display: "swap",
  preload: false,
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s｜${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: ["焼肉", "大衆焼肉", site.name, "カルビ", "ホルモン", "飲み会", "宴会"],
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
  themeColor: "#d7261e",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${dela.variable} ${zen.variable} ${anton.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Enables reveal styles only when JS runs, so content never stays hidden. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only rounded-full bg-yellow px-5 py-3 font-bold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
        >
          本文へスキップ
        </a>
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
