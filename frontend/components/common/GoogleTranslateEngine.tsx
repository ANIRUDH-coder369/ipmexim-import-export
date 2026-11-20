'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

export const GoogleTranslateEngine: React.FC = () => {
  useEffect(() => {
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
      // Find any iframe added by Google Translate
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

      // Prevent body pushdown
      if (document.body.style.top && document.body.style.top !== '0px') {
        document.body.style.setProperty('top', '0px', 'important');
      }
      if (document.body.style.position && document.body.style.position !== 'static') {
        document.body.style.setProperty('position', 'static', 'important');
      }
    };

    // Run immediately
    suppressGoogleBanner();

    // Observe any DOM mutations to kill the banner as soon as Google injects it
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
  }, []);

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
