import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { QuoteModal } from "@/components/common/QuoteModal";
import { GoogleTranslateEngine } from "@/components/common/GoogleTranslateEngine";
import { QuoteProvider } from "@/context/QuoteContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { OrganizationJsonLd, WebSiteJsonLd, FaqJsonLd } from "@/components/seo/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ipmexim-import-export-frontend.vercel.app';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF8F5' },
    { media: '(prefers-color-scheme: dark)', color: '#090A0C' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "IPM Exim — Luxury Global Export-Import & Sourcing",
    template: "%s | IPM Exim Global Trade",
  },
  description: "India's premier international export house & B2B trade gateway. Direct sourcing of 1121 Basmati Rice, Alleppey Green Cardamom, Salem Turmeric, Guntur Red Chilli, Pure Mulberry Silk, and Artisanal Copperware with verified SGS, APEDA, and ISO quality certification.",
  keywords: [
    "IPM Exim",
    "Indian Basmati rice exporter",
    "1121 steam basmati rice supplier",
    "Alleppey green cardamom wholesale",
    "Salem turmeric fingers bulk supplier",
    "Guntur Teja red chilli export",
    "pure mulberry silk stoles India",
    "hand hammered copper drinkware manufacturer",
    "APEDA registered merchant exporter",
    "FIEO certified trade house India",
    "FCL container CIF pricing India",
    "B2B Indian spices export",
    "agricultural commodities exporter Mumbai",
    "Indian textiles supplier wholesale"
  ],
  authors: [{ name: 'IPM Exim Global Trade House', url: SITE_URL }],
  creator: 'IPM Exim',
  publisher: 'IPM Exim',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: "IPM Exim — Luxury Global Export-Import & Sourcing",
    description: "Connecting Global Markets. Delivering Quality from India. Verified B2B export commodities, high-aroma spices, Basmati rice, luxury textiles, and copperware.",
    url: SITE_URL,
    siteName: "IPM Exim Global Trade House",
    images: [
      {
        url: "/images/hero_global_trade_1793609365586.jpg",
        width: 1200,
        height: 630,
        alt: "IPM Exim Maritime Cargo & Global Trade Operations",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IPM Exim — Luxury Global Export-Import & Sourcing",
    description: "Connecting Global Markets. Delivering Quality from India. Verified B2B export commodities, high-aroma spices, Basmati rice, and luxury textiles.",
    images: ["/images/hero_global_trade_1793609365586.jpg"],
    creator: "@ipmexim",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
      'ar-AE': '/?lang=ar',
      'es-ES': '/?lang=es',
      'fr-FR': '/?lang=fr',
      'de-DE': '/?lang=de',
      'zh-CN': '/?lang=zh',
      'ja-JP': '/?lang=ja',
      'ru-RU': '/?lang=ru',
    },
  },
  category: "International Trade & Commercial Export Sourcing",
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              iframe.skiptranslate,
              iframe[class*="skiptranslate"],
              iframe.goog-te-banner-frame,
              .goog-te-banner-frame,
              .goog-te-banner-frame.skiptranslate,
              #goog-gt-tt,
              #goog-gt-vt,
              .VIpgJd-ZVi9od-aZ2wEe-wOHMyf,
              .VIpgJd-ZVi9od-aZ2wEe-OiiCO,
              .VIpgJd-ZVi9od-vH1Gmf {
                display: none !important;
                visibility: hidden !important;
                height: 0px !important;
                width: 0px !important;
                max-height: 0px !important;
                border: none !important;
                opacity: 0 !important;
                pointer-events: none !important;
              }
              body, html body {
                top: 0px !important;
                position: static !important;
                margin-top: 0px !important;
              }
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('theme');
                  var t = (savedTheme === 'light') ? 'light' : 'dark';
                  document.documentElement.classList.remove('dark', 'light');
                  document.documentElement.classList.add(t);
                  document.documentElement.setAttribute('data-theme', t);

                  var savedLang = localStorage.getItem('ipm_lang');
                  if (savedLang) {
                    document.documentElement.lang = savedLang;
                    var rtlLangs = ['ar', 'he', 'fa', 'ur', 'ps', 'sd', 'ug', 'yi', 'ckb', 'dv'];
                    var isRtl = rtlLangs.indexOf(savedLang) !== -1;
                    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
                    if (isRtl) {
                      document.documentElement.classList.add('rtl');
                    } else {
                      document.documentElement.classList.remove('rtl');
                    }
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();

              window.googleTranslateElementInit = function() {
                try {
                  if (window.google && window.google.translate && window.google.translate.TranslateElement) {
                    new window.google.translate.TranslateElement({
                      pageLanguage: 'en',
                      autoDisplay: false
                    }, 'google_translate_element');
                  }
                } catch (e) {}
              };
            `,
          }}
        />
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <FaqJsonLd />
      </head>
      <body className="min-h-screen flex flex-col antialiased transition-colors" suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            <QuoteProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <QuoteModal />
              <GoogleTranslateEngine />
            </QuoteProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
