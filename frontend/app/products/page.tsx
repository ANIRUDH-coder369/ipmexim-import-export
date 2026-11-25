'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, AlertCircle, Sparkles, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { PRODUCTS, PRODUCT_CATEGORIES } from '@/data/products';
import { filterProducts } from '@/utils/catalogFilter';
import { useQuoteModal } from '@/context/QuoteContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchProductsThunk } from '@/store/slices/productSlice';
import { getApiUrl } from '@/utils/apiConfig';

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { openQuoteModal } = useQuoteModal();
  const { t, locale } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'name-asc' | 'name-desc'>('featured');
  const [categories, setCategories] = useState<{ id: string; name: string; description?: string }[]>(PRODUCT_CATEGORIES);

  const reduxProducts = useAppSelector((state) => state.product.products);

  useEffect(() => {
    dispatch(fetchProductsThunk());

    const loadCategories = async () => {
      try {
        const apiUrl = getApiUrl();
        const res = await fetch(`${apiUrl}/categories`);
        if (res.ok) {
          const data = await res.json();
          if (data.categories && Array.isArray(data.categories) && data.categories.length > 0) {
            setCategories(
              data.categories.map((c: any) => ({
                id: c.categoryId || c.id,
                name: c.name,
                description: c.description || ''
              }))
            );
            return;
          }
        }
      } catch (e) {}

      try {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('ipm_admin_categories') : null;
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCategories(
              parsed.map((c: any) => ({
                id: c.categoryId || c.id,
                name: c.name,
                description: c.description || ''
              }))
            );
          }
        }
      } catch (e) {}
    };

    loadCategories();
  }, [dispatch]);

  const resolveProductImage = (url?: string) => {
    if (!url) return '/images/product_spices_export_1793609366204.jpg';
    if (url.startsWith('/uploads/')) {
      const apiUrl = getApiUrl();
      const origin = apiUrl.replace(/\/api\/?$/, '');
      return `${origin}${url}`;
    }
    return url;
  };

  const allProducts = reduxProducts && reduxProducts.length > 0 ? reduxProducts : PRODUCTS;

  const filteredProducts = useMemo(() => {
    return filterProducts(allProducts as any, {
      categoryId: selectedCategory,
      searchQuery,
      sortBy,
    });
  }, [allProducts, selectedCategory, searchQuery, sortBy]);

  const handleReset = () => {
    setSearchQuery('');
    setSortBy('featured');
    setSelectedCategory('all');
  };

  const getCategoryName = (id: string, defaultName: string) => {
    return locale.products?.categories?.[id] || defaultName;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16 space-y-12">
      {/* Page Title & Intro */}
      <div className="space-y-4 border-b pb-8" style={{ borderColor: 'var(--border-subtle)' }}>
        <span className="badge-pill">{t('products.kicker')}</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal" style={{ color: 'var(--text-primary)' }}>
          {t('products.title')}
        </h1>
        <p className="text-sm sm:text-base max-w-3xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {t('products.desc')}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider whitespace-nowrap rounded-lg border transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#D4AF69] text-[#090A0C] border-[#D4AF69] shadow-md'
                : 'border-transparent hover:border-gold-border/40'
            }`}
            style={selectedCategory !== 'all' ? { backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)', borderColor: 'var(--border-card)' } : {}}
          >
            {t('products.allCategories')} ({allProducts.length})
          </button>
          {categories.map((cat) => {
            const count = allProducts.filter((p: any) => p.categoryId === cat.id || p.categoryName === cat.name).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider whitespace-nowrap rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#D4AF69] text-[#090A0C] border-[#D4AF69] shadow-md'
                    : 'border-transparent hover:border-gold-border/40'
                }`}
                style={!isSelected ? { backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)', borderColor: 'var(--border-card)' } : {}}
              >
                {getCategoryName(cat.id, cat.name)} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>

        {/* Search Input & Sort Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-dim)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('products.searchPlaceholder')}
              className="input-luxury pl-10 pr-10 text-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold hover:underline"
                style={{ color: 'var(--gold)' }}
              >
                {t('products.clear')}
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>{t('products.sortBy')}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="input-luxury py-2 px-3 text-xs w-auto"
            >
              <option value="featured">{t('products.sortFeatured')}</option>
              <option value="name-asc">{t('products.sortNameAsc')}</option>
              <option value="name-desc">{t('products.sortNameDesc')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count and Active Summary */}
      <div className="flex items-center justify-between text-xs border-b pb-4" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
        <span>
          Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredProducts.length}</strong> export commodities
          {selectedCategory !== 'all' && (
            <span> in <strong style={{ color: 'var(--gold)' }}>{getCategoryName(selectedCategory, categories.find(c => c.id === selectedCategory)?.name || '')}</strong></span>
          )}
          {searchQuery && (
            <span> matching &ldquo;<strong style={{ color: 'var(--text-primary)' }}>{searchQuery}</strong>&rdquo;</span>
          )}
        </span>
        {(selectedCategory !== 'all' || searchQuery) && (
          <button
            onClick={handleReset}
            className="font-semibold hover:underline cursor-pointer"
            style={{ color: 'var(--gold)' }}
          >
            {t('products.resetFilters')}
          </button>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product._id || product.id}
              className="card-luxury flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Product Photo */}
                <div className="relative aspect-[4/3] bg-black/10 overflow-hidden">
                  <img
                    src={resolveProductImage(product.imageUrls?.[0])}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] tracking-wider uppercase font-semibold backdrop-blur-md border"
                    style={{
                      backgroundColor: 'rgba(9, 10, 12, 0.85)',
                      color: 'var(--gold)',
                      borderColor: 'var(--gold-border)',
                    }}
                  >
                    {product.status}
                  </div>
                  {product.featured && (
                    <div 
                      className="absolute top-3 right-3 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-black shadow-md"
                      style={{ backgroundColor: 'var(--gold)' }}
                    >
                      Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--gold)' }}>
                    {getCategoryName(product.categoryId, product.categoryName)}
                  </span>
                  <h3 className="font-serif text-xl font-medium leading-snug line-clamp-2 transition-colors group-hover:text-gold-champagne"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <Link href={`/products/${product.slug}`}>
                      {product.name}
                    </Link>
                  </h3>
                  <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {product.shortDescription}
                  </p>

                  <div className="pt-3 border-t space-y-1.5 text-xs" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <div className="flex justify-between">
                      <span>{t('products.originLabel')}</span>
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{product.origin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('products.hsCodeLabel')}</span>
                      <span className="font-mono font-semibold" style={{ color: 'var(--gold)' }}>{product.hsCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('products.moqLabel')}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{product.minimumOrderQuantity}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-6 pt-0 flex items-center gap-3">
                <Link
                  href={`/products/${product.slug}`}
                  className="flex-1 py-2.5 px-3 text-center text-xs rounded-lg border font-medium transition-colors"
                  style={{
                    borderColor: 'var(--border-card)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {t('products.viewDetails')}
                </Link>
                <button
                  onClick={() => openQuoteModal({ id: product.id, name: product.name })}
                  className="py-2.5 px-4 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer"
                  style={{
                    backgroundColor: 'var(--gold-muted)',
                    borderColor: 'var(--gold-border)',
                    color: 'var(--gold)',
                  }}
                  title="Request quotation for this product"
                >
                  {t('products.requestQuote')}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border space-y-4 max-w-lg mx-auto"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
        >
          <AlertCircle className="w-8 h-8 mx-auto" style={{ color: 'var(--gold)' }} />
          <h3 className="font-serif text-xl" style={{ color: 'var(--text-primary)' }}>{t('products.noResults')}</h3>
          <button
            onClick={handleReset}
            className="btn-gold"
          >
            {t('products.resetFilters')}
          </button>
        </div>
      )}

      {/* Sourcing Assistance Note */}
      <div 
        className="card-luxury p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      >
        <div className="space-y-1">
          <h4 className="font-serif text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
            {t('services.retainerTitle')}
          </h4>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {t('services.retainerDesc')}
          </p>
        </div>
        <button
          onClick={() => openQuoteModal()}
          className="btn-gold whitespace-nowrap cursor-pointer"
        >
          {t('services.retainerBtn')}
        </button>
      </div>
    </div>
  );
}
