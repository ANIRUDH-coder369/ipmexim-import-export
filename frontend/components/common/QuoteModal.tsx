'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X, CheckCircle, Send, ShieldCheck, Sparkles, Building2, Globe2, Mail, Phone, Layers } from 'lucide-react';
import { validateEnquiryForm, EnquiryFormData, ValidationErrors } from '../../utils/validation';
import { createEnquirySubmission } from '../../utils/enquiry';
import { getApiUrl } from '../../utils/apiConfig';
import { PRODUCTS } from '../../data/products';
import { EnquirySubmission } from '../../types';
import { useQuoteModal } from '../../context/QuoteContext';
import { useLanguage } from '../../context/LanguageContext';

export interface DynamicProductLine {
  _id?: string;
  id?: string;
  name: string;
  category?: string;
  description?: string;
  defaultUnit?: string;
  isActive?: boolean;
}

// Initial fallback product lines if backend is loading or offline
const DEFAULT_PRODUCT_LINES: DynamicProductLine[] = [
  { id: 'pl-1', name: '1121 Steam Basmati Rice (XXL Extra Long Grain)', category: 'Rice & Grains', defaultUnit: '20ft FCL / 25 MT' },
  { id: 'pl-2', name: '1509 Golden Sella Basmati Rice', category: 'Rice & Grains', defaultUnit: 'Metric Tons (MT)' },
  { id: 'pl-3', name: 'Alleppey Green Cardamom (8mm Bold)', category: 'Spices', defaultUnit: 'Metric Tons' },
  { id: 'pl-4', name: 'Guntur S4 Red Chilli (Stemless / Whole)', category: 'Spices', defaultUnit: '1 x 20ft FCL (14 MT)' },
  { id: 'pl-5', name: 'Salem Turmeric Fingers (High Curcumin 3.5%+)', category: 'Spices', defaultUnit: 'Metric Tons (MT)' },
  { id: 'pl-6', name: 'Malabar Bold Black Pepper (550+ GL Garbled)', category: 'Spices', defaultUnit: 'Metric Tons (MT)' },
  { id: 'pl-7', name: 'Hand-Hammered Solid Copper Pitcher & Drinkware', category: 'Metalware', defaultUnit: 'Master Cartons' },
  { id: 'pl-8', name: 'Pure Mulberry Silk Scarves & Pashmina Stoles', category: 'Textiles', defaultUnit: 'Pieces / Master Cartons' },
  { id: 'pl-9', name: 'Bespoke Agricultural Commodity Sourcing Mandate', category: 'Custom Sourcing', defaultUnit: 'As per Contract Specification' },
];

export const QuoteModal: React.FC = () => {
  const { isOpen, closeQuoteModal, preselectedProduct } = useQuoteModal();
  const { t } = useLanguage();

  const [productLines, setProductLines] = useState<DynamicProductLine[]>(DEFAULT_PRODUCT_LINES);
  const [formData, setFormData] = useState<EnquiryFormData>({
    fullName: '',
    businessEmail: '',
    companyName: '',
    country: '',
    productId: '',
    productName: '',
    quantity: '',
    contactMethod: 'Email',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEnquiry, setSubmittedEnquiry] = useState<EnquirySubmission | null>(null);

  // Fetch dynamic product lines from server API
  useEffect(() => {
    const fetchDynamicProductLines = async () => {
      try {
        const apiUrl = getApiUrl();
        const res = await fetch(`${apiUrl}/product-lines`);
        if (res.ok) {
          const data = await res.json();
          if (data.productLines && data.productLines.length > 0) {
            setProductLines(data.productLines);
            return;
          }
        }
      } catch (err) {
        // Fallback to localStorage managed by admin
        try {
          const stored = localStorage.getItem('ipm_product_lines');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setProductLines(parsed.filter((p: DynamicProductLine) => p.isActive !== false));
              return;
            }
          }
        } catch (e) {}
      }
    };

    fetchDynamicProductLines();
  }, [isOpen]);

  useEffect(() => {
    if (preselectedProduct?.name) {
      setFormData((prev) => ({
        ...prev,
        productId: preselectedProduct.id || preselectedProduct.name || '',
        productName: preselectedProduct.name || '',
        message: prev.message || `Requesting formal commercial export quotation and FOB/CIF terms for ${preselectedProduct.name}.`,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        productId: '',
        productName: '',
      }));
    }
  }, [preselectedProduct, isOpen]);

  const pathname = usePathname();
  if (!isOpen || pathname?.startsWith('/admin')) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVal = e.target.value;
    const matched = productLines.find((p) => p.name === selectedVal || p._id === selectedVal || p.id === selectedVal);
    
    setFormData((prev) => ({
      ...prev,
      productId: selectedVal,
      productName: matched ? matched.name : selectedVal,
      quantity: prev.quantity || (matched?.defaultUnit ? `1 x ${matched.defaultUnit}` : '')
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateEnquiryForm(formData);
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    setIsSubmitting(true);

    // Prepare local submission record
    const saved = createEnquirySubmission({
      fullName: formData.fullName.trim(),
      businessEmail: formData.businessEmail.trim(),
      companyName: formData.companyName.trim(),
      country: formData.country.trim(),
      productId: formData.productId || undefined,
      productName: formData.productName || undefined,
      quantity: formData.quantity.trim(),
      contactMethod: formData.contactMethod,
      phone: formData.phone?.trim() || undefined,
      message: formData.message.trim(),
    });

    // Post to backend API so live notifications trigger
    try {
      const apiUrl = getApiUrl();
      await fetch(`${apiUrl}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          corporateEmail: formData.businessEmail.trim(),
          company: formData.companyName.trim(),
          destinationCountry: formData.country.trim(),
          destinationPort: formData.country.trim(),
          productOfInterest: formData.productName || 'General Export Inquiry',
          estimatedQuantity: formData.quantity.trim(),
          phoneWhatsApp: formData.phone?.trim() || undefined,
          technicalSpecifications: formData.message.trim(),
          consent: true,
        }),
      });
    } catch (err) {
      console.warn('Backend notification offline, client state preserved:', err);
    }

    // Persist to local storage for Admin dashboard synchronization
    try {
      const stored = localStorage.getItem('ipm_quotations');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(saved);
      localStorage.setItem('ipm_quotations', JSON.stringify(list));
    } catch (e) {
      console.error('LocalStorage write failed', e);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedEnquiry(saved);
    }, 400);
  };

  const handleResetAndClose = () => {
    setSubmittedEnquiry(null);
    setErrors({});
    closeQuoteModal();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: 'var(--modal-overlay)', backdropFilter: 'blur(8px)' }}
    >
      <div 
        className="relative w-full max-w-2xl my-8 rounded-2xl border shadow-2xl p-6 sm:p-8 transition-all"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-card)',
          color: 'var(--text-primary)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-full border transition-colors hover:border-gold-border cursor-pointer"
          style={{ 
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-muted)'
          }}
          aria-label="Close quote modal"
        >
          <X className="w-4 h-4" />
        </button>

        {submittedEnquiry ? (
          <div className="space-y-6 py-4 text-center">
            <div 
              className="w-16 h-16 mx-auto rounded-full border flex items-center justify-center shadow-lg"
              style={{
                backgroundColor: 'var(--gold-muted)',
                borderColor: 'var(--gold)',
                color: 'var(--gold)',
              }}
            >
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-2xl sm:text-3xl font-medium" style={{ color: 'var(--text-primary)' }}>
                {t('quoteModal.successTitle')}
              </h3>
              <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
                {t('quoteModal.successSub')}
              </p>
            </div>

            <div 
              className="p-5 rounded-xl border max-w-md mx-auto text-left text-xs space-y-2 font-mono shadow-inner"
              style={{
                backgroundColor: 'var(--bg-card-elevated)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>{t('quoteModal.refCode')}:</span>
                <span className="font-bold" style={{ color: 'var(--gold)' }}>{submittedEnquiry.id}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>{t('quoteModal.desk')}:</span>
                <span style={{ color: 'var(--text-primary)' }}>export@ipmexim.com</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>Product Line:</span>
                <span className="truncate max-w-[200px]" style={{ color: 'var(--text-primary)' }}>
                  {submittedEnquiry.productName || t('quoteModal.generalProduct')}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>{t('quoteModal.estVolume')}:</span>
                <span style={{ color: 'var(--text-primary)' }}>{submittedEnquiry.quantity}</span>
              </div>
            </div>

            <p className="text-xs max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
              {t('quoteModal.successNotice')}
            </p>

            <button
              onClick={handleResetAndClose}
              className="btn-gold"
            >
              {t('quoteModal.closeWindow')}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Modal Brand Header */}
            <div className="flex items-center gap-3.5 border-b pb-4" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 p-1 shrink-0 shadow-sm">
                <img
                  src="/logo.png"
                  alt="IPM Exim Official Emblem"
                  className="w-full h-full object-contain filter drop-shadow-sm"
                />
              </div>
              <div>
                <span className="badge-pill mb-1">
                  {t('quoteModal.kicker')} &bull; Direct Trade Desk
                </span>
                <h2 id="quote-modal-title" className="font-serif text-2xl sm:text-3xl font-medium tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  {t('quoteModal.title')}
                </h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Dynamic Product Line / Requirement Dropdown */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold" style={{ color: 'var(--gold)' }}>
                    Product Line / Sourcing Requirement <span className="text-red-400">*</span>
                  </label>
                  <span className="text-[10px] font-mono" style={{ color: 'var(--text-dim)' }}>
                    {productLines.length} Active Options
                  </span>
                </div>
                <select
                  name="productId"
                  value={formData.productName || formData.productId}
                  onChange={handleProductSelect}
                  className="input-luxury"
                >
                  <option value="">Select Product Line / Sourcing Requirement...</option>
                  {productLines.map((prod) => (
                    <option key={prod._id || prod.id || prod.name} value={prod.name}>
                      {prod.name} {prod.category ? `— [${prod.category}]` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Two Column: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1" style={{ color: 'var(--gold)' }}>
                    {t('quoteModal.nameLabel')} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. John Henderson"
                    className={`input-luxury ${errors.fullName ? 'border-red-500' : ''}`}
                  />
                  {errors.fullName && <p className="text-red-400 text-[11px] mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block font-semibold mb-1" style={{ color: 'var(--gold)' }}>
                    {t('quoteModal.emailLabel')} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="businessEmail"
                    value={formData.businessEmail}
                    onChange={handleChange}
                    placeholder="procurement@company.com"
                    className={`input-luxury ${errors.businessEmail ? 'border-red-500' : ''}`}
                  />
                  {errors.businessEmail && <p className="text-red-400 text-[11px] mt-1">{errors.businessEmail}</p>}
                </div>
              </div>

              {/* Two Column: Company & Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1" style={{ color: 'var(--gold)' }}>
                    {t('quoteModal.companyLabel')} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Company Ltd / Trading LLC"
                    className={`input-luxury ${errors.companyName ? 'border-red-500' : ''}`}
                  />
                  {errors.companyName && <p className="text-red-400 text-[11px] mt-1">{errors.companyName}</p>}
                </div>

                <div>
                  <label className="block font-semibold mb-1" style={{ color: 'var(--gold)' }}>
                    {t('quoteModal.countryLabel')} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="e.g. Rotterdam, Netherlands"
                    className={`input-luxury ${errors.country ? 'border-red-500' : ''}`}
                  />
                  {errors.country && <p className="text-red-400 text-[11px] mt-1">{errors.country}</p>}
                </div>
              </div>

              {/* Two Column: Estimated Quantity & Preferred Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1" style={{ color: 'var(--gold)' }}>
                    {t('quoteModal.quantityLabel')} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="e.g. 1 x 20ft FCL / 10 Metric Tons"
                    className={`input-luxury ${errors.quantity ? 'border-red-500' : ''}`}
                  />
                  {errors.quantity && <p className="text-red-400 text-[11px] mt-1">{errors.quantity}</p>}
                </div>

                <div>
                  <label className="block font-semibold mb-1" style={{ color: 'var(--gold)' }}>
                    {t('quoteModal.methodLabel')}
                  </label>
                  <select
                    name="contactMethod"
                    value={formData.contactMethod}
                    onChange={handleChange}
                    className="input-luxury"
                  >
                    <option value="Email">{t('quoteModal.emailMethod')}</option>
                    <option value="WhatsApp">{t('quoteModal.waMethod')}</option>
                    <option value="Phone">{t('quoteModal.phoneMethod')}</option>
                  </select>
                </div>
              </div>

              {/* Phone if WhatsApp or Phone */}
              {(formData.contactMethod === 'WhatsApp' || formData.contactMethod === 'Phone') && (
                <div>
                  <label className="block font-semibold mb-1" style={{ color: 'var(--gold)' }}>
                    {t('quoteModal.phoneLabel')} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+44 7911 123456"
                    className={`input-luxury ${errors.phone ? 'border-red-500' : ''}`}
                  />
                  {errors.phone && <p className="text-red-400 text-[11px] mt-1">{errors.phone}</p>}
                </div>
              )}

              {/* Message / Specifications */}
              <div>
                <label className="block font-semibold mb-1" style={{ color: 'var(--gold)' }}>
                  {t('quoteModal.messageLabel')} <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t('quoteModal.messagePlaceholder')}
                  className={`input-luxury ${errors.message ? 'border-red-500' : ''}`}
                />
                {errors.message && <p className="text-red-400 text-[11px] mt-1">{errors.message}</p>}
              </div>

              {/* Confidentiality Notice */}
              <div 
                className="flex items-start gap-2.5 text-[11px] p-3 rounded-lg border"
                style={{
                  backgroundColor: 'var(--bg-card-subtle)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-muted)',
                }}
              >
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                <span>
                  {t('quoteModal.confidentiality')}
                </span>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors hover:text-white cursor-pointer"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {t('quoteModal.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-glass-morphism cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>{t('quoteModal.processing')}</span>
                  ) : (
                    <>
                      <span>{t('quoteModal.transmit')}</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
