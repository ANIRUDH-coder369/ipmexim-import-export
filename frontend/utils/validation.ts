export interface EnquiryFormData {
  fullName: string;
  businessEmail: string;
  companyName: string;
  country: string;
  productId?: string;
  productName?: string;
  quantity: string;
  contactMethod: 'Email' | 'Phone' | 'WhatsApp';
  phone?: string;
  message: string;
}

export interface ValidationErrors {
  fullName?: string;
  businessEmail?: string;
  companyName?: string;
  country?: string;
  quantity?: string;
  phone?: string;
  message?: string;
}

export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
}

export function validateEnquiryForm(data: Partial<EnquiryFormData>): {
  isValid: boolean;
  errors: ValidationErrors;
} {
  const errors: ValidationErrors = {};

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Full name is required (minimum 2 characters).';
  }

  if (!data.businessEmail || !validateEmail(data.businessEmail)) {
    errors.businessEmail = 'Please provide a valid business email address.';
  }

  if (!data.companyName || data.companyName.trim().length < 2) {
    errors.companyName = 'Company / organization name is required.';
  }

  if (!data.country || data.country.trim().length < 2) {
    errors.country = 'Please specify destination or business country.';
  }

  if (!data.quantity || data.quantity.trim().length < 1) {
    errors.quantity = 'Please specify estimated quantity or container volume required.';
  }

  if (data.contactMethod === 'Phone' || data.contactMethod === 'WhatsApp') {
    if (!data.phone || data.phone.trim().length < 6) {
      errors.phone = 'Phone number with country code is required for Phone/WhatsApp contact.';
    }
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.message = 'Please provide specific product requirements or delivery terms (minimum 10 characters).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function generateEnquiryReference(prefix = 'IPM'): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${dateStr}-${randomSuffix}`;
}
