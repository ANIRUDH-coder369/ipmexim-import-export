'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, Globe2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { COMPANY_INFO } from '@/data/company';
import { PRODUCT_CATEGORIES } from '@/data/products';
import { useLanguage } from '@/context/LanguageContext';
import { SocialLinks } from '@/components/common/SocialLinks';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const { t } = useLanguage();

  // Completely hide public website footer on all admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer
      className="border-t pt-20 pb-12 transition-colors"
      style={{
        backgroundColor: 'var(--bg-footer)',
        borderColor: 'var(--border-subtle)',
        color: 'var(--text-muted)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Brand Info & Mission */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3.5 group">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-white/5 p-1 border border-white/10 group-hover:border-[#D4AF69]/40 transition-colors">
                <img
                  src="/logo.png"
                  alt="IPM Exim Global"
                  className="h-full w-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform"
                />
              </div>
              <div>
                <span
                  className="font-serif text-2xl lg:text-3xl font-normal tracking-tight block"
                  style={{ color: 'var(--text-primary)' }}
                >
                  IPM Exim
                </span>
                <span
                  className="block text-[10px] uppercase tracking-[0.22em] font-sans font-bold"
                  style={{ color: 'var(--gold)' }}
                >
                  International Trade &bull; India Origin Gateway
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed max-w-sm" style={{ color: 'var(--text-muted)' }}>
              {t('footer.brandDesc')}
            </p>

            <div className="pt-2 text-xs space-y-2.5">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 shrink-0" style={{ color: 'var(--gold)' }} />
                <span>
                  {t('footer.enquiries')}:{' '}
                  <a
                    href={`mailto:${COMPANY_INFO.email}`}
                    className="font-medium hover:text-gold-champagne transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {COMPANY_INFO.email}
                  </a>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe2 className="w-4 h-4 shrink-0" style={{ color: 'var(--gold)' }} />
                <span>{t('footer.maritimeGateways')}</span>
              </div>
            </div>

            {/* Social Media & B2B Portals */}
            <div className="pt-2">
              <span
                className="block text-[11px] uppercase tracking-wider font-semibold mb-2.5"
                style={{ color: 'var(--gold)' }}
              >
                Official Commercial &amp; Trade Channels
              </span>
              <SocialLinks iconSize="sm" />
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4
              className="font-serif text-base tracking-wide uppercase font-medium mb-5"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('footer.company')}
            </h4>
            <ul className="space-y-3 text-xs font-normal">
              <li><Link href="/" className="hover:text-gold-champagne transition-colors">{t('footer.home')}</Link></li>
              <li><Link href="/about" className="hover:text-gold-champagne transition-colors">{t('footer.about')}</Link></li>
              <li><Link href="/products" className="hover:text-gold-champagne transition-colors">{t('footer.catalogue')}</Link></li>
              <li><Link href="/services" className="hover:text-gold-champagne transition-colors">{t('footer.exportServices')}</Link></li>
              <li><Link href="/quality-certifications" className="hover:text-gold-champagne transition-colors">{t('footer.qualityStandards')}</Link></li>
              <li><Link href="/gallery" className="hover:text-gold-champagne transition-colors">{t('footer.tradeGallery')}</Link></li>
              <li><Link href="/contact" className="hover:text-gold-champagne transition-colors">{t('footer.contactUs')}</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-gold-champagne transition-colors">{t('footer.privacyPolicy')}</Link></li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h4
              className="font-serif text-base tracking-wide uppercase font-medium mb-5"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('footer.sectors')}
            </h4>
            <ul className="space-y-3 text-xs">
              {PRODUCT_CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/products?category=${cat.id}`}
                    className="hover:text-gold-champagne transition-colors flex items-center justify-between"
                  >
                    <span>{cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Operational Commitments & Accreditations */}
          <div>
            <h4
              className="font-serif text-base tracking-wide uppercase font-medium mb-5"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('footer.tradeStandards')}
            </h4>
            <div className="space-y-3.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              <p className="leading-relaxed">
                {t('footer.tradeStandardsText')}
              </p>
              <div
                className="p-4 rounded-xl border"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-card)',
                }}
              >
                <div className="flex items-center gap-2 font-medium mb-1.5" style={{ color: 'var(--gold)' }}>
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span className="text-xs uppercase tracking-wider">{t('footer.truthfulDoc')}</span>
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-dim)' }}>
                  {t('footer.truthfulDocSub')}
                </p>
              </div>

              {/* Accreditations Trust Badges */}
              <div className="pt-2 flex flex-wrap gap-2 text-[10px]">
                <span className="px-2 py-1 rounded-md border border-white/10 bg-white/5 font-mono">APEDA</span>
                <span className="px-2 py-1 rounded-md border border-white/10 bg-white/5 font-mono">FIEO</span>
                <span className="px-2 py-1 rounded-md border border-white/10 bg-white/5 font-mono">SPICES BOARD</span>
                <span className="px-2 py-1 rounded-md border border-white/10 bg-white/5 font-mono">ISO 9001</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Attribution and Legal Bar */}
        <div
          className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-dim)' }}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
            <p>
              &copy; 2026 IPM Exim Global Trade House. {t('footer.rights')}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-gold-champagne transition-colors">
              {t('footer.privacyLink')}
            </Link>
            <span className="opacity-30">&bull;</span>
            <Link href="/contact" className="hover:text-gold-champagne transition-colors">
              {t('footer.directDesk')}
            </Link>
            <span className="opacity-30">&bull;</span>
            <Link href="/admin/login" className="hover:text-gold-champagne transition-colors font-mono text-[11px]">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
