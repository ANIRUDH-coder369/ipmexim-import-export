'use client';

import React, { useState } from 'react';
import { X, ZoomIn, Sparkles } from 'lucide-react';
import { GALLERY_ITEMS } from '@/data/company';
import { GalleryItem } from '@/types';
import { useQuoteModal } from '@/context/QuoteContext';
import { useLanguage } from '@/context/LanguageContext';

export default function GalleryPage() {
  const { openQuoteModal } = useQuoteModal();
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'All' | 'Products' | 'Quality' | 'Packaging' | 'Logistics'>('All');
  const [activeModalItem, setActiveModalItem] = useState<GalleryItem | null>(null);

  const filteredItems = activeFilter === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeFilter);

  const getFilterLabel = (filter: 'All' | 'Products' | 'Quality' | 'Packaging' | 'Logistics') => {
    switch (filter) {
      case 'All': return t('gallery.filterAll');
      case 'Products': return t('gallery.filterProducts');
      case 'Quality': return t('gallery.filterQuality');
      case 'Packaging': return t('gallery.filterPackaging');
      case 'Logistics': return t('gallery.filterLogistics');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16 space-y-12">
      {/* Header */}
      <div className="space-y-4 border-b pb-8" style={{ borderColor: 'var(--border-subtle)' }}>
        <span className="badge-pill">{t('gallery.kicker')}</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal" style={{ color: 'var(--text-primary)' }}>
          {t('gallery.title')}
        </h1>
        <p className="text-sm sm:text-base max-w-3xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {t('gallery.desc')}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {(['All', 'Products', 'Quality', 'Packaging', 'Logistics'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider whitespace-nowrap rounded-lg border transition-all cursor-pointer ${
              activeFilter === cat
                ? 'bg-[#D4AF69] text-[#090A0C] border-[#D4AF69] shadow-md'
                : 'border-transparent hover:border-gold-border/40'
            }`}
            style={activeFilter !== cat ? { backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)', borderColor: 'var(--border-card)' } : {}}
          >
            {getFilterLabel(cat)}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveModalItem(item)}
            className="card-luxury cursor-pointer overflow-hidden flex flex-col justify-between group"
          >
            <div className="relative aspect-[16/10] bg-black/10 overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span 
                  className="p-3 rounded-full border shadow-lg"
                  style={{
                    backgroundColor: 'rgba(9, 10, 12, 0.85)',
                    borderColor: 'var(--gold-border)',
                    color: 'var(--gold)',
                  }}
                >
                  <ZoomIn className="w-5 h-5" />
                </span>
              </div>
              <div 
                className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] tracking-wider uppercase font-semibold backdrop-blur-md border"
                style={{
                  backgroundColor: 'rgba(9, 10, 12, 0.85)',
                  borderColor: 'var(--gold-border)',
                  color: 'var(--gold)',
                }}
              >
                {item.category}
              </div>
            </div>

            <div className="p-5 space-y-2">
              <h3 className="font-serif text-lg font-medium transition-colors group-hover:text-gold-champagne" style={{ color: 'var(--text-primary)' }}>
                {item.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {item.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeModalItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          style={{ backgroundColor: 'var(--modal-overlay)', backdropFilter: 'blur(10px)' }}
          onClick={() => setActiveModalItem(null)}
        >
          <div
            className="relative max-w-4xl w-full rounded-2xl border p-6 sm:p-8 space-y-4 shadow-2xl"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-card)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModalItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full border transition-colors hover:border-gold-border cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-topbar)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-muted)',
              }}
              aria-label={t('gallery.closeViewer')}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[16/10] rounded-xl overflow-hidden bg-black/20 flex items-center justify-center">
              <img
                src={activeModalItem.imageUrl}
                alt={activeModalItem.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-1">
              <span className="badge-pill mb-1">
                {activeModalItem.category}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-medium" style={{ color: 'var(--text-primary)' }}>
                {activeModalItem.title}
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {activeModalItem.caption}
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  const title = activeModalItem.title;
                  setActiveModalItem(null);
                  openQuoteModal({ name: `Inquiry regarding visual record: ${title}` });
                }}
                className="btn-gold cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#090A0C]" />
                <span>{t('gallery.inquireCategory')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
