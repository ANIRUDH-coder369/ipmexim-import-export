'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck, 
  Anchor, 
  ChevronDown, 
  Ship,
  Search,
  Layers,
  FileSpreadsheet,
  Box,
  BadgeCheck,
  FileCheck2,
  Sparkles,
  CheckCircle2,
  Globe2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { COMPANY_INFO, SERVICES, FAQS } from '@/data/company';
import { useQuoteModal } from '@/context/QuoteContext';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
  const { openQuoteModal } = useQuoteModal();
  const { t, locale } = useLanguage();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const featuredProducts = PRODUCTS.slice(0, 4);

  const getServiceIcon = (index: number) => {
    switch (index) {
      case 0: return <Ship className="w-5 h-5" style={{ color: 'var(--gold)' }} />;
      case 1: return <Search className="w-5 h-5" style={{ color: 'var(--gold)' }} />;
      case 2: return <Layers className="w-5 h-5" style={{ color: 'var(--gold)' }} />;
      case 3: return <Layers className="w-5 h-5" style={{ color: 'var(--gold)' }} />;
      case 4: return <FileSpreadsheet className="w-5 h-5" style={{ color: 'var(--gold)' }} />;
      case 5: return <Box className="w-5 h-5" style={{ color: 'var(--gold)' }} />;
      case 6: return <BadgeCheck className="w-5 h-5" style={{ color: 'var(--gold)' }} />;
      case 7: return <FileCheck2 className="w-5 h-5" style={{ color: 'var(--gold)' }} />;
      default: return <ShieldCheck className="w-5 h-5" style={{ color: 'var(--gold)' }} />;
    }
  };

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* ========================================================
          1. CINEMATIC HERO SECTION WITH PROMINENT LOGO ENTRY
          ======================================================== */}
      <section className="relative min-h-[88vh] lg:min-h-[92vh] flex items-center overflow-hidden border-b transition-colors"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        {/* Background Image with Layered Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero_global_trade_1793609365586.jpg"
            alt="International maritime freight cargo vessel sailing at twilight"
            className="w-full h-full object-cover object-center scale-105 transform animate-fade-in"
          />
          <div className="absolute inset-0 hero-scrim-left transition-all duration-300" />
          <div className="absolute inset-0 hero-scrim-bottom transition-all duration-300" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-24 lg:py-32 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            
            {/* Left Column: Brand Statement & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Prestigious Entry Badge with Official Logo */}
              <div 
                className="inline-flex items-center gap-3 px-3.5 py-2 rounded-full border transition-all duration-300 shadow-lg hover:border-[#D4AF69]/60 backdrop-blur-md"
                style={{
                  backgroundColor: 'rgba(19, 20, 26, 0.85)',
                  borderColor: 'var(--gold-border)',
                }}
              >
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/10 p-0.5 border border-white/20 shrink-0 shadow-inner">
                  <img
                    src="/logo.png"
                    alt="IPM Exim Official Emblem"
                    className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(212,175,105,0.4)]"
                  />
                </div>
                <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase pr-2">
                  <span style={{ color: 'var(--gold)' }}>IPM EXIM</span>
                  <span className="opacity-30 text-white">&bull;</span>
                  <span className="text-[#E0DDD5] hidden sm:inline">{t('hero.kicker')}</span>
                </div>
              </div>

              {/* Headline */}
              <h1 
                className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight leading-[1.15] text-balance"
                style={{ color: 'var(--text-primary)' }}
              >
                {t('hero.title')}
              </h1>

              {/* Exact Full Description from Company Profile */}
              <p 
                className="text-sm sm:text-base lg:text-lg leading-relaxed font-light max-w-2xl"
                style={{ color: 'var(--text-secondary)' }}
              >
                {t('hero.desc')}
              </p>

              {/* Action CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <button
                  onClick={() => openQuoteModal()}
                  className="btn-glass-morphism shadow-xl cursor-pointer min-h-[44px]"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>{t('hero.ctaQuote')}</span>
                </button>
                <Link
                  href="/products"
                  className="btn-outline-gold text-center min-h-[44px]"
                >
                  <span>{t('hero.ctaExplore')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Quick Sourcing Credentials Strip */}
              <div 
                className="pt-8 border-t grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs transition-colors"
                style={{ 
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-muted)'
                }}
              >
                <div>
                  <span className="block font-serif text-xl font-medium" style={{ color: 'var(--gold)' }}>
                    {t('hero.credDirect')}
                  </span>
                  <span className="text-[11px] mt-0.5 block">{t('hero.credDirectSub')}</span>
                </div>
                <div>
                  <span className="block font-serif text-xl font-medium" style={{ color: 'var(--gold)' }}>
                    {t('hero.credFcl')}
                  </span>
                  <span className="text-[11px] mt-0.5 block">{t('hero.credFclSub')}</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="block font-serif text-xl font-medium" style={{ color: 'var(--gold)' }}>
                    {t('hero.credSpecs')}
                  </span>
                  <span className="text-[11px] mt-0.5 block">{t('hero.credSpecsSub')}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Prominent Logo Glass Centerpiece Card */}
            <div className="lg:col-span-5 hidden lg:block">
              <div 
                className="relative rounded-2xl p-8 backdrop-blur-xl border shadow-2xl transition-all duration-300 group hover:shadow-gold-glow/20"
                style={{
                  backgroundColor: 'rgba(18, 19, 25, 0.88)',
                  borderColor: 'var(--gold-border)',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(212, 175, 105, 0.15)',
                }}
              >
                {/* Gold Glow Radial Accent */}
                <div 
                  className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none blur-3xl opacity-30"
                  style={{ backgroundColor: 'var(--gold)' }}
                />

                {/* Big Centerpiece Logo */}
                <div className="flex flex-col items-center text-center space-y-5">
                  <div className="relative w-44 h-36 flex items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-500">
                    <img
                      src="/logo.png"
                      alt="IPM Exim Official Trade Emblem"
                      className="w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(212,175,105,0.45)]"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="font-serif text-2xl text-white font-normal tracking-wide">
                      IPM Exim
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.24em] font-sans font-semibold" style={{ color: 'var(--gold)' }}>
                      International Trade House
                    </div>
                  </div>

                  <p className="text-xs text-[#A39E94] leading-relaxed max-w-xs font-light">
                    Direct producer linkages across Indian agricultural belts, spice plantations, and textile centers with verified SGS/FSSAI/APEDA quality assurance.
                  </p>

                  {/* Trust Highlights Grid */}
                  <div className="w-full pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-left">
                    <div className="flex items-center gap-2 text-[11px] text-[#D1CCC2]">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--gold)' }} />
                      <span>APEDA & FIEO Reg.</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#D1CCC2]">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--gold)' }} />
                      <span>ISO 9001:2015</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#D1CCC2]">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--gold)' }} />
                      <span>FCL Containerized</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#D1CCC2]">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--gold)' }} />
                      <span>24h Quote Protocol</span>
                    </div>
                  </div>

                  <button
                    onClick={() => openQuoteModal()}
                    className="w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-wider rounded-lg border border-gold-border/60 hover:bg-[#D4AF69] hover:text-[#090A0C] text-[#E8CA8B] transition-all duration-200 cursor-pointer"
                  >
                    Quick Quote Dispatch &rarr;
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          2. KEY STATS BAR
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 -mt-12 sm:-mt-16 relative z-20">
        <div
          className="grid grid-cols-2 gap-px rounded-xl overflow-hidden border shadow-2xl transition-colors sm:grid-cols-4"
          style={{
            borderColor: 'var(--border-card)',
            backgroundColor: 'var(--border-card)',
          }}
        >
          <div
            className="p-6 text-center sm:p-8 transition-colors"
            style={{ backgroundColor: 'var(--bg-card)' }}
          >
            <p className="font-serif text-3xl sm:text-4xl font-normal" style={{ color: 'var(--gold)' }}>
              {t('stats.servicesNum')}
            </p>
            <p className="mt-2 text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>
              {t('stats.servicesLabel')}
            </p>
          </div>
          <div
            className="p-6 text-center sm:p-8 transition-colors"
            style={{ backgroundColor: 'var(--bg-card)' }}
          >
            <p className="font-serif text-3xl sm:text-4xl font-normal" style={{ color: 'var(--gold)' }}>
              {t('stats.portsNum')}
            </p>
            <p className="mt-2 text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>
              {t('stats.portsLabel')}
            </p>
          </div>
          <div
            className="p-6 text-center sm:p-8 transition-colors"
            style={{ backgroundColor: 'var(--bg-card)' }}
          >
            <p className="font-serif text-3xl sm:text-4xl font-normal" style={{ color: 'var(--gold)' }}>
              {t('stats.responseNum')}
            </p>
            <p className="mt-2 text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>
              {t('stats.responseLabel')}
            </p>
          </div>
          <div
            className="p-6 text-center sm:p-8 transition-colors"
            style={{ backgroundColor: 'var(--bg-card)' }}
          >
            <p className="font-serif text-3xl sm:text-4xl font-normal" style={{ color: 'var(--gold)' }}>
              {t('stats.langNum')}
            </p>
            <p className="mt-2 text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>
              {t('stats.langLabel')}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. COMPANY INTRODUCTION
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12">
        <div 
          className="rounded-2xl p-8 sm:p-12 border transition-colors grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-card)',
          }}
        >
          <div className="lg:col-span-5 space-y-4">
            <span className="badge-pill">{t('home.profileKicker')}</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-tight" style={{ color: 'var(--text-primary)' }}>
              {t('home.profileTitle')}
            </h2>
            <div className="h-0.5 w-16" style={{ backgroundColor: 'var(--gold)' }} />
          </div>
          <div className="lg:col-span-7 space-y-4 text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <p>
              {t('home.profileP1')}
            </p>
            <p>
              {t('home.profileP2')}
            </p>
            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider hover:underline transition-colors"
                style={{ color: 'var(--gold)' }}
              >
                <span>{t('home.readMore')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. FEATURED PRODUCTS CATALOGUE
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 border-b pb-6"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <div>
            <span className="badge-pill mb-2">{t('home.inventoryKicker')}</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal mt-1" style={{ color: 'var(--text-primary)' }}>
              {t('home.featuredProductsTitle')}
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider hover:opacity-80 transition-opacity shrink-0"
            style={{ color: 'var(--gold)' }}
          >
            <span>{t('home.viewFullCatalogue')}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="card-luxury flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-black/10">
                  <img
                    src={product.imageUrls[0]}
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
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <div className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>
                    {product.categoryName}
                  </div>
                  <h3 className="font-serif text-lg font-medium leading-snug line-clamp-2 transition-colors group-hover:text-gold-champagne"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <Link href={`/products/${product.slug}`}>
                      {product.name}
                    </Link>
                  </h3>
                  <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {product.shortDescription}
                  </p>
                  
                  {/* Origin & HS Code */}
                  <div className="pt-2 text-[11px] space-y-1.5 border-t" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <div className="flex justify-between">
                      <span>{t('home.originLabel')}:</span>
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{product.origin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('home.hsCodeLabel')}:</span>
                      <span className="font-mono font-semibold" style={{ color: 'var(--gold)' }}>{product.hsCode}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-5 pt-0 flex items-center gap-2">
                <Link
                  href={`/products/${product.slug}`}
                  className="flex-1 py-2 px-3 text-center text-xs rounded-md border font-medium transition-colors"
                  style={{
                    borderColor: 'var(--border-card)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {t('home.viewDetails')}
                </Link>
                <button
                  onClick={() => openQuoteModal({ id: product.id, name: product.name })}
                  className="py-2 px-3.5 rounded-md border text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer"
                  style={{
                    backgroundColor: 'var(--gold-muted)',
                    borderColor: 'var(--gold-border)',
                    color: 'var(--gold)',
                  }}
                  title="Request quote for this product"
                >
                  {t('header.quoteShort')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          5. SERVICES OVERVIEW
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="badge-pill">{t('home.capabilitiesKicker')}</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal" style={{ color: 'var(--text-primary)' }}>
            {t('home.capabilitiesTitle')}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {t('home.capabilitiesDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {(locale.services?.items || SERVICES).slice(0, 6).map((service: any, index: number) => (
            <div
              key={service.id || index}
              className="card-luxury p-7 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-serif tracking-wider uppercase font-semibold" style={{ color: 'var(--gold)' }}>
                    {t('home.servicePrefix')} 0{index + 1}
                  </div>
                  <div className="p-2.5 rounded-lg border" style={{ backgroundColor: 'var(--bg-topbar)', borderColor: 'var(--border-subtle)' }}>
                    {getServiceIcon(index)}
                  </div>
                </div>
                <h3 className="font-serif text-xl font-medium" style={{ color: 'var(--text-primary)' }}>
                  {(service.title || '').replace(/^\d+\.\s*/, '')}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {service.shortDesc || service.shortDescription}
                </p>
                <ul className="space-y-2 text-xs pt-2" style={{ color: 'var(--text-secondary)' }}>
                  {(service.benefits || service.keyBenefits || []).map((benefit: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-0.5" style={{ color: 'var(--gold)' }}>&bull;</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase transition-colors hover:underline"
                  style={{ color: 'var(--gold)' }}
                >
                  <span>{t('home.exploreScope')}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="btn-outline-gold"
          >
            <span>{t('home.viewAllServices')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ========================================================
          6. WHY CHOOSE IPM EXIM
          ======================================================== */}
      <section className="border-y py-20 transition-colors"
        style={{
          backgroundColor: 'var(--bg-card-subtle)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mb-12 space-y-3">
            <span className="badge-pill">{t('home.whyChooseKicker')}</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal" style={{ color: 'var(--text-primary)' }}>
              {t('home.whyChooseTitle')}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {t('home.whyChooseDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {(locale.home?.commitments || COMPANY_INFO.commitments).map((item: any, index: number) => (
              <div
                key={index}
                className="card-luxury p-6 space-y-3"
              >
                <div 
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-mono font-semibold border"
                  style={{
                    backgroundColor: 'var(--gold-muted)',
                    borderColor: 'var(--gold-border)',
                    color: 'var(--gold)',
                  }}
                >
                  0{index + 1}
                </div>
                <h3 className="font-serif text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {item.desc || item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          7. SOURCING & QUALITY PROCESS
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="badge-pill">{t('home.processKicker')}</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal" style={{ color: 'var(--text-primary)' }}>
            {t('home.processTitle')}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {t('home.processDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card-luxury p-6 space-y-4">
            <div className="text-2xl font-serif font-medium" style={{ color: 'var(--gold)' }}>01</div>
            <h3 className="font-serif text-lg font-medium" style={{ color: 'var(--text-primary)' }}>{t('home.step1Title')}</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {t('home.step1Desc')}
            </p>
          </div>

          <div className="card-luxury p-6 space-y-4">
            <div className="text-2xl font-serif font-medium" style={{ color: 'var(--gold)' }}>02</div>
            <h3 className="font-serif text-lg font-medium" style={{ color: 'var(--text-primary)' }}>{t('home.step2Title')}</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {t('home.step2Desc')}
            </p>
          </div>

          <div className="card-luxury p-6 space-y-4">
            <div className="text-2xl font-serif font-medium" style={{ color: 'var(--gold)' }}>03</div>
            <h3 className="font-serif text-lg font-medium" style={{ color: 'var(--text-primary)' }}>{t('home.step3Title')}</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {t('home.step3Desc')}
            </p>
          </div>

          <div className="card-luxury p-6 space-y-4">
            <div className="text-2xl font-serif font-medium" style={{ color: 'var(--gold)' }}>04</div>
            <h3 className="font-serif text-lg font-medium" style={{ color: 'var(--text-primary)' }}>{t('home.step4Title')}</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {t('home.step4Desc')}
            </p>
          </div>
        </div>

        <div 
          className="mt-8 p-4 rounded-xl border text-xs flex items-center gap-3 transition-colors"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-card)',
            color: 'var(--text-muted)',
          }}
        >
          <ShieldCheck className="w-5 h-5 shrink-0" style={{ color: 'var(--gold)' }} />
          <span>
            {t('home.processNote')}
          </span>
        </div>
      </section>

      {/* ========================================================
          8. GLOBAL TRADE & MARITIME PORTS
          ======================================================== */}
      <section className="border-y py-16 transition-colors"
        style={{
          backgroundColor: 'var(--bg-card-subtle)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="badge-pill">{t('home.maritimeKicker')}</span>
              <h2 className="font-serif text-3xl font-normal" style={{ color: 'var(--text-primary)' }}>
                {t('home.maritimeTitle')}
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {t('home.maritimeDesc')}
              </p>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {COMPANY_INFO.operatingPorts.map((port, idx) => (
                <div 
                  key={idx} 
                  className="card-luxury p-4 flex items-center gap-3.5"
                >
                  <div className="p-2.5 rounded-lg border" style={{ backgroundColor: 'var(--bg-topbar)', borderColor: 'var(--border-subtle)' }}>
                    <Anchor className="w-4 h-4" style={{ color: 'var(--gold)' }} />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{port.split(',')[0]}</h4>
                    <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{port.split(',')[1] || 'India'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          9. FREQUENTLY ASKED QUESTIONS
          ======================================================== */}
      <section className="max-w-4xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-12 space-y-3">
          <span className="badge-pill">{t('home.faqsKicker')}</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal" style={{ color: 'var(--text-primary)' }}>
            {t('home.faqsTitle')}
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {t('home.faqsDesc')}
          </p>
        </div>

        <div className="space-y-3">
          {(locale.home?.faqs || FAQS).map((faq: any, idx: number) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="card-luxury overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 transition-colors cursor-pointer"
                >
                  <span className="font-serif text-base font-medium" style={{ color: 'var(--text-primary)' }}>
                    {faq.q || faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    style={{ color: 'var(--gold)' }}
                  />
                </button>
                {isOpen && (
                  <div 
                    className="px-6 pb-5 pt-2 text-xs sm:text-sm leading-relaxed border-t"
                    style={{ 
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {faq.a || faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          10. FINAL CALL TO ACTION
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-16">
        <div 
          className="relative rounded-2xl p-10 sm:p-16 border text-center space-y-6 overflow-hidden shadow-2xl"
          style={{
            background: 'var(--cta-bg)',
            borderColor: 'var(--gold-border)',
          }}
        >
          {/* Subtle Ambient Glow */}
          <div 
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none blur-3xl opacity-20"
            style={{ backgroundColor: 'var(--gold)' }}
          />

          <div className="relative z-10 space-y-6">
            <span className="badge-pill">{t('home.ctaKicker')}</span>
            <h2 
              className="font-serif text-3xl sm:text-5xl font-normal max-w-2xl mx-auto leading-tight text-balance"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('home.ctaTitle')}
            </h2>
            <p 
              className="text-sm sm:text-base max-w-xl mx-auto leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t('home.ctaDesc')}
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => openQuoteModal()}
                className="btn-glass-morphism cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>{t('home.ctaBtn')}</span>
              </button>
              <Link
                href="/contact"
                className="btn-outline-gold"
              >
                <span>{t('home.ctaContact')}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
