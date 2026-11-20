import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { QuoteModal } from "@/components/common/QuoteModal";
import { GoogleTranslateEngine } from "@/components/common/GoogleTranslateEngine";
import { QuoteProvider } from "@/context/QuoteContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "IPM Exim — Luxury Global Export-Import & Sourcing",
  description: "Connecting Global Markets. Delivering Quality from India. Verified B2B export commodities, high-aroma spices, Basmati rice, luxury textiles, copperware, and agricultural staples.",
  icons: {
    icon: "/logo.png",
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
