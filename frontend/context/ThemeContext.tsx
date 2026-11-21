'use client';

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleTheme as toggleThemeAction, setTheme as setThemeAction, ThemeMode } from '@/store/slices/themeSlice';

export type Theme = ThemeMode;

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);

  const applyThemeToDOM = (t: Theme) => {
    const root = document.documentElement;
    const body = document.body;
    root.classList.remove('dark', 'light');
    root.classList.add(t);
    root.setAttribute('data-theme', t);
    if (body) {
      body.classList.remove('dark', 'light');
      body.classList.add(t);
      body.setAttribute('data-theme', t);
    }
  };

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        dispatch(setThemeAction(savedTheme));
        applyThemeToDOM(savedTheme);
      } else {
        dispatch(setThemeAction('dark'));
        applyThemeToDOM('dark');
      }
    } catch {
      dispatch(setThemeAction('dark'));
      applyThemeToDOM('dark');
    }
  }, [dispatch]);

  const setTheme = (newTheme: Theme) => {
    dispatch(setThemeAction(newTheme));
    try {
      localStorage.setItem('theme', newTheme);
    } catch {}
    applyThemeToDOM(newTheme);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
