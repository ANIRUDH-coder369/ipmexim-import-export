import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import quoteReducer from './slices/quoteSlice';
import themeReducer from './slices/themeSlice';
import languageReducer from './slices/languageSlice';
import adminReducer from './slices/adminSlice';

export const store = configureStore({
  reducer: {
    quote: quoteReducer,
    theme: themeReducer,
    language: languageReducer,
    admin: adminReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
