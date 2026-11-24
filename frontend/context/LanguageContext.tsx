'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, translations } from '@/i18n/translations';
import { WORLD_LANGUAGES, WorldLanguage, getLanguageByCode } from '@/i18n/worldLanguages';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (path: string, params?: Record<string, string>) => string;
  tArray: (path: string) => string[];
  locale: Record<string, any>;
  dir: 'ltr' | 'rtl';
  languages: WorldLanguage[];
  currentLanguageInfo: WorldLanguage;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper to map code for Google Translate
const toGoogleTranslateCode = (code: string): string => {
  const map: Record<string, string> = {
    zh: 'zh-CN',
    'zh-TW': 'zh-TW',
    he: 'iw',
    fil: 'tl',
    jv: 'jw',
  };
  return map[code] || code;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>('en');
  const [mounted, setMounted] = useState(false);

  const clearGoogleTransCookies = () => {
    if (typeof window === 'undefined') return;
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    const domains = ['', hostname, `.${hostname}`];
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
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('translated-ltr', 'translated-rtl');
    }
  };

  useEffect(() => {
    try {
      // Default to English ('en') on first load
      let activeLang = 'en';
      const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const urlLang = urlParams?.get('lang');
      const savedLang = localStorage.getItem('ipm_lang');

      if (urlLang) {
        activeLang = urlLang;
      } else if (savedLang) {
        activeLang = savedLang;
      } else {
        // Explicitly set default English in storage
        localStorage.setItem('ipm_lang', 'en');
      }

      setLanguageState(activeLang);
      applyLanguageToDom(activeLang);

      if (activeLang === 'en') {
        clearGoogleTransCookies();
      } else {
        setGoogleTransCookie(activeLang);
      }
    } catch {
      applyLanguageToDom('en');
      clearGoogleTransCookies();
    }
    setMounted(true);
  }, []);

  const applyLanguageToDom = (langCode: string) => {
    const langInfo = getLanguageByCode(langCode);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = langInfo.code;
      document.documentElement.dir = langInfo.dir;
      if (langInfo.dir === 'rtl') {
        document.documentElement.classList.add('rtl');
      } else {
        document.documentElement.classList.remove('rtl');
      }
    }
  };

  const setGoogleTransCookie = (langCode: string) => {
    if (typeof window === 'undefined') return;
    const hostname = window.location.hostname;
    const isLocal = !hostname || hostname === 'localhost' || hostname === '127.0.0.1';

    clearGoogleTransCookies();

    if (langCode !== 'en') {
      const gtCode = toGoogleTranslateCode(langCode);
      document.cookie = `googtrans=/en/${gtCode}; path=/;`;
      document.cookie = `googtrans=/auto/${gtCode}; path=/;`;
      if (!isLocal && hostname.includes('.')) {
        document.cookie = `googtrans=/en/${gtCode}; domain=.${hostname}; path=/;`;
        document.cookie = `googtrans=/auto/${gtCode}; domain=.${hostname}; path=/;`;
      }
    }
  };

  const triggerGoogleTranslate = (langCode: string) => {
    if (typeof window === 'undefined') return;

    if (langCode === 'en') {
      clearGoogleTransCookies();
      const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (combo) {
        combo.value = '';
        combo.dispatchEvent(new Event('change', { bubbles: true }));
      }
      return;
    }

    // 1. Persist Google Translate cookies
    setGoogleTransCookie(langCode);

    const gtCode = toGoogleTranslateCode(langCode);
    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;

    if (combo) {
      let matched = false;
      for (let i = 0; i < combo.options.length; i++) {
        const optVal = combo.options[i].value;
        if (
          optVal.toLowerCase() === gtCode.toLowerCase() ||
          optVal.toLowerCase() === langCode.toLowerCase()
        ) {
          combo.selectedIndex = i;
          combo.value = optVal;
          combo.dispatchEvent(new Event('change', { bubbles: true }));
          matched = true;
          break;
        }
      }
      if (!matched) {
        combo.value = gtCode;
        combo.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    // Languages that have instant zero-latency React client dictionary
    const builtInLangs = ['en', 'hi', 'mr', 'zh', 'ja', 'ar', 'ne', 'te', 'es', 'fr', 'de', 'ru'];

    // If the language is NOT one of our built-in instant dictionary languages,
    // or if the Google Translate combo element is not yet in the DOM,
    // perform a quick reload so Google Translate automatically translates the entire page via the cookie.
    if (!builtInLangs.includes(langCode) || !combo) {
      setTimeout(() => {
        window.location.reload();
      }, 120);
    }
  };

  const setLanguage = (langCode: string) => {
    const prevLang = language;
    setLanguageState(langCode);
    try {
      localStorage.setItem('ipm_lang', langCode);
    } catch {
      // Ignore local storage error
    }
    applyLanguageToDom(langCode);
    if (langCode === 'en') {
      clearGoogleTransCookies();
      const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (combo) {
        combo.value = '';
        combo.dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (prevLang !== 'en') {
        window.location.reload();
      }
    } else {
      triggerGoogleTranslate(langCode);
    }
  };

  const t = (path: string, params?: Record<string, string>): string => {
    const keys = path.split('.');
    let current: any = (translations as any)[language];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to English
        let fallback: any = translations['en'];
        for (const fbKey of keys) {
          if (fallback && typeof fallback === 'object' && fbKey in fallback) {
            fallback = fallback[fbKey];
          } else {
            return path;
          }
        }
        current = fallback;
        break;
      }
    }

    if (typeof current !== 'string') {
      return path;
    }

    let result = current;
    if (params) {
      for (const [key, val] of Object.entries(params)) {
        result = result.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), val);
      }
    }

    return result;
  };

  const tArray = (path: string): string[] => {
    const keys = path.split('.');
    let current: any = (translations as any)[language];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        let fallback: any = translations['en'];
        for (const fbKey of keys) {
          if (fallback && typeof fallback === 'object' && fbKey in fallback) {
            fallback = fallback[fbKey];
          } else {
            return [];
          }
        }
        current = fallback;
        break;
      }
    }

    if (Array.isArray(current)) {
      return current;
    }
    return [];
  };

  const currentLanguageInfo = getLanguageByCode(language);
  const dir = currentLanguageInfo.dir;
  const locale = (translations as any)[language] || translations['en'];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        tArray,
        locale,
        dir,
        languages: WORLD_LANGUAGES,
        currentLanguageInfo,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
