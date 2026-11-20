'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Compass, Target, Scale, Handshake, Globe, CheckCircle2, ArrowRight } from 'lucide-react';
import { COMPANY_INFO } from '@/data/company';
import { useQuoteModal } from '@/context/QuoteContext';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutPage() {
  const { openQuoteModal } = useQuoteModal();
  const { t } = useLanguage();

  return (
    <div className="space-y-24 py-12 lg:py-16">
      {/* Editorial Header */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="max-w-3xl space-y-4">
          <span className="badge-pill">{t('about.kicker')}</span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight" style={{ color: 'var(--text-primary)' }}>
            {t('about.title')}
          </h1>
          <p className="text-base sm:text-lg leading-relaxed pt-2" style={{ color: 'var(--text-secondary)' }}>
            {t('about.desc')}
          </p>
        </div>
      </section>

      {/* Overview & Purpose */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-b py-16" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="lg:col-span-5 space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-medium" style={{ color: 'var(--text-primary)' }}>
              {t('about.purposeTitle')}
            </h2>
            <div className="h-0.5 w-12" style={{ backgroundColor: 'var(--gold)' }} />
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {t('about.purposeP1')}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {t('about.purposeP2')}
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="card-luxury p-6 space-y-3">
              <Compass className="w-6 h-6" style={{ color: 'var(--gold)' }} />
              <h3 className="font-serif text-lg font-medium" style={{ color: 'var(--text-primary)' }}>{t('about.visionTitle')}</h3>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {t('about.visionDesc')}
              </p>
            </div>

            <div className="card-luxury p-6 space-y-3">
              <Target className="w-6 h-6" style={{ color: 'var(--gold)' }} />
              <h3 className="font-serif text-lg font-medium" style={{ color: 'var(--text-primary)' }}>{t('about.missionTitle')}</h3>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {t('about.missionDesc')}
              </p>
            </div>

            <div className="card-luxury p-6 space-y-3">
              <Scale className="w-6 h-6" style={{ color: 'var(--gold)' }} />
              <h3 className="font-serif text-lg font-medium" style={{ color: 'var(--text-primary)' }}>{t('about.integrityTitle')}</h3>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {t('about.integrityDesc')}
              </p>
            </div>

            <div className="card-luxury p-6 space-y-3">
              <Handshake className="w-6 h-6" style={{ color: 'var(--gold)' }} />
              <h3 className="font-serif text-lg font-medium" style={{ color: 'var(--text-primary)' }}>{t('about.directTitle')}</h3>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {t('about.directDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sourcing Philosophy & Buyer Communication */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="badge-pill">{t('about.philosophyKicker')}</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal" style={{ color: 'var(--text-primary)' }}>
              {t('about.philosophyTitle')}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {t('about.philosophyDesc')}
            </p>
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                <div>
                  <h4 className="font-serif text-base font-medium" style={{ color: 'var(--text-primary)' }}>{t('about.paramTitle')}</h4>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('about.paramDesc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                <div>
                  <h4 className="font-serif text-base font-medium" style={{ color: 'var(--text-primary)' }}>{t('about.batchTitle')}</h4>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('about.batchDesc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                <div>
                  <h4 className="font-serif text-base font-medium" style={{ color: 'var(--text-primary)' }}>{t('about.objectiveTitle')}</h4>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('about.objectiveDesc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                <div>
                  <h4 className="font-serif text-base font-medium" style={{ color: 'var(--text-primary)' }}>{t('about.truthTitle')}</h4>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('about.truthDesc')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card-luxury p-8 sm:p-10 space-y-6">
            <h3 className="font-serif text-2xl font-normal" style={{ color: 'var(--text-primary)' }}>{t('about.govTitle')}</h3>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {t('about.govDesc')}
            </p>
            <div className="space-y-3 text-xs border-t pt-4" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
              <div className="flex justify-between py-1 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <span>{t('about.govEntity')}</span>
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{t('about.govEntityVal')}</span>
              </div>
              <div className="flex justify-between py-1 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <span>{t('about.govCountry')}</span>
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{t('about.govCountryVal')}</span>
              </div>
              <div className="flex justify-between py-1 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <span>{t('about.govPort')}</span>
                <span className="font-medium font-mono" style={{ color: 'var(--gold)' }}>{t('about.govPortVal')}</span>
              </div>
              <div className="flex justify-between py-1 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <span>{t('about.govSecPorts')}</span>
                <span style={{ color: 'var(--text-primary)' }}>{t('about.govSecPortsVal')}</span>
              </div>
              <div className="flex justify-between py-1 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <span>{t('about.govVerif')}</span>
                <span style={{ color: 'var(--text-primary)' }}>{t('about.govVerifVal')}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => openQuoteModal()}
                className="btn-gold w-full py-3 cursor-pointer"
              >
                {t('about.govCta')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
