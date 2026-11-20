'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { COMPANY_INFO } from '@/data/company';
import { useLanguage } from '@/context/LanguageContext';

export default function PrivacyPolicyPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12 lg:py-16 space-y-10">
      {/* Breadcrumb */}
      <div>
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[#8E8A82] hover:text-[#D4AF69] transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('privacy.breadcrumb')}</span>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-3 border-b border-[#221D15] pb-6">
        <span className="text-xs uppercase tracking-widest text-[#D4AF69]">{t('privacy.kicker')}</span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#F5F1E8]">
          {t('privacy.title')}
        </h1>
        <p className="text-xs text-[#8E8A82]">
          {t('privacy.effectiveDate')}
        </p>
      </div>

      {/* Policy Content */}
      <div className="space-y-8 text-sm text-[#B5B0A6] leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-serif text-xl text-[#F5F1E8]">{t('privacy.s1Title')}</h2>
          <p>{t('privacy.s1P1')}</p>
          <p>{t('privacy.s1P2')}</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-[#F5F1E8]">{t('privacy.s2Title')}</h2>
          <p>{t('privacy.s2Desc')}</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-[#F5F1E8]">{t('privacy.s3Title')}</h2>
          <p>{t('privacy.s3Desc')}</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-[#F5F1E8]">{t('privacy.s4Title')}</h2>
          <p>{t('privacy.s4Desc')}</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-[#F5F1E8]">{t('privacy.s5Title')}</h2>
          <p>{t('privacy.s5Desc')}</p>
          <div className="p-4 bg-[#141414] border border-[#262016] text-xs space-y-1">
            <p className="text-[#F5F1E8] font-medium">{t('privacy.contactBoxTitle')}</p>
            <p>Email: <a href={`mailto:${COMPANY_INFO.email}`} className="text-[#D4AF69]">{COMPANY_INFO.email}</a></p>
            <p>Jurisdiction: India</p>
          </div>
        </section>
      </div>
    </div>
  );
}
