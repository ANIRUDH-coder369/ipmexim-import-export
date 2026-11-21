import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SupportedLocale = 'en' | 'hi' | 'ar' | 'es' | 'fr' | 'ru' | 'zh' | 'de';

export interface LanguageState {
  locale: SupportedLocale;
  direction: 'ltr' | 'rtl';
}

const initialState: LanguageState = {
  locale: 'en',
  direction: 'ltr',
};

export const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<SupportedLocale>) => {
      state.locale = action.payload;
      state.direction = action.payload === 'ar' ? 'rtl' : 'ltr';
      if (typeof window !== 'undefined') {
        localStorage.setItem('ipm_locale', action.payload);
        document.documentElement.setAttribute('dir', state.direction);
        document.documentElement.setAttribute('lang', action.payload);
      }
    },
  },
});

export const { setLocale } = languageSlice.actions;
export default languageSlice.reducer;
