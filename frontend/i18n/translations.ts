import { en } from './locales/en';
import { hi } from './locales/hi';
import { mr } from './locales/mr';
import { zh } from './locales/zh';
import { ja } from './locales/ja';
import { ar } from './locales/ar';
import { ne } from './locales/ne';
import { te } from './locales/te';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { de } from './locales/de';
import { ru } from './locales/ru';

export type SupportedLanguage = 
  | 'en' 
  | 'hi' 
  | 'mr' 
  | 'zh' 
  | 'ja' 
  | 'ar' 
  | 'ne' 
  | 'te'
  | 'es'
  | 'fr'
  | 'de'
  | 'ru';

export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', dir: 'ltr' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', flag: '🇳🇵', dir: 'ltr' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', dir: 'ltr' },
];

export const translations: Record<string, Record<string, any>> = {
  en,
  hi,
  mr,
  zh,
  ja,
  ar,
  ne,
  te,
  es,
  fr,
  de,
  ru,
};
