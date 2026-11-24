'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';
import { useLanguage } from '@/context/LanguageContext';

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

export const GoogleTranslateEngine: React.FC = () => {
  const { language } = useLanguage();

  useEffect(() => {
    // If language is English, proactively purge any Google Translate cookies, classes, and elements
    if (language === 'en') {
      const clearCookies = () => {
        if (typeof window === 'undefined') return;
        const host = window.location.hostname;
        const parts = host.split('.');
        const domains = ['', host, `.${host}`];
        if (parts.length > 2) {
          const parent = parts.slice(1).join('.');
          domains.push(parent, `.${parent}`);
        }
        const paths = ['/', '', window.location.pathname];
        domains.forEach((d) => {
          paths.forEach((p) => {
            document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; ${d ? `domain=${d};` : ''} path=${p};`;
          });
        });
      };
      clearCookies();

      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('translated-ltr', 'translated-rtl');
        const iframes = document.querySelectorAll(
          'iframe.skiptranslate, iframe.goog-te-banner-frame, iframe[class*="skiptranslate"], .goog-te-banner-frame'
        );
        iframes.forEach((el) => {
          (el as HTMLElement).style.setProperty('display', 'none', 'important');
        });
        document.body.style.setProperty('top', '0px', 'important');
        document.body.style.setProperty('position', 'static', 'important');
      }
      return;
    }

    // 1. Define the global callback for Google Translate
    window.googleTranslateElementInit = () => {
      try {
        if (window.google && window.google.translate && window.google.translate.TranslateElement) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              autoDisplay: false,
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            },
            'google_translate_element'
          );
        }
      } catch (err) {
        // Silently handle init error
      }
    };

    // 2. Continuous banner suppressor using MutationObserver
    const suppressGoogleBanner = () => {
      const iframes = document.querySelectorAll(
        'iframe.skiptranslate, iframe.goog-te-banner-frame, iframe[class*="skiptranslate"], .goog-te-banner-frame'
      );
      iframes.forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.setProperty('display', 'none', 'important');
        htmlEl.style.setProperty('visibility', 'hidden', 'important');
        htmlEl.style.setProperty('height', '0px', 'important');
        htmlEl.style.setProperty('max-height', '0px', 'important');
        htmlEl.style.setProperty('opacity', '0', 'important');
        htmlEl.style.setProperty('pointer-events', 'none', 'important');
      });

      if (document.body.style.top && document.body.style.top !== '0px') {
        document.body.style.setProperty('top', '0px', 'important');
      }
      if (document.body.style.position && document.body.style.position !== 'static') {
        document.body.style.setProperty('position', 'static', 'important');
      }
    };

    suppressGoogleBanner();

    const observer = new MutationObserver(() => {
      suppressGoogleBanner();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    });

    return () => {
      observer.disconnect();
    };
  }, [language]);

  // If language is English, do NOT load Google Translate script or DOM element!
  // This completely stops Google Translate from mutating English into Italian or any other language!
  if (language === 'en') {
    return null;
  }

  return (
    <>
      {/* High-priority inline style to completely wipe Google banner iframe from layout */}
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

      {/* Target element for Google Translate positioned safely offscreen */}
      <div
        id="google_translate_element"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Official Google Translate Engine script */}
      <Script
        id="google-translate-script"
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  );
};
