'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2, FileCheck, FlaskConical, Award, Sparkles } from 'lucide-react';
import { useQuoteModal } from '@/context/QuoteContext';
import { useLanguage } from '@/context/LanguageContext';

export default function QualityCertificationsPage() {
  const { openQuoteModal } = useQuoteModal();
  const { t } = useLanguage();

  return (
    <div className="space-y-20 py-12 lg:py-16">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="max-w-3xl space-y-4">
          <span className="badge-pill">{t('quality.kicker')}</span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight" style={{ color: 'var(--text-primary)' }}>
            {t('quality.title')}
          </h1>
          <p className="text-base sm:text-lg leading-relaxed pt-2" style={{ color: 'var(--text-secondary)' }}>
            {t('quality.desc')}
          </p>
        </div>
      </section>

      {/* Quality Control Workflow */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="border-b pb-6 mb-12" style={{ borderColor: 'var(--border-subtle)' }}>
          <span className="badge-pill mb-2">{t('quality.protocolKicker')}</span>
          <h2 className="font-serif text-3xl font-medium mt-1" style={{ color: 'var(--text-primary)' }}>
            {t('quality.protocolTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card-luxury p-7 space-y-4">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center border"
              style={{
                backgroundColor: 'var(--gold-muted)',
                borderColor: 'var(--gold-border)',
                color: 'var(--gold)',
              }}
            >
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-medium" style={{ color: 'var(--text-primary)' }}>{t('quality.t1Title')}</h3>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {t('quality.t1Desc')}
            </p>
            <ul className="text-xs space-y-1.5 pt-2 border-t" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
              <li>&bull; {t('quality.t1B1')}</li>
              <li>&bull; {t('quality.t1B2')}</li>
              <li>&bull; {t('quality.t1B3')}</li>
            </ul>
          </div>

          <div className="card-luxury p-7 space-y-4">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center border"
              style={{
                backgroundColor: 'var(--gold-muted)',
                borderColor: 'var(--gold-border)',
                color: 'var(--gold)',
              }}
            >
              <FlaskConical className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-medium" style={{ color: 'var(--text-primary)' }}>{t('quality.t2Title')}</h3>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {t('quality.t2Desc')}
            </p>
            <ul className="text-xs space-y-1.5 pt-2 border-t" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
              <li>&bull; {t('quality.t2B1')}</li>
              <li>&bull; {t('quality.t2B2')}</li>
              <li>&bull; {t('quality.t2B3')}</li>
            </ul>
          </div>

          <div className="card-luxury p-7 space-y-4">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center border"
              style={{
                backgroundColor: 'var(--gold-muted)',
                borderColor: 'var(--gold-border)',
                color: 'var(--gold)',
              }}
            >
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-medium" style={{ color: 'var(--text-primary)' }}>{t('quality.t3Title')}</h3>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {t('quality.t3Desc')}
            </p>
            <ul className="text-xs space-y-1.5 pt-2 border-t" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
              <li>&bull; {t('quality.t3B1')}</li>
              <li>&bull; {t('quality.t3B2')}</li>
              <li>&bull; {t('quality.t3B3')}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Truthful Credentials & Documentation Policy */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12">
        <div 
          className="card-luxury p-8 sm:p-12 space-y-6"
          style={{
            background: 'var(--cta-bg)',
            borderColor: 'var(--gold-border)',
          }}
        >
          <div className="space-y-2">
            <span className="badge-pill">{t('quality.policyKicker')}</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium" style={{ color: 'var(--text-primary)' }}>
              {t('quality.policyTitle')}
            </h2>
          </div>

          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {t('quality.policyDesc')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 text-xs">
            <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
              <span className="font-serif text-sm block mb-1 font-semibold" style={{ color: 'var(--gold)' }}>{t('quality.doc1Title')}</span>
              <p style={{ color: 'var(--text-muted)' }}>{t('quality.doc1Desc')}</p>
            </div>

            <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
              <span className="font-serif text-sm block mb-1 font-semibold" style={{ color: 'var(--gold)' }}>{t('quality.doc2Title')}</span>
              <p style={{ color: 'var(--text-muted)' }}>{t('quality.doc2Desc')}</p>
            </div>

            <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
              <span className="font-serif text-sm block mb-1 font-semibold" style={{ color: 'var(--gold)' }}>{t('quality.doc3Title')}</span>
              <p style={{ color: 'var(--text-muted)' }}>{t('quality.doc3Desc')}</p>
            </div>

            <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
              <span className="font-serif text-sm block mb-1 font-semibold" style={{ color: 'var(--gold)' }}>{t('quality.doc4Title')}</span>
              <p style={{ color: 'var(--text-muted)' }}>{t('quality.doc4Desc')}</p>
            </div>
          </div>

          <div className="pt-4 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {t('contact.desc')}
            </div>
            <button
              onClick={() => openQuoteModal({ name: 'Compliance & Regulatory Documentation Query' })}
              className="btn-gold cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#090A0C]" />
              <span>{t('hero.ctaQuote')}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
