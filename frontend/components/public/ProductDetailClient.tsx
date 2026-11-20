'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, ShieldCheck, Box, Globe } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { Product } from '@/types';
import { useQuoteModal } from '@/context/QuoteContext';
import { useLanguage } from '@/context/LanguageContext';

export function ProductDetailClient({ product }: { product: Product }) {
  const { openQuoteModal } = useQuoteModal();
  const { t, locale } = useLanguage();

  const relatedProducts = PRODUCTS.filter(
    (p) => p.categoryId === product.categoryId && p.id !== product.id
  ).slice(0, 3);

  const getCategoryName = (id: string, defaultName: string) => {
    return locale.products?.categories?.[id] || defaultName;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16 space-y-12">
      {/* Breadcrumbs & Back Link */}
      <div className="flex items-center gap-3 text-xs text-[#8E8A82]">
        <Link href="/products" className="hover:text-[#D4AF69] flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('productDetail.catalogueBreadcrumb')}</span>
        </Link>
        <span>/</span>
        <span className="text-[#B5B0A6]">{getCategoryName(product.categoryId, product.categoryName)}</span>
        <span>/</span>
        <span className="text-[#D4AF69] truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Hero Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Product Photography */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/3] bg-[#121212] border border-[#2E281F] overflow-hidden">
            <img
              src={product.imageUrls[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-[#0B0B0B]/90 backdrop-blur-sm px-3 py-1.5 text-xs tracking-wider uppercase text-[#D4AF69] border border-[#D4AF69]/30">
              {product.status}
            </div>
          </div>
          <div className="p-4 bg-[#121212] border border-[#221D15] text-xs text-[#8E8A82] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D4AF69] shrink-0" />
            <span>{t('productDetail.photoNote')}</span>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase / Quotation Module */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2 border-b border-[#221D15] pb-6">
            <span className="text-xs uppercase tracking-widest text-[#D4AF69]">
              {getCategoryName(product.categoryId, product.categoryName)}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#F5F1E8] leading-tight">
              {product.name}
            </h1>
            <p className="text-sm sm:text-base text-[#B5B0A6] leading-relaxed pt-1">
              {product.shortDescription}
            </p>
          </div>

          {/* Quick Trade Specs Grid */}
          <div className="grid grid-cols-2 gap-4 p-5 bg-[#141414] border border-[#241E15] text-xs">
            <div>
              <span className="block text-[#8E8A82]">{t('productDetail.countryOrigin')}</span>
              <strong className="text-[#F5F1E8] text-sm">{product.origin}</strong>
            </div>
            <div>
              <span className="block text-[#8E8A82]">{t('productDetail.hsClassification')}</span>
              <strong className="font-mono text-[#D4AF69] text-sm">{product.hsCode}</strong>
            </div>
            <div>
              <span className="block text-[#8E8A82]">{t('productDetail.moq')}</span>
              <span className="text-[#F5F1E8] font-medium">{product.minimumOrderQuantity}</span>
            </div>
            <div>
              <span className="block text-[#8E8A82]">{t('productDetail.availability')}</span>
              <span className="text-[#D4AF69] font-medium">{product.status}</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={() => openQuoteModal({ id: product.id, name: product.name })}
              className="flex-1 py-3.5 px-6 bg-[#D4AF69] hover:bg-[#B89146] text-[#0B0B0B] font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span>{t('productDetail.requestQuotation')}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
            <Link
              href="/contact"
              className="py-3.5 px-6 border border-[#2E281F] hover:border-[#D4AF69] text-[#F5F1E8] hover:text-[#D4AF69] text-xs font-medium uppercase tracking-wider text-center transition-colors"
            >
              {t('productDetail.askQuestion')}
            </Link>
          </div>

          {/* Dispatch Notice */}
          <div className="p-4 bg-[#101010] border border-[#221D15] space-y-2 text-xs text-[#8E8A82]">
            <div className="flex items-center gap-2 text-[#F5F1E8]">
              <Globe className="w-4 h-4 text-[#D4AF69]" />
              <span className="font-medium">{t('home.maritimeTitle')}</span>
            </div>
            <p>{t('home.maritimeDesc')}</p>
          </div>
        </div>
      </div>

      {/* Comprehensive Technical Specification Section */}
      <div className="border-t border-[#221D15] pt-12 space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#D4AF69]">{t('productDetail.specificationsTitle')}</span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#F5F1E8]">
            {t('productDetail.tabSpecs')}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Full Narrative Description */}
          <div className="lg:col-span-6 space-y-4 text-sm text-[#B5B0A6] leading-relaxed">
            <h3 className="font-serif text-lg text-[#F5F1E8]">{t('home.step1Title')}</h3>
            <p>{product.fullDescription}</p>
            <p>
              {t('home.processNote')}
            </p>
          </div>

          {/* Right: Technical Table */}
          <div className="lg:col-span-6 bg-[#131313] border border-[#241E15] p-6 space-y-4">
            <h3 className="font-serif text-lg text-[#F5F1E8]">{t('productDetail.tabSpecs')}</h3>
            <div className="space-y-2 text-xs divide-y divide-[#1F1A13]">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="pt-2 flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-[#8E8A82] sm:w-1/2">{key}:</span>
                  <span className="text-[#F5F1E8] font-medium sm:w-1/2 text-left sm:text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Packaging Options */}
      <div className="border-t border-[#221D15] pt-12 space-y-6">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-widest text-[#D4AF69]">{t('productDetail.tabPackaging')}</span>
          <h2 className="font-serif text-2xl text-[#F5F1E8]">{t('productDetail.tabPackaging')}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {product.packagingOptions.map((opt, idx) => (
            <div key={idx} className="p-5 bg-[#141414] border border-[#241E15] space-y-2">
              <Box className="w-5 h-5 text-[#D4AF69]" />
              <h4 className="font-serif text-base text-[#F5F1E8]">Format 0{idx + 1}</h4>
              <p className="text-xs text-[#9C978D] leading-relaxed">{opt}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-[#221D15] pt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl text-[#F5F1E8]">{t('productDetail.relatedTitle')}</h3>
            <Link href="/products" className="text-xs text-[#D4AF69] hover:underline uppercase tracking-wider">
              {t('home.viewFullCatalogue')}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <div key={rel.id} className="p-4 bg-[#141414] border border-[#241E15] space-y-3">
                <div className="aspect-[4/3] bg-[#0E0E0E] overflow-hidden">
                  <img src={rel.imageUrls[0]} alt={rel.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-serif text-base text-[#F5F1E8] line-clamp-1">
                  <Link href={`/products/${rel.slug}`} className="hover:text-[#D4AF69]">
                    {rel.name}
                  </Link>
                </h4>
                <p className="text-xs text-[#8E8A82] line-clamp-1">{rel.shortDescription}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
