import React from 'react';
import { COMPANY_INFO, FAQS } from '@/data/company';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ipmexim-import-export-frontend.vercel.app';

export const OrganizationJsonLd: React.FC = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: COMPANY_INFO.name,
    legalName: 'IPM Exim Global Trade House',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/logo.png`,
    description: COMPANY_INFO.description,
    email: COMPANY_INFO.email,
    telephone: COMPANY_INFO.phone,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressRegion: 'Maharashtra',
      addressLocality: 'Mumbai',
    },
    areaServed: [
      'United States',
      'United Kingdom',
      'United Arab Emirates',
      'Saudi Arabia',
      'Germany',
      'Australia',
      'Canada',
      'Singapore',
      'Worldwide',
    ],
    knowsAbout: [
      'International Merchant Export',
      'Basmati & Non-Basmati Rice Export',
      'High-Aroma Whole Spices Export',
      'Alleppey Green Cardamom',
      'Salem Turmeric Curcumin',
      'Guntur Teja Red Chilli',
      'Mulberry Silk & Handloom Textiles',
      'Handcrafted Pure Copperware',
      'FCL Ocean Freight Fulfillment',
      'APEDA & FIEO Regulatory Trade Documentation',
    ],
    sameAs: [
      COMPANY_INFO.socialLinks.linkedin,
      COMPANY_INFO.socialLinks.instagram,
      COMPANY_INFO.socialLinks.facebook,
      COMPANY_INFO.socialLinks.indiamart,
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        email: COMPANY_INFO.email,
        contactType: 'sales',
        availableLanguage: ['English', 'Hindi', 'Arabic', 'Spanish', 'French'],
        areaServed: 'Worldwide',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export const WebSiteJsonLd: React.FC = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'IPM Exim — Luxury Global Export-Import & Sourcing',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/products?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export const FaqJsonLd: React.FC = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
