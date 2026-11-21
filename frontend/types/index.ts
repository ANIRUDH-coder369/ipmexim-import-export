export interface Product {
  id?: string;
  _id?: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  shortDescription: string;
  fullDescription: string;
  specifications: Record<string, string>;
  packagingOptions: string[];
  minimumOrderQuantity: string;
  origin: string;
  hsCode: string;
  imageUrls: string[];
  status: 'Available' | 'Made to Order' | 'Seasonal' | 'Sample on Request';
  featured?: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  count?: number;
}

export interface EnquirySubmission {
  id: string;
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
  createdAt: string;
  status: 'Pending' | 'Under Review' | 'Quoted';
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  keyBenefits: string[];
  deliverables: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Products' | 'Quality' | 'Packaging' | 'Logistics';
  imageUrl: string;
  caption: string;
}
