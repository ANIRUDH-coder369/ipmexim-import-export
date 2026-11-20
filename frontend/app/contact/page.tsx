'use client';

import React, { useState } from 'react';
import { Mail, Globe2, Clock, Send, CheckCircle2, ShieldCheck, Building2, Phone, MapPin, Sparkles, ExternalLink } from 'lucide-react';
import { COMPANY_INFO } from '@/data/company';
import { PRODUCTS } from '@/data/products';
import { validateEnquiryForm, EnquiryFormData, ValidationErrors } from '@/utils/validation';
import { createEnquirySubmission } from '@/utils/enquiry';
import { getApiUrl } from '@/utils/apiConfig';
import { EnquirySubmission } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { SocialLinks } from '@/components/common/SocialLinks';

export default function ContactPage() {
  const { t } = useLanguage();
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

  const [productLines, setProductLines] = useState<any[]>(PRODUCTS.map(p => ({
    id: p.id,
    name: p.name,
    category: p.categoryName,
    defaultUnit: 'Metric Tons'
  })));

  React.useEffect(() => {
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
      } catch (err) {}

      try {
        const stored = localStorage.getItem('ipm_product_lines');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProductLines(parsed.filter((p: any) => p.isActive !== false));
          }
        }
      } catch (e) {}
    };

    fetchDynamicProductLines();
  }, []);

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

    // Try sending to backend
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
          productOfInterest: formData.productName || 'Direct Contact Inquiry',
          estimatedQuantity: formData.quantity.trim(),
          phoneWhatsApp: formData.phone?.trim() || undefined,
          technicalSpecifications: formData.message.trim(),
          consent: true,
        }),
      });
    } catch (err) {
      console.warn('Backend notification offline, client state preserved:', err);
    }

    // Save to local storage for Admin dashboard
    try {
      const stored = localStorage.getItem('ipm_quotations');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(saved);
      localStorage.setItem('ipm_quotations', JSON.stringify(list));
    } catch (e) {}

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedEnquiry(saved);
    }, 400);
  };

  const handleStartNew = () => {
    setSubmittedEnquiry(null);
    setFormData({
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
    setErrors({});
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16 space-y-16">
      {/* Header */}
      <div className="space-y-4 border-b pb-8" style={{ borderColor: 'var(--border-subtle)' }}>
        <span className="badge-pill">{t('contact.kicker')}</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal" style={{ color: 'var(--text-primary)' }}>
          {t('contact.title')}
        </h1>
        <p className="text-sm sm:text-base max-w-3xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {t('contact.desc')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Form */}
        <div className="lg:col-span-7">
          {submittedEnquiry ? (
            <div className="card-luxury p-8 sm:p-10 space-y-6">
              <div 
                className="w-16 h-16 rounded-full border flex items-center justify-center shadow-lg"
                style={{
                  backgroundColor: 'var(--gold-muted)',
                  borderColor: 'var(--gold)',
                  color: 'var(--gold)',
                }}
              >
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest font-mono font-bold" style={{ color: 'var(--gold)' }}>
                  Enquiry Logged Successfully
                </span>
                <h2 className="font-serif text-3xl font-medium" style={{ color: 'var(--text-primary)' }}>
                  Commercial Submission Confirmed
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Your procurement specification has been routed to our direct export coordinators. An acknowledgement email with your tracking identifier has been dispatched.
                </p>
              </div>

              <div 
                className="p-5 rounded-xl border space-y-2 text-xs font-mono shadow-inner"
                style={{
                  backgroundColor: 'var(--bg-card-elevated)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div className="flex justify-between py-1 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Reference Code:</span>
                  <strong style={{ color: 'var(--gold)' }}>{submittedEnquiry.id}</strong>
                </div>
                <div className="flex justify-between py-1 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Organization:</span>
                  <span style={{ color: 'var(--text-primary)' }}>{submittedEnquiry.companyName}</span>
                </div>
                <div className="flex justify-between py-1 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Contact Representative:</span>
                  <span style={{ color: 'var(--text-primary)' }}>{submittedEnquiry.fullName}</span>
                </div>
                <div className="flex justify-between py-1 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Commodity Sourcing:</span>
                  <span style={{ color: 'var(--text-primary)' }}>{submittedEnquiry.productName || 'Bespoke Sourcing'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span style={{ color: 'var(--text-muted)' }}>Volume Indicator:</span>
                  <span style={{ color: 'var(--text-primary)' }}>{submittedEnquiry.quantity}</span>
                </div>
              </div>

              <div 
                className="p-4 rounded-xl border text-xs flex items-start gap-2.5"
                style={{
                  backgroundColor: 'var(--bg-topbar)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-muted)',
                }}
              >
                <Clock className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                <span>
                  Target Turnaround: Our export desk responds with preliminary commercial terms, commodity availability, and harvest forecasts within 24 to 48 business hours.
                </span>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleStartNew}
                  className="btn-gold cursor-pointer"
                >
                  Submit Another Sourcing Enquiry
                </button>
              </div>
            </div>
          ) : (
            <div className="card-luxury p-8 sm:p-10 space-y-6">
              <div className="space-y-1">
                <span className="badge-pill mb-1">{t('contact.onlineDesk')}</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-medium" style={{ color: 'var(--text-primary)' }}>
                  {t('contact.formTitle')}
                </h2>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {t('contact.requiredNote')}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Dynamic Product Line / Requirement Dropdown */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold" style={{ color: 'var(--gold)' }}>
                      Product Line / Sourcing Requirement <span className="text-red-400">*</span>
                    </label>
                    <span className="text-[10px] font-mono" style={{ color: 'var(--text-dim)' }}>
                      {productLines.length} Options
                    </span>
                  </div>
                  <select
                    name="productId"
                    value={formData.productName || formData.productId}
                    onChange={handleProductSelect}
                    className="input-luxury"
                  >
                    <option value="">Select Product Line / Sourcing Requirement...</option>
                    {productLines.map((prod: any) => (
                      <option key={prod._id || prod.id || prod.name} value={prod.name}>
                        {prod.name} {prod.category ? `— [${prod.category}]` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Two Col: Name & Email */}
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
                      placeholder="purchasing@importers.com"
                      className={`input-luxury ${errors.businessEmail ? 'border-red-500' : ''}`}
                    />
                    {errors.businessEmail && <p className="text-red-400 text-[11px] mt-1">{errors.businessEmail}</p>}
                  </div>
                </div>

                {/* Two Col: Company & Country */}
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
                      placeholder="e.g. Global Foods Trading GmbH"
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
                      placeholder="e.g. Hamburg, Germany"
                      className={`input-luxury ${errors.country ? 'border-red-500' : ''}`}
                    />
                    {errors.country && <p className="text-red-400 text-[11px] mt-1">{errors.country}</p>}
                  </div>
                </div>

                {/* Two Col: Quantity & Contact Method */}
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
                      placeholder="e.g. 1 x 40ft FCL / 25 Metric Tons"
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

                {/* Phone field */}
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
                      placeholder="+49 40 123456"
                      className={`input-luxury ${errors.phone ? 'border-red-500' : ''}`}
                    />
                    {errors.phone && <p className="text-red-400 text-[11px] mt-1">{errors.phone}</p>}
                  </div>
                )}

                {/* Message */}
                <div>
                  <label className="block font-semibold mb-1" style={{ color: 'var(--gold)' }}>
                    {t('quoteModal.messageLabel')} <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Specify commodity specs, required harvest year, target Incoterms (FOB/CIF), discharge port, and packaging..."
                    className={`input-luxury ${errors.message ? 'border-red-500' : ''}`}
                  />
                  {errors.message && <p className="text-red-400 text-[11px] mt-1">{errors.message}</p>}
                </div>

                {/* Confidentiality Notice */}
                <div 
                  className="flex items-start gap-2.5 text-[11px] p-3.5 rounded-xl border"
                  style={{
                    backgroundColor: 'var(--bg-topbar)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-muted)',
                  }}
                >
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                  <span>
                    Your inquiry details are held under commercial export confidentiality. In compliance with DGFT & international export trade data practices.
                  </span>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-glass-morphism w-full py-3.5 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>{t('quoteModal.processing')}</span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-white" />
                        <span>{t('quoteModal.transmit')}</span>
                        <Send className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: Trade Desk Information */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card-luxury p-7 sm:p-8 space-y-6">
            <h3 className="font-serif text-2xl font-normal" style={{ color: 'var(--text-primary)' }}>
              Export Headquarters
            </h3>

            <div className="space-y-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex items-start gap-3">
                <Building2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                <div>
                  <strong className="block text-sm" style={{ color: 'var(--text-primary)' }}>{COMPANY_INFO.name}</strong>
                  <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Structure: {COMPANY_INFO.legalStructure} &bull; Origin: {COMPANY_INFO.country}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                <div>
                  <span className="block font-medium">International Trade Operations Desk</span>
                  <span className="block" style={{ color: 'var(--text-muted)' }}>
                    Primary Maritime Port: Nhava Sheva (JNPT), Maharashtra &bull; Mundra Port, Gujarat
                  </span>
                  <span className="block font-semibold" style={{ color: 'var(--gold)' }}>Republic of India</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                <div>
                  <span className="block" style={{ color: 'var(--text-muted)' }}>Export Operations Email:</span>
                  <a href={`mailto:${COMPANY_INFO.email}`} className="font-semibold hover:underline" style={{ color: 'var(--text-primary)' }}>
                    {COMPANY_INFO.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                <div>
                  <span className="block" style={{ color: 'var(--text-muted)' }}>International Desk Telephone:</span>
                  <span className="font-mono font-medium" style={{ color: 'var(--text-primary)' }}>{COMPANY_INFO.phone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                <div className="w-full">
                  <span className="block font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Official Web Gateways:</span>
                  <div className="flex flex-col gap-1.5 font-mono text-[11px]">
                    <a
                      href="https://ipmexim-import-export-frontend.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 hover:text-gold-champagne hover:underline transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block" />
                      <span>ipmexim-import-export-frontend.vercel.app</span>
                      <ExternalLink className="w-3 h-3 text-[#10B981]" />
                    </a>
                    <a
                      href="https://ipmexim-import-export.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 hover:text-gold-champagne hover:underline transition-colors opacity-85 hover:opacity-100"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block" />
                      <span>ipmexim-import-export.vercel.app</span>
                      <ExternalLink className="w-3 h-3 text-[#10B981]" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="pt-4 border-t space-y-2 text-xs" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
              <span className="block font-semibold uppercase tracking-wider text-[10px]" style={{ color: 'var(--gold)' }}>
                Desk Operational Hours
              </span>
              <p>Monday &ndash; Saturday: 09:00 &ndash; 19:00 IST (UTC+05:30)</p>
              <p className="text-[11px]">Emergency weekend shipments monitored 24/7 for active ocean FCL bills of lading.</p>
            </div>
          </div>

          {/* Accreditations Trust Panel */}
          <div 
            className="card-luxury p-6 space-y-4"
          >
            <span className="text-[10px] uppercase tracking-widest font-semibold block" style={{ color: 'var(--gold)' }}>
              Government Regulatory Compliance
            </span>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-topbar)', borderColor: 'var(--border-subtle)' }}>
                <span className="block font-bold text-sm" style={{ color: 'var(--gold)' }}>APEDA</span>
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Agri & Food Export Council</span>
              </div>
              <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-topbar)', borderColor: 'var(--border-subtle)' }}>
                <span className="block font-bold text-sm" style={{ color: 'var(--gold)' }}>FIEO</span>
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Fed. of Indian Export Orgs</span>
              </div>
              <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-topbar)', borderColor: 'var(--border-subtle)' }}>
                <span className="block font-bold text-sm" style={{ color: 'var(--gold)' }}>SPICES BOARD</span>
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Ministry of Commerce</span>
              </div>
              <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-topbar)', borderColor: 'var(--border-subtle)' }}>
                <span className="block font-bold text-sm" style={{ color: 'var(--gold)' }}>ISO 9001:2015</span>
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Certified Sourcing Protocol</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
