'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { COMPANY_INFO } from '@/data/company';
import { useQuoteModal } from '@/context/QuoteContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { SocialLinks } from '@/components/common/SocialLinks';
import { LanguageSelector } from '@/components/common/LanguageSelector';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathname = usePathname();
  const { openQuoteModal } = useQuoteModal();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  // Completely hide public website header on all admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.products'), path: '/products' },
    { label: t('nav.services'), path: '/services' },
    { label: t('nav.quality'), path: '/quality-certifications' },
    { label: t('nav.gallery'), path: '/gallery' },
    { label: t('nav.contact'), path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      className="sticky top-0 z-40 w-full backdrop-blur-xl border-b transition-colors"
      style={{
        backgroundColor: 'var(--bg-header)',
        borderColor: 'var(--border-card)',
      }}
    >
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between gap-4 sm:gap-6">
        {/* Zone 1: Brand Logo & Wordmark */}
        <Link
          href="/"
          className="group flex items-center gap-3 whitespace-nowrap shrink-0 text-decoration-none transition-transform duration-200 active:scale-[0.98]"
        >
          {/* Official Emblem Logo Image */}
          <div className="relative flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-white/5 p-1 border border-white/10 shadow-sm group-hover:border-[#D4AF69]/40 transition-colors">
            <img
              src="/logo.png"
              alt="IPM Exim Global Trade Logo"
              className="h-full w-full object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span
                className="font-serif text-2xl sm:text-3xl font-normal tracking-tight transition-colors group-hover:text-[#D4AF69]"
                style={{ color: 'var(--text-primary)' }}
              >
                IPM Exim
              </span>
              <span
                className="text-[9px] sm:text-[10px] uppercase tracking-[0.24em] font-sans font-bold"
                style={{ color: 'var(--gold)' }}
              >

              </span>
            </div>
            <span
              className="hidden sm:block text-[9px] uppercase tracking-widest font-sans font-medium opacity-60"
              style={{ color: 'var(--text-muted)' }}
            >
              The  International Business
            </span>
          </div>
        </Link>

        {/* Zone 2: Navigation Links with Premium Indicators */}
        <nav className="hidden lg:flex items-center gap-7 text-[13px] font-medium">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                href={link.path}
                className="relative py-2 whitespace-nowrap shrink-0 transition-colors tracking-wide"
                style={{
                  color: active ? 'var(--gold)' : 'var(--text-secondary)',
                  fontWeight: active ? 600 : 500,
                }}
              >
                <span className="hover:text-gold-champagne transition-colors">
                  {link.label}
                </span>
                {active && (
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                    style={{ backgroundColor: 'var(--gold)' }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Language Selector, Theme Toggle, Primary Action & Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          {/* Multi-Language Searchable Selector (Desktop) */}
          <LanguageSelector />

          {/* Light / Dark Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 border transition-all rounded-lg flex items-center justify-center cursor-pointer shadow-sm hover:border-[#D4AF69]/50 active:scale-95"
            style={{
              backgroundColor: 'var(--bg-card-elevated)',
              borderColor: 'var(--border-input)',
              color: 'var(--text-primary)',
            }}
            title={theme === 'dark' ? t('header.themeLight') : t('header.themeDark')}
            aria-label={theme === 'dark' ? t('header.themeLight') : t('header.themeDark')}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#D4AF69]" />
            ) : (
              <Moon className="w-4 h-4 text-[#A67C2E]" />
            )}
          </button>

          {/* Request a Quote CTA */}
          <button
            onClick={() => openQuoteModal()}
            className="btn-glass-morphism !py-2.5 !px-4 sm:!px-5 text-[11px] sm:text-xs tracking-wider"
          >
            <span className="hidden sm:inline">{t('header.quoteBtn')}</span>
            <span className="sm:hidden">{t('header.quoteShort')}</span>
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg border focus:outline-none cursor-pointer transition-colors"
            style={{
              backgroundColor: 'var(--bg-card-elevated)',
              borderColor: 'var(--border-input)',
              color: 'var(--text-primary)',
            }}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden border-b px-6 py-6 space-y-5 animate-fade-in"
          style={{
            backgroundColor: 'var(--bg-card-elevated)',
            borderColor: 'var(--border-card)',
          }}
        >
          {/* Mobile Brand Header */}
          <div className="flex items-center gap-3 pb-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <img src="/logo.png" alt="IPM Exim" className="h-8 w-auto object-contain" />
            <div>
              <span className="font-serif text-lg text-ivory">IPM Exim Global</span>
              <span className="block text-[9px] uppercase tracking-widest text-[#D4AF69]">Commercial Portal</span>
            </div>
          </div>

          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm py-2.5 px-3 rounded-lg transition-colors"
                  style={{
                    color: active ? 'var(--gold)' : 'var(--text-primary)',
                    backgroundColor: active ? 'var(--gold-muted)' : 'transparent',
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div
            className="pt-4 border-t space-y-4"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            {/* Mobile Language Selector with Real-time Search */}
            <LanguageSelector isMobile onSelect={() => setMobileMenuOpen(false)} />

            {/* Mobile Theme Toggle */}
            <div
              className="flex items-center justify-between py-2.5 px-3 rounded-lg border text-xs"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
            >
              <span style={{ color: 'var(--text-muted)' }}>{t('header.themeAppearance')}</span>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-card-elevated)',
                  borderColor: 'var(--border-input)',
                  color: 'var(--text-primary)',
                }}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-[#D4AF69]" />
                    <span>{t('header.themeLight')}</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-[#A67C2E]" />
                    <span>{t('header.themeDark')}</span>
                  </>
                )}
              </button>
            </div>

            {/* Mobile Social Channels */}
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold block mb-2" style={{ color: 'var(--gold)' }}>
                Official Trade Channels
              </span>
              <SocialLinks iconSize="md" showLabels />
            </div>

            {/* Mobile Request Quote CTA */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openQuoteModal();
              }}
              className="w-full btn-glass-morphism py-3 text-xs"
            >
              {t('header.quoteBtn')}
            </button>
            <div
              className="text-[11px] text-center space-y-1 pt-2"
              style={{ color: 'var(--text-dim)' }}
            >
              <p>Email: {COMPANY_INFO.email}</p>
              <p>{t('header.ports')}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
