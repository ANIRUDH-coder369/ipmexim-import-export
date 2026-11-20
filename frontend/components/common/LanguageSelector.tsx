'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Globe2, ChevronDown, Check, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { WORLD_LANGUAGES, WorldLanguage } from '@/i18n/worldLanguages';

interface LanguageSelectorProps {
  isMobile?: boolean;
  onSelect?: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ isMobile = false, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { language, setLanguage, currentLanguageInfo, t } = useLanguage();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Filter languages in real-time
  const filteredLanguages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return WORLD_LANGUAGES;

    return WORLD_LANGUAGES.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const popularLanguages = useMemo(() => {
    return WORLD_LANGUAGES.filter((l) => l.popular);
  }, []);

  const handleSelect = (lang: WorldLanguage) => {
    setLanguage(lang.code);
    setIsOpen(false);
    if (onSelect) onSelect();
  };

  // If mobile inline drawer view
  if (isMobile) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider font-semibold block" style={{ color: 'var(--gold)' }}>
            {t('header.selectLanguage')} (130+ World Languages)
          </span>
          <span className="text-[10px] text-[#A39E94]">
            Active: <strong className="text-[#D4AF69]">{currentLanguageInfo.flag} {currentLanguageInfo.nativeName}</strong>
          </span>
        </div>

        {/* Search input in mobile */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7A756D]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search language (e.g. French, Spanish, मराठी, বাংলা)..."
            className="w-full bg-[#161616] border border-[#2E281F] text-[#F5F1E8] pl-9 pr-8 py-2 text-xs placeholder:text-[#6E6A62] focus:outline-none focus:border-[#D4AF69]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8E8A82] hover:text-[#F5F1E8]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Language Grid / List in mobile */}
        <div className="max-h-60 overflow-y-auto space-y-1 language-dropdown-scroll border border-[#262016] p-2 bg-[#121212]">
          {filteredLanguages.length > 0 ? (
            filteredLanguages.map((l) => {
              const isCurrent = l.code.toLowerCase() === language.toLowerCase();
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => handleSelect(l)}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors border ${
                    isCurrent
                      ? 'bg-[#D4AF69]/15 border-[#D4AF69] text-[#D4AF69]'
                      : 'border-transparent text-[#C8C3B8] hover:bg-[#1A1A1A] hover:text-[#F5F1E8]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{l.flag}</span>
                    <span className="font-medium">{l.nativeName}</span>
                    <span className="text-[10px] text-[#8E8A82]">({l.name})</span>
                  </div>
                  {isCurrent && <Check className="w-3.5 h-3.5 text-[#D4AF69]" />}
                </button>
              );
            })
          ) : (
            <div className="py-4 text-center text-xs text-[#8E8A82]">
              No language found matching &ldquo;{searchQuery}&rdquo;
            </div>
          )}
        </div>
      </div>
    );
  }

  // Desktop Popover Dropdown
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-2 sm:py-2.5 border text-xs transition-colors rounded-none cursor-pointer shadow-sm"
        style={{
          backgroundColor: 'var(--bg-card-elevated)',
          borderColor: 'var(--border-input)',
          color: 'var(--text-primary)',
        }}
        title={t('header.selectLanguage')}
        aria-label={t('header.selectLanguage')}
        aria-expanded={isOpen}
      >
        <Globe2 className="w-3.5 h-3.5 text-[#D4AF69]" />
        <span className="text-sm">{currentLanguageInfo.flag}</span>
        <span className="font-medium hidden sm:inline">{currentLanguageInfo.nativeName}</span>
        <span className="font-semibold sm:hidden uppercase">{currentLanguageInfo.code}</span>
        <ChevronDown
          className={`w-3 h-3 text-[#A39E94] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Popover */}
      {isOpen && (
        <div
          className="absolute right-0 mt-1.5 w-80 sm:w-88 border shadow-2xl z-50 transition-colors animate-fade-in flex flex-col"
          style={{
            backgroundColor: 'var(--bg-card-elevated)',
            borderColor: 'var(--border-card)',
          }}
        >
          {/* Header & Search Bar */}
          <div className="p-3 border-b space-y-2.5" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--gold)' }}>
                {t('header.selectLanguage')} &bull; 130+ World Languages
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#8E8A82] hover:text-[#F5F1E8] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Search Input Box */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7A756D]" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search language (French, Spanish, मराठी, বাংলা)..."
                className="w-full bg-[#141414] border border-[#2E281F] text-[#F5F1E8] pl-8 pr-7 py-1.5 text-xs placeholder:text-[#6E6A62] focus:outline-none focus:border-[#D4AF69]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#8E8A82] hover:text-[#F5F1E8]"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Select Popular Languages Pills (when not searching) */}
          {!searchQuery && (
            <div className="p-2.5 border-b bg-[#121212]/50" style={{ borderColor: 'var(--border-subtle)' }}>
              <span className="text-[9px] uppercase tracking-wider text-[#8E8A82] font-semibold block mb-1.5">
                Popular Global Trade Languages:
              </span>
              <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto language-dropdown-scroll">
                {popularLanguages.map((pl) => {
                  const isCurrent = pl.code.toLowerCase() === language.toLowerCase();
                  return (
                    <button
                      key={pl.code}
                      type="button"
                      onClick={() => handleSelect(pl)}
                      className={`px-2 py-1 text-[11px] border transition-colors flex items-center gap-1 cursor-pointer ${
                        isCurrent
                          ? 'bg-[#D4AF69] text-[#0B0B0B] border-[#D4AF69] font-semibold'
                          : 'bg-[#181818] border-[#2E281F] text-[#C8C3B8] hover:border-[#D4AF69]/50 hover:text-[#F5F1E8]'
                      }`}
                    >
                      <span>{pl.flag}</span>
                      <span>{pl.nativeName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Scrollable Language List */}
          <div className="max-h-64 sm:max-h-72 overflow-y-auto language-dropdown-scroll py-1">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((l) => {
                const isCurrent = l.code.toLowerCase() === language.toLowerCase();
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => handleSelect(l)}
                    className="w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-[#D4AF69]/10 transition-colors cursor-pointer"
                    style={{
                      color: isCurrent ? 'var(--gold)' : 'var(--text-primary)',
                      fontWeight: isCurrent ? 600 : 400,
                      backgroundColor: isCurrent ? 'rgba(212, 175, 105, 0.08)' : 'transparent',
                    }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base shrink-0">{l.flag}</span>
                      <div className="truncate">
                        <span className="font-medium mr-1.5">{l.nativeName}</span>
                        <span className="text-[10px] text-[#8E8A82]">({l.name})</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="font-mono text-[9px] uppercase px-1 py-0.5 border border-[#2E281F] text-[#8E8A82]">
                        {l.code}
                      </span>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-[#D4AF69]" />}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-6 text-center text-xs text-[#8E8A82] space-y-1">
                <p>No languages matched &ldquo;{searchQuery}&rdquo;</p>
                <p className="text-[10px] text-[#6E6A62]">Try searching by country name or native script</p>
              </div>
            )}
          </div>

          {/* Footer Status */}
          <div
            className="p-2 border-t text-[10px] text-center text-[#8E8A82] flex items-center justify-between"
            style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-topbar)' }}
          >
            <span>Showing {filteredLanguages.length} of {WORLD_LANGUAGES.length} languages</span>
            <span className="text-[#D4AF69] font-medium">Automatic Global Translation</span>
          </div>
        </div>
      )}
    </div>
  );
};
