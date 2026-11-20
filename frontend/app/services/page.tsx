'use client';

import React from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Search, 
  FileSpreadsheet, 
  Box, 
  FileCheck2, 
  Ship, 
  BadgeCheck,
  Sparkles
} from 'lucide-react';
import { SERVICES } from '@/data/company';
import { useQuoteModal } from '@/context/QuoteContext';
import { useLanguage } from '@/context/LanguageContext';

export default function ServicesPage() {
  const { openQuoteModal } = useQuoteModal();
  const { t, locale } = useLanguage();

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
      case 8: return <Ship className="w-5 h-5" style={{ color: 'var(--gold)' }} />;
      default: return <ShieldCheck className="w-5 h-5" style={{ color: 'var(--gold)' }} />;
    }
  };

  const serviceItems = locale.services?.items || SERVICES;

  return (
    <div className="space-y-20 py-12 lg:py-16">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="max-w-3xl space-y-4">
          <span className="badge-pill">{t('services.kicker')}</span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight" style={{ color: 'var(--text-primary)' }}>
            {t('services.title')}
          </h1>
          <p className="text-base sm:text-lg leading-relaxed pt-2" style={{ color: 'var(--text-secondary)' }}>
            {t('services.desc')}
          </p>
        </div>
      </section>

      {/* Services Breakdown */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="space-y-8">
          {serviceItems.map((service: any, index: number) => (
            <div
              key={service.id || index}
              className="card-luxury p-8 sm:p-10"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Service Header & Description */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg border" style={{ backgroundColor: 'var(--bg-topbar)', borderColor: 'var(--border-subtle)' }}>
                      {getServiceIcon(index)}
                    </div>
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider" style={{ color: 'var(--gold)' }}>
                      Capability 0{index + 1}
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl font-medium" style={{ color: 'var(--text-primary)' }}>
                    {service.title}
                  </h2>

                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {service.fullDesc || service.fullDescription}
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => openQuoteModal({ name: `Service Inquiry: ${service.title}` })}
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold transition-colors hover:underline cursor-pointer"
                      style={{ color: 'var(--gold)' }}
                    >
                      <span>{t('services.inquireBtn')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Benefits & Deliverables Box */}
                <div 
                  className="lg:col-span-5 p-6 rounded-xl border space-y-5 text-xs"
                  style={{
                    backgroundColor: 'var(--bg-card-elevated)',
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  <div>
                    <h3 className="font-serif text-sm mb-2.5 uppercase tracking-wider font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {t('services.buyerValueTitle')}
                    </h3>
                    <ul className="space-y-2" style={{ color: 'var(--text-muted)' }}>
                      {(service.benefits || service.keyBenefits || []).map((benefit: string, bIdx: number) => (
                        <li key={bIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                    <h3 className="font-serif text-sm mb-2.5 uppercase tracking-wider font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {t('services.deliverablesTitle')}
                    </h3>
                    <ul className="space-y-2" style={{ color: 'var(--text-muted)' }}>
                      {(service.deliverables || []).map((deliverable: string, dIdx: number) => (
                        <li key={dIdx} className="flex items-start gap-2">
                          <span style={{ color: 'var(--gold)' }}>&bull;</span>
                          <span>{deliverable}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sourcing Engagement Callout */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-8">
        <div 
          className="card-luxury p-8 sm:p-12 text-center space-y-6"
          style={{
            background: 'var(--cta-bg)',
            borderColor: 'var(--gold-border)',
          }}
        >
          <span className="badge-pill">{t('services.retainerKicker')}</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal max-w-xl mx-auto" style={{ color: 'var(--text-primary)' }}>
            {t('services.retainerTitle')}
          </h2>
          <p className="text-sm max-w-lg mx-auto" style={{ color: 'var(--text-muted)' }}>
            {t('services.retainerDesc')}
          </p>
          <button
            onClick={() => openQuoteModal({ name: 'General Sourcing Retainer / Mandate' })}
            className="btn-gold shadow-lg cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#090A0C]" />
            <span>{t('services.retainerBtn')}</span>
          </button>
        </div>
      </section>
    </div>
  );
}
