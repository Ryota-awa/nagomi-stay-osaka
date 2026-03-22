import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { LanguageProvider } from "@/lib/language-context";
import { PROPERTY, SEO } from "@/lib/constants";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://nagomi-stay-osaka.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${PROPERTY.name} | Vacation Rental near Namba Osaka`,
    template: `%s | ${PROPERTY.name}`,
  },
  description: `${PROPERTY.description} ${PROPERTY.descriptionEn}`,
  keywords: SEO.keywords,
  authors: [{ name: PROPERTY.name }],
  verification: {
    google: "tJnEjTh_qd0DeJciVZ35D8fW7p9FLFLn2fYCx63qHUk",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    alternateLocale: ["en_US", "en_GB", "zh_CN", "ko_KR"],
    url: siteUrl,
    siteName: SEO.siteName,
    title: `${PROPERTY.name} | Entire Home near Namba Osaka`,
    description: PROPERTY.descriptionEn,
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${PROPERTY.name} — Entire vacation rental near Namba, Osaka`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${PROPERTY.name} | Entire Home near Namba Osaka`,
    description: PROPERTY.descriptionEn,
    images: ["/images/og-image.jpg"],
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "ja-JP": siteUrl,
      "en-US": siteUrl,
      "x-default": siteUrl,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={notoSansJP.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0TD0WRJS7S"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0TD0WRJS7S');
          `}
        </Script>
        <LanguageProvider>
          <JsonLd />
          <Header />
          <main>{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
