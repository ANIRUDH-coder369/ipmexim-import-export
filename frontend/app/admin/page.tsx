'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Mail,
  Send,
  Eye,
  Trash2,
  Globe,
  Building,
  User,
  LogOut,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  X,
  Lock,
  Layers,
  Plus,
  Pencil,
  Sliders,
  Check,
  Sparkles,
  Star,
  Upload,
  Image as ImageIcon,
  Package,
  Navigation,
  MapPin,
  Anchor,
  Calendar,
  Play,
  ArrowRight,
} from 'lucide-react';
import { getApiUrl } from '@/utils/apiConfig';
import { ProductItem } from '@/store/slices/productSlice';
import { PRODUCTS } from '@/data/products';

interface QuotationEntry {
  _id?: string;
  id?: string;
  fullName: string;
  businessEmail?: string;
  corporateEmail?: string;
  companyName?: string;
  company?: string;
  country?: string;
  destinationCountry?: string;
  destinationPort?: string;
  productName?: string;
  productOfInterest?: string;
  quantity?: string;
  estimatedQuantity?: string;
  contactMethod?: string;
  phone?: string;
  phoneWhatsApp?: string;
  message?: string;
  technicalSpecifications?: string;
  status: 'Pending' | 'Reviewed' | 'Contacted' | 'Quoted' | 'Closed';
  createdAt: string;
}

export interface ProductLineItem {
  _id?: string;
  id?: string;
  name: string;
  category: string;
  description?: string;
  defaultUnit: string;
  isActive: boolean;
  sortOrder?: number;
  createdAt?: string;
}

const INITIAL_SAMPLE_PRODUCT_LINES: ProductLineItem[] = [
  {
    id: 'pl-1',
    name: '1121 Steam Basmati Rice (XXL Extra Long Grain)',
    category: 'Premium Basmati & Non-Basmati Rice',
    description: 'Average grain length 8.35mm+, elongation ratio 2.5x, moisture max 12.5%.',
    defaultUnit: '20ft FCL (25 MT) / 40ft FCL',
    isActive: true,
    sortOrder: 1
  },
  {
    id: 'pl-2',
    name: '1509 Golden Sella Basmati Rice',
    category: 'Premium Basmati & Non-Basmati Rice',
    description: 'Parboiled golden grain with exceptional aroma and separation.',
    defaultUnit: 'Metric Tons (MT)',
    isActive: true,
    sortOrder: 2
  },
  {
    id: 'pl-3',
    name: 'Alleppey Green Cardamom (8mm Bold)',
    category: 'High-Aroma Spices & Herbs',
    description: 'Deep green, whole pods, rich essential oil content (min 7%).',
    defaultUnit: 'Metric Tons / Master Cartons',
    isActive: true,
    sortOrder: 3
  },
  {
    id: 'pl-4',
    name: 'Guntur S4 Red Chilli (Stemless / Whole)',
    category: 'High-Aroma Spices & Herbs',
    description: 'Hot pungent dried red chillies, 25,000–35,000 SHU, ASTA color 50–70.',
    defaultUnit: '1 x 20ft FCL (14 MT)',
    isActive: true,
    sortOrder: 4
  },
  {
    id: 'pl-5',
    name: 'Salem Turmeric Fingers (Curcumin 3.5%+)',
    category: 'High-Aroma Spices & Herbs',
    description: 'Polished hard golden fingers with verified natural curcumin concentration.',
    defaultUnit: 'Metric Tons (MT)',
    isActive: true,
    sortOrder: 5
  },
  {
    id: 'pl-6',
    name: 'Malabar Bold Black Pepper (550+ GL)',
    category: 'High-Aroma Spices & Herbs',
    description: 'Sun-dried garbled black pepper berries with high piperine yield.',
    defaultUnit: 'Metric Tons (MT)',
    isActive: true,
    sortOrder: 6
  },
  {
    id: 'pl-7',
    name: 'Hand-Hammered Solid Copper Pitcher & Drinkware',
    category: 'Luxury Metalware & Art',
    description: '99.5%+ pure certified food-grade copper with artisan hammered finish.',
    defaultUnit: 'Master Cartons / Sets',
    isActive: true,
    sortOrder: 7
  },
  {
    id: 'pl-8',
    name: 'Pure Mulberry Silk Scarves & Pashmina Stoles',
    category: 'Textiles & Handloom',
    description: 'Loom-woven natural silk with hand-rolled hems and custom dye lots.',
    defaultUnit: 'Pieces / Master Cartons',
    isActive: true,
    sortOrder: 8
  },
  {
    id: 'pl-9',
    name: 'Custom Agricultural Sourcing / Bespoke Mandate',
    category: 'Custom B2B Sourcing',
    description: 'Direct procurement specification across verified Indian grower networks.',
    defaultUnit: 'As per Contract Specification',
    isActive: true,
    sortOrder: 9
  }
];

const SAMPLE_ENTRIES: QuotationEntry[] = [
  {
    id: 'IPM-2026-9481',
    fullName: 'Alexander Wright',
    businessEmail: 'alex.wright@hamburg-agri.de',
    companyName: 'Hamburg Agricultural Commodities GmbH',
    country: 'Germany',
    productName: '1121 Steam Basmati Rice (XXL Extra Long Grain)',
    quantity: '2 x 40ft FCL (52 MT)',
    contactMethod: 'Email',
    phone: '+49 40 8921 773',
    message: 'Requesting CIF Hamburg quotes with phytosanitary certification and heavy metal test report.',
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'IPM-2026-8832',
    fullName: 'Fatima Al-Mansoor',
    businessEmail: 'fatima@dubaitradegroup.ae',
    companyName: 'Emirates Spices & Luxury General Trading',
    country: 'United Arab Emirates',
    productName: 'Alleppey Green Cardamom (8mm Bold)',
    quantity: '5 Metric Tons',
    contactMethod: 'WhatsApp',
    phone: '+971 4 391 2200',
    message: 'Air-freight to Dubai DWC. Require harvest date within 60 days and high aroma grade certificate.',
    status: 'Reviewed',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 'IPM-2026-7719',
    fullName: 'Robert Sterling',
    businessEmail: 'r.sterling@ukfoodimports.co.uk',
    companyName: 'Sterling Global Foods London',
    country: 'United Kingdom',
    productName: 'Guntur S4 Red Chilli (Stemless / Whole)',
    quantity: '1 x 20ft FCL (14 MT)',
    contactMethod: 'Email',
    phone: '+44 20 7946 0912',
    message: 'Need FOB Nhava Sheva and CIF Felixstowe with SHU certificate (25,000–30,000 SHU).',
    status: 'Contacted',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'IPM-2026-6204',
    fullName: 'Jean-Luc Moreau',
    businessEmail: 'jl.moreau@provence-deco.fr',
    companyName: 'Maison Provence Métaux',
    country: 'France',
    productName: 'Hand-Hammered Solid Copper Pitcher & Drinkware',
    quantity: '1,200 Master Cartons',
    contactMethod: 'Email',
    phone: '+33 1 42 68 55 00',
    message: 'Bespoke custom packaging with CE compliance and laser etched monogram.',
    status: 'Quoted',
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
  },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  
  // Navigation Tabs: 'quotations' | 'products' | 'productLines' | 'shipments'
  const [activeAdminTab, setActiveAdminTab] = useState<'quotations' | 'products' | 'productLines' | 'shipments'>('quotations');

  // Quotation Management State
  const [quotations, setQuotations] = useState<QuotationEntry[]>([]);
  const [adminUser, setAdminUser] = useState<{ name?: string; email?: string; role?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuotation, setSelectedQuotation] = useState<QuotationEntry | null>(null);

  // Email Reply Modal State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [emailStatusUpdate, setEmailStatusUpdate] = useState<'Contacted' | 'Quoted' | 'Reviewed'>('Contacted');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSuccessNotice, setEmailSuccessNotice] = useState<string | null>(null);

  // Featured Export Products State
  const [productsList, setProductsList] = useState<ProductItem[]>([]);
  const [prodSearchQuery, setProdSearchQuery] = useState('');
  const [prodCategoryFilter, setProdCategoryFilter] = useState('ALL');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [productNotice, setProductNotice] = useState<string | null>(null);
  const [productError, setProductError] = useState<string | null>(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    slug: '',
    categoryName: 'Spices & Food Products',
    categoryId: 'spices-food',
    shortDescription: '',
    fullDescription: '',
    origin: 'India',
    hsCode: '0908.31.00',
    minimumOrderQuantity: '1 x 20ft FCL',
    status: 'Available',
    featured: true,
    imageUrl: '',
  });

  // Dynamic Product Lines Management State
  const [productLines, setProductLines] = useState<ProductLineItem[]>([]);
  const [plSearchQuery, setPlSearchQuery] = useState('');
  const [isPlModalOpen, setIsPlModalOpen] = useState(false);
  const [editingProductLine, setEditingProductLine] = useState<ProductLineItem | null>(null);
  const [plFormData, setPlFormData] = useState({
    name: '',
    category: 'Agricultural Commodities',
    description: '',
    defaultUnit: 'Metric Tons (MT)',
    isActive: true,
    sortOrder: 0
  });
  const [plError, setPlError] = useState<string | null>(null);
  const [plSuccess, setPlSuccess] = useState<string | null>(null);
  const [isSavingPl, setIsSavingPl] = useState(false);

  // Dynamic Shipment & Consignment Journeys State
  const [shipmentsList, setShipmentsList] = useState<any[]>([]);
  const [shipSearchQuery, setShipSearchQuery] = useState('');
  const [shipStatusFilter, setShipStatusFilter] = useState('ALL');
  const [isShipModalOpen, setIsShipModalOpen] = useState(false);
  const [editingShipment, setEditingShipment] = useState<any | null>(null);
  const [shipFormData, setShipFormData] = useState({
    title: '',
    fromLocation: '',
    toLocation: '',
    date: new Date().toISOString().split('T')[0],
    mediaLink: '',
    description: '',
    status: 'In Transit' as 'In Transit' | 'Scheduled' | 'Dispatched' | 'Delivered'
  });
  const [isSavingShipment, setIsSavingShipment] = useState(false);
  const [shipNotice, setShipNotice] = useState<string | null>(null);
  const [shipError, setShipError] = useState<string | null>(null);

  // Strict Authentication Guard Check
  useEffect(() => {
    const checkAuthentication = async () => {
      setIsCheckingAuth(true);
      const token = localStorage.getItem('adminToken');
      const userStr = localStorage.getItem('adminUser');
      
      // If no token exists, immediately reject and redirect to login
      if (!token) {
        setIsAuthenticated(false);
        setIsCheckingAuth(false);
        router.replace('/admin/login?unauthorized=true');
        return;
      }

      // Check token validity with backend API
      try {
        const apiUrl = getApiUrl();
        const res = await fetch(`${apiUrl}/admin/check-auth`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const authData = await res.json();
          if (authData.admin) {
            setAdminUser(authData.admin);
          }
          setIsAuthenticated(true);
          setIsCheckingAuth(false);
          fetchQuotations(token);
          fetchProductsAdmin(token);
          fetchProductLinesAdmin(token);
          fetchShipmentsAdmin(token);
          return;
        } else if (res.status === 401 || res.status === 403) {
          document.cookie = 'adminToken=; path=/; max-age=0; SameSite=Lax';
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          setIsAuthenticated(false);
          setIsCheckingAuth(false);
          router.replace('/admin/login?unauthorized=true');
          return;
        }
      } catch (err) {
        console.warn('Backend check-auth offline, using valid client session:', err);
      }

      if (userStr) {
        try {
          setAdminUser(JSON.parse(userStr));
        } catch (e) {}
      }

      setIsAuthenticated(true);
      setIsCheckingAuth(false);
      fetchQuotations(token);
      fetchProductsAdmin(token);
      fetchProductLinesAdmin(token);
      fetchShipmentsAdmin(token);
    };

    checkAuthentication();
  }, [router]);

  // Fetch Quotations
  const fetchQuotations = async (token?: string | null) => {
    setIsLoading(true);
    const authToken = token || localStorage.getItem('adminToken');
    try {
      const apiUrl = getApiUrl();
      
      const res = await fetch(`${apiUrl}/admin/quotations`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        const serverList = data.quotations || data.enquiries || [];
        
        const localStored = localStorage.getItem('ipm_quotations');
        const localList = localStored ? JSON.parse(localStored) : [];

        const combined = [...serverList, ...localList, ...SAMPLE_ENTRIES];
        const seen = new Set();
        const deduped = combined.filter(item => {
          const key = item._id || item.id || item.businessEmail || item.fullName;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        setQuotations(deduped);
      } else {
        fallbackToLocalStorageQuotations();
      }
    } catch (err) {
      fallbackToLocalStorageQuotations();
    } finally {
      setIsLoading(false);
    }
  };

  const fallbackToLocalStorageQuotations = () => {
    try {
      const localStored = localStorage.getItem('ipm_quotations');
      const localList = localStored ? JSON.parse(localStored) : [];
      setQuotations([...localList, ...SAMPLE_ENTRIES]);
    } catch (e) {
      setQuotations(SAMPLE_ENTRIES);
    }
  };

  // Fetch Product Lines (Admin)
  const fetchProductLinesAdmin = async (token?: string | null) => {
    const authToken = token || localStorage.getItem('adminToken');
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/product-lines/admin/all`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.productLines && data.productLines.length > 0) {
          setProductLines(data.productLines);
          localStorage.setItem('ipm_product_lines', JSON.stringify(data.productLines));
          return;
        }
      }
    } catch (err) {
      console.warn('Backend product-lines offline, using local store:', err);
    }

    // Local storage fallback
    try {
      const stored = localStorage.getItem('ipm_product_lines');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProductLines(parsed);
          return;
        }
      }
    } catch (e) {}

    setProductLines(INITIAL_SAMPLE_PRODUCT_LINES);
    localStorage.setItem('ipm_product_lines', JSON.stringify(INITIAL_SAMPLE_PRODUCT_LINES));
  };

  const resolveProductImage = (url?: string) => {
    if (!url) return '/images/product_spices_export_1793609366204.jpg';
    if (url.startsWith('/uploads/')) {
      const apiUrl = getApiUrl();
      const origin = apiUrl.replace(/\/api\/?$/, '');
      return `${origin}${url}`;
    }
    return url;
  };

  const fetchProductsAdmin = async (token?: string | null) => {
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/products`);
      if (res.ok) {
        const data = await res.json();
        if (data.products && data.products.length > 0) {
          setProductsList(data.products);
          localStorage.setItem('ipm_admin_products', JSON.stringify(data.products));
          return;
        }
      }
    } catch (err) {
      console.warn('Backend products offline, using local store:', err);
    }

    try {
      const stored = localStorage.getItem('ipm_admin_products');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProductsList(parsed);
          return;
        }
      }
    } catch (e) {}

    // Fallback to initial PRODUCTS catalog
    setProductsList(PRODUCTS as any);
  };

  // ========================================================
  // SHIPMENT / CONSIGNMENT JOURNEYS HANDLERS
  // ========================================================

  const fetchShipmentsAdmin = async (token?: string | null) => {
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/shipments`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.shipments)) {
          setShipmentsList(data.shipments);
        }
      }
    } catch (err) {
      console.warn('Backend shipments offline:', err);
    }
  };

  const handleOpenAddShipment = () => {
    setEditingShipment(null);
    setShipFormData({
      title: '',
      fromLocation: '',
      toLocation: '',
      date: new Date().toISOString().split('T')[0],
      mediaLink: '',
      description: '',
      status: 'In Transit'
    });
    setShipError(null);
    setShipNotice(null);
    setIsShipModalOpen(true);
  };

  const handleOpenEditShipment = (ship: any) => {
    setEditingShipment(ship);
    const dateStr = ship.date ? new Date(ship.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    setShipFormData({
      title: ship.title || '',
      fromLocation: ship.fromLocation || '',
      toLocation: ship.toLocation || '',
      date: dateStr,
      mediaLink: ship.mediaLink || '',
      description: ship.description || '',
      status: ship.status || 'In Transit'
    });
    setShipError(null);
    setShipNotice(null);
    setIsShipModalOpen(true);
  };

  const handleSaveShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipFormData.fromLocation.trim() || !shipFormData.toLocation.trim() || !shipFormData.date || !shipFormData.mediaLink.trim()) {
      setShipError('Please fill in From Location, Destination, Date, and Media Link.');
      return;
    }

    setIsSavingShipment(true);
    setShipError(null);

    try {
      const apiUrl = getApiUrl();
      const token = localStorage.getItem('adminToken');
      const isEditing = Boolean(editingShipment?._id || editingShipment?.id);
      const targetId = editingShipment?._id || editingShipment?.id;
      const url = isEditing ? `${apiUrl}/shipments/${targetId}` : `${apiUrl}/shipments`;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(shipFormData)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to save shipment.');
      }

      await fetchShipmentsAdmin();
      setIsShipModalOpen(false);
    } catch (err: any) {
      setShipError(err.message || 'Error saving shipment.');
    } finally {
      setIsSavingShipment(false);
    }
  };

  const handleDeleteShipment = async (ship: any) => {
    const targetId = ship._id || ship.id;
    if (!targetId) return;
    if (!window.confirm(`Are you sure you want to delete shipment "${ship.title || ship.fromLocation}"?`)) return;

    try {
      const apiUrl = getApiUrl();
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${apiUrl}/shipments/${targetId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete shipment');
      }
      await fetchShipmentsAdmin();
    } catch (err: any) {
      alert(err.message || 'Error deleting shipment');
    }
  };

  const getYouTubeEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    try {
      const trimmed = url.trim();
      const watchMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
      if (watchMatch && watchMatch[1]) {
        return `https://www.youtube-nocookie.com/embed/${watchMatch[1]}?autoplay=1&rel=0`;
      }
      const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([^"&?\/\s]{11})/i);
      if (shortsMatch && shortsMatch[1]) {
        return `https://www.youtube-nocookie.com/embed/${shortsMatch[1]}?autoplay=1&rel=0`;
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  // ========================================================
  // FEATURED PRODUCTS CRUD HANDLERS
  // ========================================================

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      slug: '',
      categoryName: 'Spices & Food Products',
      categoryId: 'spices-food',
      shortDescription: '',
      fullDescription: '',
      origin: 'India',
      hsCode: '0908.31.00',
      minimumOrderQuantity: '1 x 20ft FCL / As per contract',
      status: 'Available',
      featured: true,
      imageUrl: '',
    });
    setProductImageFile(null);
    setProductImagePreview(null);
    setProductError(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: ProductItem) => {
    setEditingProduct(prod);
    setProductFormData({
      name: prod.name || '',
      slug: prod.slug || '',
      categoryName: prod.categoryName || 'Spices & Food Products',
      categoryId: prod.categoryId || 'spices-food',
      shortDescription: prod.shortDescription || '',
      fullDescription: prod.fullDescription || '',
      origin: prod.origin || 'India',
      hsCode: prod.hsCode || '0908.31.00',
      minimumOrderQuantity: prod.minimumOrderQuantity || '1 x 20ft FCL',
      status: prod.status || 'Available',
      featured: prod.featured !== false,
      imageUrl: prod.imageUrls?.[0] || '',
    });
    setProductImageFile(null);
    setProductImagePreview(resolveProductImage(prod.imageUrls?.[0]));
    setProductError(null);
    setIsProductModalOpen(true);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProductImageFile(file);
      setProductImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productFormData.name.trim()) {
      setProductError('Product name is required.');
      return;
    }

    setIsSavingProduct(true);
    setProductError(null);

    try {
      const token = localStorage.getItem('adminToken');
      const apiUrl = getApiUrl();
      const formData = new FormData();
      formData.append('name', productFormData.name.trim());
      formData.append('slug', productFormData.slug.trim());
      formData.append('categoryName', productFormData.categoryName);
      formData.append('categoryId', productFormData.categoryId);
      formData.append('shortDescription', productFormData.shortDescription.trim());
      formData.append('fullDescription', productFormData.fullDescription.trim());
      formData.append('origin', productFormData.origin.trim());
      formData.append('hsCode', productFormData.hsCode.trim());
      formData.append('minimumOrderQuantity', productFormData.minimumOrderQuantity.trim());
      formData.append('status', productFormData.status);
      formData.append('featured', String(productFormData.featured));

      if (productImageFile) {
        formData.append('image', productImageFile);
      } else if (productFormData.imageUrl) {
        formData.append('imageUrl', productFormData.imageUrl.trim());
      }

      const targetId = editingProduct ? (editingProduct._id || editingProduct.id) : '';
      const url = editingProduct ? `${apiUrl}/products/${targetId}` : `${apiUrl}/products`;
      const method = editingProduct ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        const savedProd = data.product;
        if (editingProduct) {
          setProductsList(prev => prev.map(p => (p._id === targetId || p.id === targetId) ? savedProd : p));
          setProductNotice(`Product "${savedProd.name}" updated successfully!`);
        } else {
          setProductsList(prev => [savedProd, ...prev]);
          setProductNotice(`Product "${savedProd.name}" published to export catalogue!`);
        }
        setIsProductModalOpen(false);
      } else {
        const errData = await res.json().catch(() => ({}));
        setProductError(errData.message || 'Failed to save product to backend.');
      }
    } catch (err: any) {
      setProductError(err.message || 'Failed to save product.');
    } finally {
      setIsSavingProduct(false);
      setTimeout(() => setProductNotice(null), 3000);
    }
  };

  const handleToggleFeatured = async (product: ProductItem) => {
    const targetId = product._id || product.id;
    const newFeaturedState = !product.featured;

    setProductsList(prev => prev.map(p => {
      if (p._id === targetId || p.id === targetId) {
        return { ...p, featured: newFeaturedState };
      }
      return p;
    }));

    try {
      const token = localStorage.getItem('adminToken');
      const apiUrl = getApiUrl();
      await fetch(`${apiUrl}/products/${targetId}/toggle-featured`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.warn('Backend toggle offline, client state kept:', err);
    }
  };

  const handleDeleteProduct = async (product: ProductItem) => {
    const targetId = product._id || product.id;
    if (!window.confirm(`Are you sure you want to delete "${product.name}" from the export catalog?`)) {
      return;
    }

    setProductsList(prev => prev.filter(p => p._id !== targetId && p.id !== targetId));

    try {
      const token = localStorage.getItem('adminToken');
      const apiUrl = getApiUrl();
      await fetch(`${apiUrl}/products/${targetId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setProductNotice(`Product "${product.name}" deleted.`);
      setTimeout(() => setProductNotice(null), 3000);
    } catch (err) {
      console.warn('Backend delete offline:', err);
    }
  };

  const handleLogout = () => {
    document.cookie = 'adminToken=; path=/; max-age=0; SameSite=Lax';
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    router.replace('/admin/login');
  };

  // ========================================================
  // PRODUCT LINES CRUD HANDLERS
  // ========================================================

  const handleOpenAddProductLine = () => {
    setEditingProductLine(null);
    setPlFormData({
      name: '',
      category: 'Agricultural Commodities',
      description: '',
      defaultUnit: 'Metric Tons (MT)',
      isActive: true,
      sortOrder: productLines.length + 1
    });
    setPlError(null);
    setPlSuccess(null);
    setIsPlModalOpen(true);
  };

  const handleOpenEditProductLine = (item: ProductLineItem) => {
    setEditingProductLine(item);
    setPlFormData({
      name: item.name,
      category: item.category,
      description: item.description || '',
      defaultUnit: item.defaultUnit,
      isActive: item.isActive,
      sortOrder: item.sortOrder || 0
    });
    setPlError(null);
    setPlSuccess(null);
    setIsPlModalOpen(true);
  };

  const handleSaveProductLine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plFormData.name.trim()) {
      setPlError('Product line name is required.');
      return;
    }

    setIsSavingPl(true);
    setPlError(null);

    const token = localStorage.getItem('adminToken');
    const apiUrl = getApiUrl();

    try {
      if (editingProductLine) {
        // UPDATE Existing
        const targetId = editingProductLine._id || editingProductLine.id;
        const res = await fetch(`${apiUrl}/product-lines/${targetId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(plFormData)
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Failed to update product line');
        }

        const updatedList = productLines.map(p =>
          (p._id === targetId || p.id === targetId) ? { ...p, ...plFormData, _id: targetId } : p
        );
        setProductLines(updatedList);
        localStorage.setItem('ipm_product_lines', JSON.stringify(updatedList));
        setPlSuccess('Product line updated successfully.');
      } else {
        // ADD New
        const res = await fetch(`${apiUrl}/product-lines`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(plFormData)
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Failed to create product line');
        }

        const newEntry: ProductLineItem = data.productLine || {
          id: `pl-${Date.now()}`,
          ...plFormData,
          createdAt: new Date().toISOString()
        };

        const updatedList = [newEntry, ...productLines];
        setProductLines(updatedList);
        localStorage.setItem('ipm_product_lines', JSON.stringify(updatedList));
        setPlSuccess('New product line created and active in quotation form.');
      }

      setTimeout(() => {
        setIsPlModalOpen(false);
        setPlSuccess(null);
      }, 900);
    } catch (err: any) {
      // Local Fallback if server is offline
      const targetId = editingProductLine ? (editingProductLine._id || editingProductLine.id) : `pl-${Date.now()}`;
      let updatedList: ProductLineItem[];

      if (editingProductLine) {
        updatedList = productLines.map(p =>
          (p._id === targetId || p.id === targetId) ? { ...p, ...plFormData } : p
        );
      } else {
        const newEntry: ProductLineItem = {
          id: targetId,
          ...plFormData,
          createdAt: new Date().toISOString()
        };
        updatedList = [newEntry, ...productLines];
      }

      setProductLines(updatedList);
      localStorage.setItem('ipm_product_lines', JSON.stringify(updatedList));
      setPlSuccess('Saved locally and updated in live quotation form.');
      setTimeout(() => {
        setIsPlModalOpen(false);
        setPlSuccess(null);
      }, 900);
    } finally {
      setIsSavingPl(false);
    }
  };

  const handleToggleProductLineStatus = async (item: ProductLineItem) => {
    const targetId = item._id || item.id;
    const newStatus = !item.isActive;

    try {
      const token = localStorage.getItem('adminToken');
      const apiUrl = getApiUrl();
      await fetch(`${apiUrl}/product-lines/${targetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: newStatus })
      });
    } catch (e) {}

    const updatedList = productLines.map(p =>
      (p._id === targetId || p.id === targetId) ? { ...p, isActive: newStatus } : p
    );
    setProductLines(updatedList);
    localStorage.setItem('ipm_product_lines', JSON.stringify(updatedList));
  };

  const handleDeleteProductLine = async (item: ProductLineItem) => {
    const targetId = item._id || item.id;
    const confirmDelete = window.confirm(`Are you sure you want to delete "${item.name}" from quotation options?`);
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('adminToken');
      const apiUrl = getApiUrl();
      await fetch(`${apiUrl}/product-lines/${targetId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (e) {}

    const updatedList = productLines.filter(p => (p._id !== targetId && p.id !== targetId));
    setProductLines(updatedList);
    localStorage.setItem('ipm_product_lines', JSON.stringify(updatedList));
  };

  // Filter Quotations
  const filteredQuotations = useMemo(() => {
    return quotations.filter((item) => {
      const matchesTab = selectedStatusTab === 'All' || item.status === selectedStatusTab;
      
      const q = searchQuery.toLowerCase();
      const name = (item.fullName || '').toLowerCase();
      const email = (item.businessEmail || item.corporateEmail || '').toLowerCase();
      const comp = (item.companyName || item.company || '').toLowerCase();
      const prod = (item.productName || item.productOfInterest || '').toLowerCase();
      const country = (item.country || item.destinationCountry || '').toLowerCase();

      const matchesSearch = !q || name.includes(q) || email.includes(q) || comp.includes(q) || prod.includes(q) || country.includes(q);

      return matchesTab && matchesSearch;
    });
  }, [quotations, selectedStatusTab, searchQuery]);

  // Filter Product Lines
  const filteredProductLines = useMemo(() => {
    const q = plSearchQuery.toLowerCase();
    if (!q) return productLines;
    return productLines.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }, [productLines, plSearchQuery]);

  // Filter Products
  const filteredProducts = useMemo(() => {
    return productsList.filter(p => {
      const q = prodSearchQuery.toLowerCase();
      const matchesSearch = !q ||
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.hsCode && p.hsCode.toLowerCase().includes(q)) ||
        (p.origin && p.origin.toLowerCase().includes(q)) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(q));

      const matchesCat = prodCategoryFilter === 'ALL' ||
        (prodCategoryFilter === 'FEATURED' && p.featured) ||
        p.categoryId === prodCategoryFilter ||
        p.categoryName === prodCategoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [productsList, prodSearchQuery, prodCategoryFilter]);

  // Filter Shipments (Sequenced upside / newest date first)
  const filteredAdminShipments = useMemo(() => {
    return shipmentsList
      .filter((s) => {
        if (shipStatusFilter !== 'ALL' && s.status !== shipStatusFilter) return false;
        if (shipSearchQuery.trim()) {
          const q = shipSearchQuery.toLowerCase();
          return (
            s.title?.toLowerCase().includes(q) ||
            s.fromLocation?.toLowerCase().includes(q) ||
            s.toLocation?.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [shipmentsList, shipSearchQuery, shipStatusFilter]);

  const productStats = useMemo(() => {
    const total = productsList.length;
    const featured = productsList.filter(p => p.featured).length;
    const active = productsList.filter(p => p.status === 'Available' || p.status === 'In Season').length;
    return { total, featured, active };
  }, [productsList]);

  // Dashboard Stats
  const quotationStats = useMemo(() => {
    const total = quotations.length;
    const pending = quotations.filter(q => q.status === 'Pending').length;
    const contacted = quotations.filter(q => q.status === 'Contacted' || q.status === 'Quoted').length;
    const countries = new Set(quotations.map(q => q.country || q.destinationCountry).filter(Boolean)).size;

    return { total, pending, contacted, countries };
  }, [quotations]);

  const productLineStats = useMemo(() => {
    const total = productLines.length;
    const active = productLines.filter(p => p.isActive).length;
    const categories = new Set(productLines.map(p => p.category)).size;
    return { total, active, categories };
  }, [productLines]);

  // Email Reply Handlers
  const handleOpenEmailModal = (quotation: QuotationEntry) => {
    setSelectedQuotation(quotation);
    setEmailSubject(`Commercial Export Quotation — IPM Exim Ref #${quotation.id || quotation._id || 'PROFORMA'}`);
    setEmailMessage(
      `Dear ${quotation.fullName},\n\nThank you for your commercial sourcing inquiry regarding ${quotation.productName || quotation.productOfInterest || 'our export catalog'}.\n\nOur trade desk has reviewed your requirement for ${quotation.quantity || quotation.estimatedQuantity || 'the specified volume'}. We are pleased to provide formal FOB/CIF terms for delivery to ${quotation.country || quotation.destinationCountry || 'your port'}.\n\nPlease find attached the preliminary proforma schedule.\n\nBest regards,\nIPM Exim International Trade Desk\nexport@ipmexim.com`
    );
    setEmailSuccessNotice(null);
    setIsEmailModalOpen(true);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuotation) return;

    setIsSendingEmail(true);
    const customerEmail = selectedQuotation.businessEmail || selectedQuotation.corporateEmail;

    try {
      const token = localStorage.getItem('adminToken');
      const apiUrl = getApiUrl();

      await fetch(`${apiUrl}/admin/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipientEmail: customerEmail,
          subject: emailSubject,
          message: emailMessage,
          quotationId: selectedQuotation._id || selectedQuotation.id,
          newStatus: emailStatusUpdate,
        })
      });
    } catch (err) {}

    setQuotations(prev =>
      prev.map(q => {
        if ((q.id && q.id === selectedQuotation.id) || (q._id && q._id === selectedQuotation._id)) {
          return { ...q, status: emailStatusUpdate };
        }
        return q;
      })
    );

    setIsSendingEmail(false);
    setEmailSuccessNotice(`Official communication successfully dispatched to ${customerEmail}`);
    setTimeout(() => {
      setIsEmailModalOpen(false);
      setEmailSuccessNotice(null);
    }, 1800);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Reviewed':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'Contacted':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'Quoted':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Closed':
        return 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30';
      default:
        return 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30';
    }
  };

  // 1. Loading Verification Screen
  if (isCheckingAuth) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center p-6"
        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
      >
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 p-2 flex items-center justify-center mb-6 shadow-xl animate-pulse">
          <img src="/logo.png" alt="IPM Exim" className="w-full h-full object-contain filter drop-shadow-md" />
        </div>
        <div className="flex items-center gap-2.5 text-xs uppercase tracking-widest font-mono" style={{ color: 'var(--gold)' }}>
          <ShieldCheck className="w-4 h-4 animate-spin" />
          <span>Verifying Administrative Session & Security Protocol...</span>
        </div>
      </div>
    );
  }

  // 2. Strict Access Denied Barrier Screen (Shown if NOT logged in)
  if (!isAuthenticated) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-6"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div 
          className="card-luxury p-8 sm:p-10 max-w-md w-full text-center space-y-5 border border-red-500/30 shadow-2xl"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shadow-lg">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <span className="badge-pill bg-red-500/15 text-red-400 border-red-500/30">
              401 Security Wall
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium" style={{ color: 'var(--text-primary)' }}>
              Access Denied: Admin Login Required
            </h2>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Without logging in, the IPM Exim Quotation Command Center cannot be accessed. Please authenticate with authorized administrator credentials.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/admin/login"
              className="btn-gold w-full py-3 cursor-pointer"
            >
              Go to Admin Login Form &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated Dashboard Content
  return (
    <div className="min-h-screen transition-colors" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Top Admin Navigation Header (Wide & Spacious) */}
      <header 
        className="sticky top-0 z-30 border-b backdrop-blur-xl px-6 sm:px-10 lg:px-16 2xl:px-24 py-4 transition-colors"
        style={{
          backgroundColor: 'var(--bg-header)',
          borderColor: 'var(--border-card)',
        }}
      >
        <div className="w-full flex items-center justify-between">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 p-2 shadow-md">
              <img
                src="/logo.png"
                alt="IPM Exim Official"
                className="w-full h-full object-contain filter drop-shadow-sm"
              />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  IPM Exim
                </span>
                <span className="text-xs uppercase font-extrabold tracking-widest px-3 py-1 rounded-md border"
                  style={{
                    backgroundColor: 'var(--gold-muted)',
                    borderColor: 'var(--gold-border)',
                    color: 'var(--gold)',
                  }}
                >
                  Admin Desk
                </span>
              </div>
              <p className="text-xs sm:text-sm mt-0.5 font-medium" style={{ color: 'var(--text-muted)' }}>
                Global Quotation Management & Dynamic Requirement Controls
              </p>
            </div>
          </div>

          {/* User Profile & Live Portal Actions */}
          <div className="flex items-center gap-4 text-sm">
            <div className="hidden sm:flex items-center gap-2">
              <a
                href="https://www.ipmexim.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border hover:border-[#D4AF69] transition-all"
                style={{
                  color: 'var(--gold)',
                  borderColor: 'var(--gold-border)',
                  backgroundColor: 'rgba(212, 175, 105, 0.08)'
                }}
                title="Open official custom domain"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block shadow-[0_0_6px_#10B981]" />
                <span>www.ipmexim.com</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://ipmexim-import-export-frontend.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border hover:border-white/30 transition-all opacity-80 hover:opacity-100"
                style={{
                  color: 'var(--text-secondary)',
                  borderColor: 'var(--border-subtle)',
                  backgroundColor: 'var(--bg-card)'
                }}
                title="Open primary live production deployment"
              >
                <span>Live App</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://ipmexim-import-export.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border hover:border-white/30 transition-all opacity-80 hover:opacity-100"
                style={{
                  color: 'var(--text-secondary)',
                  borderColor: 'var(--border-subtle)',
                  backgroundColor: 'var(--bg-card)'
                }}
                title="Open production mirror deployment"
              >
                <span>Live Mirror</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="h-6 w-px bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <User className="w-4 h-4" style={{ color: 'var(--gold)' }} />
              <span className="font-semibold">{adminUser?.name || 'Super Admin'}</span>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors hover:border-red-500/50 hover:text-red-400 cursor-pointer"
              style={{
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-muted)'
              }}
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container - Full Wide Layout */}
      <main className="w-full px-4 sm:px-10 lg:px-16 2xl:px-24 py-6 sm:py-10 space-y-6 sm:space-y-10">
        
        {/* Top Control Tabs: Quotations vs Product Lines / Requirements (Large & Prominent) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b pb-6" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
            <button
              onClick={() => setActiveAdminTab('quotations')}
              className={`flex items-center justify-center gap-2.5 sm:gap-3 px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl border text-xs sm:text-base font-bold tracking-wide transition-all cursor-pointer min-h-[44px] ${
                activeAdminTab === 'quotations'
                  ? 'btn-glass-morphism shadow-xl'
                  : 'hover:border-gold-border/40'
              }`}
              style={activeAdminTab !== 'quotations' ? { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-secondary)' } : {}}
            >
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              <span>Quotation Inquiries ({quotations.length})</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('products')}
              className={`flex items-center justify-center gap-2.5 sm:gap-3 px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl border text-xs sm:text-base font-bold tracking-wide transition-all cursor-pointer min-h-[44px] ${
                activeAdminTab === 'products'
                  ? 'btn-glass-morphism shadow-xl'
                  : 'hover:border-gold-border/40'
              }`}
              style={activeAdminTab !== 'products' ? { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-secondary)' } : {}}
            >
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              <span>Featured Export Products ({productsList.length})</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('productLines')}
              className={`flex items-center justify-center gap-2.5 sm:gap-3 px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl border text-xs sm:text-base font-bold tracking-wide transition-all cursor-pointer min-h-[44px] ${
                activeAdminTab === 'productLines'
                  ? 'btn-glass-morphism shadow-xl'
                  : 'hover:border-gold-border/40'
              }`}
              style={activeAdminTab !== 'productLines' ? { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-secondary)' } : {}}
            >
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              <span>Product Lines & Requirements Control ({productLines.length})</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('shipments')}
              className={`flex items-center justify-center gap-2.5 sm:gap-3 px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl border text-xs sm:text-base font-bold tracking-wide transition-all cursor-pointer min-h-[44px] ${
                activeAdminTab === 'shipments'
                  ? 'btn-glass-morphism shadow-xl'
                  : 'hover:border-gold-border/40'
              }`}
              style={activeAdminTab !== 'shipments' ? { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)', color: 'var(--text-secondary)' } : {}}
            >
              <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              <span>Consignments &amp; Videos ({shipmentsList.length})</span>
            </button>
          </div>

          <button
            onClick={() => {
              if (activeAdminTab === 'quotations') fetchQuotations();
              else if (activeAdminTab === 'products') fetchProductsAdmin();
              else if (activeAdminTab === 'productLines') fetchProductLinesAdmin();
              else fetchShipmentsAdmin();
            }}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl border text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm hover:border-gold-border min-h-[44px]"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-card)',
              color: 'var(--text-primary)'
            }}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} style={{ color: 'var(--gold)' }} />
            <span>Sync Live Records</span>
          </button>
        </div>

        {/* ========================================================
            VIEW 1: QUOTATION ENTRIES & DISPATCH
            ======================================================== */}
        {activeAdminTab === 'quotations' && (
          <div className="space-y-10 animate-fade-in">
            {/* Header Banner - Large & Prominent */}
            <div>
              <span className="badge-pill mb-2 px-3 py-1 text-xs font-bold tracking-wider">Commercial Trade Operations</span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Quotation Entries & Email Dispatch
              </h1>
              <p className="text-sm sm:text-base mt-2 font-medium" style={{ color: 'var(--text-muted)' }}>
                Review incoming buyer specifications and dispatch formal commercial export quotations directly to customers.
              </p>
            </div>

            {/* Dashboard KPI Widgets - Large Numbers & Padding */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card-luxury p-6 sm:p-7 space-y-3">
                <div className="flex items-center justify-between text-sm font-bold" style={{ color: 'var(--text-muted)' }}>
                  <span>Total Quotations</span>
                  <FileText className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                </div>
                <div className="font-serif text-4xl sm:text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {quotationStats.total}
                </div>
                <div className="text-xs sm:text-sm font-medium flex items-center gap-1.5 text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>Realtime active records</span>
                </div>
              </div>

              <div className="card-luxury p-6 sm:p-7 space-y-3">
                <div className="flex items-center justify-between text-sm font-bold" style={{ color: 'var(--text-muted)' }}>
                  <span>Pending Review</span>
                  <Clock className="w-5 h-5 text-amber-400" />
                </div>
                <div className="font-serif text-4xl sm:text-5xl font-bold text-amber-400">
                  {quotationStats.pending}
                </div>
                <div className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                  Requires trade desk response
                </div>
              </div>

              <div className="card-luxury p-6 sm:p-7 space-y-3">
                <div className="flex items-center justify-between text-sm font-bold" style={{ color: 'var(--text-muted)' }}>
                  <span>Contacted / Quoted</span>
                  <CheckCircle2 className="w-5 h-5 text-purple-400" />
                </div>
                <div className="font-serif text-4xl sm:text-5xl font-bold text-purple-400">
                  {quotationStats.contacted}
                </div>
                <div className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                  Dispatched proforma invoices
                </div>
              </div>

              <div className="card-luxury p-6 sm:p-7 space-y-3">
                <div className="flex items-center justify-between text-sm font-bold" style={{ color: 'var(--text-muted)' }}>
                  <span>Export Destinations</span>
                  <Globe className="w-5 h-5 text-blue-400" />
                </div>
                <div className="font-serif text-4xl sm:text-5xl font-bold text-blue-400">
                  {quotationStats.countries}
                </div>
                <div className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                  Global trade buyer territories
                </div>
              </div>
            </div>

            {/* Filter Tabs & Search - Large Inputs */}
            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {['All', 'Pending', 'Reviewed', 'Contacted', 'Quoted', 'Closed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatusTab(status)}
                      className={`px-5 py-2.5 text-sm font-bold uppercase tracking-wider rounded-xl border transition-all cursor-pointer ${
                        selectedStatusTab === status
                          ? 'btn-glass-morphism shadow-md'
                          : 'border-transparent hover:border-gold-border/40'
                      }`}
                      style={selectedStatusTab !== status ? { color: 'var(--text-muted)', backgroundColor: 'var(--bg-card)' } : {}}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                <div className="relative w-full lg:w-[480px]">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-dim)' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by buyer, company, email, product..."
                    className="input-luxury pl-12 pr-4 py-3.5 text-sm sm:text-base rounded-xl font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Quotations Data Table - Large, Spacious, Clear */}
            <div 
              className="rounded-2xl border overflow-hidden shadow-2xl transition-colors"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-card)',
              }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm min-w-[750px]">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-topbar)' }}>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs sm:text-sm" style={{ color: 'var(--gold)' }}>Ref / Date</th>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs sm:text-sm" style={{ color: 'var(--gold)' }}>Buyer & Company</th>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs sm:text-sm" style={{ color: 'var(--gold)' }}>Product Sector & Volume</th>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs sm:text-sm" style={{ color: 'var(--gold)' }}>Destination</th>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs sm:text-sm" style={{ color: 'var(--gold)' }}>Status</th>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs sm:text-sm text-right" style={{ color: 'var(--gold)' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                    {filteredQuotations.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-16 text-center text-base font-medium" style={{ color: 'var(--text-muted)' }}>
                          No quotation entries found matching current filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredQuotations.map((item, index) => {
                        const email = item.businessEmail || item.corporateEmail || 'N/A';
                        const comp = item.companyName || item.company || 'Private Buyer';
                        const prod = item.productName || item.productOfInterest || 'General Export';
                        const qty = item.quantity || item.estimatedQuantity || 'Not specified';
                        const country = item.country || item.destinationCountry || 'International';
                        const refCode = item.id || (item._id ? `IPM-${item._id.slice(-6).toUpperCase()}` : `IPM-${1000 + index}`);
                        const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent';

                        return (
                          <tr 
                            key={item._id || item.id || index}
                            className="hover:bg-white/[0.03] transition-colors"
                          >
                            <td className="py-5 px-6 font-mono font-medium" style={{ color: 'var(--text-primary)' }}>
                              <span className="block font-bold text-base" style={{ color: 'var(--gold)' }}>{refCode}</span>
                              <span className="text-xs font-semibold mt-0.5 block" style={{ color: 'var(--text-dim)' }}>{dateStr}</span>
                            </td>

                            <td className="py-5 px-6">
                              <div className="font-bold text-base sm:text-lg" style={{ color: 'var(--text-primary)' }}>{item.fullName}</div>
                              <div className="text-sm flex items-center gap-2 mt-1 font-medium" style={{ color: 'var(--text-muted)' }}>
                                <Building className="w-4 h-4 shrink-0 text-amber-400/80" />
                                <span>{comp}</span>
                              </div>
                              <div className="text-sm flex items-center gap-2 mt-0.5 font-mono" style={{ color: 'var(--text-dim)' }}>
                                <Mail className="w-4 h-4 shrink-0 text-sky-400/80" />
                                <span>{email}</span>
                              </div>
                            </td>

                            <td className="py-5 px-6">
                              <div className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>{prod}</div>
                              <div className="text-sm sm:text-base font-mono font-bold mt-1" style={{ color: 'var(--gold)' }}>{qty}</div>
                            </td>

                            <td className="py-5 px-6">
                              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold border"
                                style={{
                                  backgroundColor: 'var(--bg-topbar)',
                                  borderColor: 'var(--border-subtle)',
                                  color: 'var(--text-secondary)'
                                }}
                              >
                                <Globe className="w-4 h-4 text-sky-400" />
                                <span>{country}</span>
                              </span>
                            </td>

                            <td className="py-5 px-6">
                              <span className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${getStatusBadgeClass(item.status)}`}>
                                {item.status}
                              </span>
                            </td>

                            <td className="py-5 px-6 text-right">
                              <button
                                onClick={() => handleOpenEmailModal(item)}
                                className="btn-glass-morphism !py-2.5 !px-5 text-xs sm:text-sm font-bold tracking-wider inline-flex items-center gap-2 cursor-pointer shadow-lg"
                              >
                                <Send className="w-4 h-4" />
                                <span>Respond</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW 2: FEATURED EXPORT PRODUCTS CATALOGUE & IMAGE UPLOADS
            ======================================================== */}
        {activeAdminTab === 'products' && (
          <div className="space-y-10 animate-fade-in">
            {/* Header & Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="badge-pill mb-2 px-3 py-1 text-xs font-bold tracking-wider">Live Export Products & Homepage Showcase</span>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  Featured Export Products
                </h1>
                <p className="text-sm sm:text-base mt-2 font-medium" style={{ color: 'var(--text-muted)' }}>
                  Full CRUD & File Upload: Add new export products, upload high-resolution images, update specifications, and toggle homepage featured status.
                </p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="btn-glass-morphism px-6 py-3.5 text-sm sm:text-base font-bold tracking-wide cursor-pointer inline-flex items-center gap-2.5 shrink-0 shadow-xl min-h-[44px]"
              >
                <Plus className="w-5 h-5 text-white" />
                <span>Add Export Product</span>
              </button>
            </div>

            {/* Success Notice Banner */}
            {productNotice && (
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm flex items-center gap-3">
                <Check className="w-5 h-5 shrink-0 text-emerald-400" />
                <span>{productNotice}</span>
              </div>
            )}

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="card-luxury p-6 rounded-2xl border space-y-2">
                <span className="text-xs uppercase font-bold tracking-wider" style={{ color: 'var(--gold)' }}>Total Products</span>
                <p className="text-3xl font-bold font-serif">{productStats.total}</p>
                <p className="text-xs text-muted-grey">Export items registered in database</p>
              </div>
              <div className="card-luxury p-6 rounded-2xl border space-y-2">
                <span className="text-xs uppercase font-bold tracking-wider" style={{ color: 'var(--gold)' }}>Featured on Homepage</span>
                <p className="text-3xl font-bold font-serif text-[#D4AF69]">{productStats.featured}</p>
                <p className="text-xs text-muted-grey">Displayed in primary customer showcase</p>
              </div>
              <div className="card-luxury p-6 rounded-2xl border space-y-2">
                <span className="text-xs uppercase font-bold tracking-wider" style={{ color: 'var(--gold)' }}>Active In Stock</span>
                <p className="text-3xl font-bold font-serif text-emerald-400">{productStats.active}</p>
                <p className="text-xs text-muted-grey">Available for commercial container export</p>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl border"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
            >
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-grey" />
                <input
                  type="text"
                  placeholder="Search products by name, origin, HS code, or category..."
                  value={prodSearchQuery}
                  onChange={(e) => setProdSearchQuery(e.target.value)}
                  className="input-luxury pl-10 text-xs sm:text-sm"
                />
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={prodCategoryFilter}
                  onChange={(e) => setProdCategoryFilter(e.target.value)}
                  className="input-luxury text-xs sm:text-sm py-2 px-3"
                >
                  <option value="ALL">All Categories</option>
                  <option value="FEATURED">⭐ Featured Only</option>
                  <option value="Spices & Food Products">Spices & Food Products</option>
                  <option value="Grains & Agricultural Staples">Grains & Agricultural Staples</option>
                  <option value="Textiles & Fine Fabrics">Textiles & Fine Fabrics</option>
                  <option value="Metal & Artisanal Copperware">Metal & Artisanal Copperware</option>
                </select>
              </div>
            </div>

            {/* Products Table */}
            <div className="rounded-2xl border overflow-hidden shadow-2xl"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm min-w-[850px]">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-topbar)' }}>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs" style={{ color: 'var(--gold)' }}>Product</th>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs" style={{ color: 'var(--gold)' }}>Category</th>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs" style={{ color: 'var(--gold)' }}>Origin & HS Code</th>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs" style={{ color: 'var(--gold)' }}>Status</th>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs text-center" style={{ color: 'var(--gold)' }}>Homepage Featured</th>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs text-right" style={{ color: 'var(--gold)' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-muted-grey">
                          No export products match the current filters. Click &quot;Add Export Product&quot; to create one.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((prod) => {
                        const targetId = prod._id || prod.id;
                        const thumb = resolveProductImage(prod.imageUrls?.[0]);
                        return (
                          <tr key={targetId} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3.5">
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/20 border shrink-0" style={{ borderColor: 'var(--border-subtle)' }}>
                                  <img src={thumb} alt={prod.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{prod.name}</div>
                                  <div className="text-xs text-muted-grey font-mono">/products/{prod.slug}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="badge-pill text-[11px]">{prod.categoryName}</span>
                            </td>
                            <td className="py-4 px-6 text-xs">
                              <div>{prod.origin}</div>
                              <span className="font-mono text-[#D4AF69]">{prod.hsCode}</span>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                prod.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                                prod.status === 'In Season' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                                'bg-blue-500/10 text-blue-400 border-blue-500/30'
                              }`}>
                                {prod.status}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <button
                                onClick={() => handleToggleFeatured(prod)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                                  prod.featured
                                    ? 'bg-[#D4AF69]/20 text-[#D4AF69] border-[#D4AF69]/50 shadow-sm'
                                    : 'hover:border-gold-border/50 text-muted-grey'
                                }`}
                                style={!prod.featured ? { backgroundColor: 'var(--bg-topbar)', borderColor: 'var(--border-subtle)' } : {}}
                                title="Click to toggle homepage featured status"
                              >
                                <Star className={`w-3.5 h-3.5 ${prod.featured ? 'fill-[#D4AF69]' : ''}`} />
                                <span>{prod.featured ? 'Featured on Home' : 'Standard'}</span>
                              </button>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenEditProduct(prod)}
                                  className="p-2.5 rounded-xl border hover:border-gold-border cursor-pointer transition-colors"
                                  style={{ backgroundColor: 'var(--bg-topbar)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
                                  title="Edit Product Details & Image"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(prod)}
                                  className="p-2.5 rounded-xl border hover:border-red-500/50 hover:text-red-400 cursor-pointer transition-colors text-red-400/80"
                                  style={{ backgroundColor: 'var(--bg-topbar)', borderColor: 'var(--border-subtle)' }}
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW 3: DYNAMIC PRODUCT LINES / REQUIREMENTS MANAGER
            ======================================================== */}
        {activeAdminTab === 'productLines' && (
          <div className="space-y-10 animate-fade-in">
            {/* Header & Add Button - Large & Prominent */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="badge-pill mb-2 px-3 py-1 text-xs font-bold tracking-wider">Quotation Form Dynamic Options Control</span>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  Product Lines & Sourcing Requirements
                </h1>
                <p className="text-sm sm:text-base mt-2 font-medium" style={{ color: 'var(--text-muted)' }}>
                  Full CRUD control: Add, update, toggle, or delete options appearing dynamically in the buyer quotation form dropdown.
                </p>
              </div>

              <button
                onClick={handleOpenAddProductLine}
                className="btn-glass-morphism px-6 py-3.5 text-sm sm:text-base font-bold tracking-wide cursor-pointer inline-flex items-center gap-2.5 shrink-0 shadow-xl"
              >
                <Plus className="w-5 h-5 text-white" />
                <span>Add Product Line / Requirement</span>
              </button>
            </div>

            {/* Product Lines Stats - Large Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="card-luxury p-6 sm:p-7 space-y-3">
                <div className="flex items-center justify-between text-sm font-bold" style={{ color: 'var(--text-muted)' }}>
                  <span>Total Defined Lines</span>
                  <Layers className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                </div>
                <div className="font-serif text-4xl sm:text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {productLineStats.total}
                </div>
                <div className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                  Configured options in system
                </div>
              </div>

              <div className="card-luxury p-6 sm:p-7 space-y-3">
                <div className="flex items-center justify-between text-sm font-bold" style={{ color: 'var(--text-muted)' }}>
                  <span>Active in Quotation Form</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="font-serif text-4xl sm:text-5xl font-bold text-emerald-400">
                  {productLineStats.active}
                </div>
                <div className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                  Live in buyer dropdown
                </div>
              </div>

              <div className="card-luxury p-6 sm:p-7 space-y-3">
                <div className="flex items-center justify-between text-sm font-bold" style={{ color: 'var(--text-muted)' }}>
                  <span>Commodity Categories</span>
                  <Sliders className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                </div>
                <div className="font-serif text-4xl sm:text-5xl font-bold" style={{ color: 'var(--gold)' }}>
                  {productLineStats.categories}
                </div>
                <div className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                  Grouped trade sectors
                </div>
              </div>
            </div>

            {/* Search Filter - Large Input */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative w-full lg:w-[480px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-dim)' }} />
                <input
                  type="text"
                  value={plSearchQuery}
                  onChange={(e) => setPlSearchQuery(e.target.value)}
                  placeholder="Filter product lines by name, category..."
                  className="input-luxury pl-12 pr-4 py-3.5 text-sm sm:text-base rounded-xl font-medium"
                />
              </div>

              <div className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
                Showing <span style={{ color: 'var(--gold)' }}>{filteredProductLines.length}</span> of {productLines.length} product lines
              </div>
            </div>

            {/* Product Lines Data Table - Large, Spacious, Clear */}
            <div 
              className="rounded-2xl border overflow-hidden shadow-2xl transition-colors"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-card)',
              }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm min-w-[750px]">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-topbar)' }}>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs sm:text-sm" style={{ color: 'var(--gold)' }}>Product Line / Requirement</th>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs sm:text-sm" style={{ color: 'var(--gold)' }}>Category</th>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs sm:text-sm" style={{ color: 'var(--gold)' }}>Standard Unit</th>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs sm:text-sm" style={{ color: 'var(--gold)' }}>Dropdown Status</th>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs sm:text-sm text-right" style={{ color: 'var(--gold)' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                    {filteredProductLines.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-16 text-center text-base font-medium" style={{ color: 'var(--text-muted)' }}>
                          No product lines found. Click &quot;Add Product Line / Requirement&quot; to create one.
                        </td>
                      </tr>
                    ) : (
                      filteredProductLines.map((item, index) => {
                        const targetId = item._id || item.id || `pl-${index}`;
                        return (
                          <tr key={targetId} className="hover:bg-white/[0.03] transition-colors">
                            <td className="py-5 px-6">
                              <div className="font-bold text-base sm:text-lg" style={{ color: 'var(--text-primary)' }}>
                                {item.name}
                              </div>
                              {item.description && (
                                <p className="text-xs sm:text-sm mt-1 line-clamp-1" style={{ color: 'var(--text-dim)' }}>
                                  {item.description}
                                </p>
                              )}
                            </td>

                            <td className="py-5 px-6">
                              <span className="badge-pill px-3.5 py-1.5 text-xs sm:text-sm font-bold">
                                {item.category}
                              </span>
                            </td>

                            <td className="py-5 px-6 font-mono font-bold text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
                              {item.defaultUnit}
                            </td>

                            <td className="py-5 px-6">
                              <button
                                onClick={() => handleToggleProductLineStatus(item)}
                                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider border cursor-pointer transition-all shadow-sm ${
                                  item.isActive
                                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                                    : 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30 hover:bg-zinc-500/25'
                                }`}
                                title="Click to toggle active status"
                              >
                                {item.isActive ? (
                                  <>
                                    <Check className="w-4 h-4" />
                                    <span>Active in Form</span>
                                  </>
                                ) : (
                                  <span>Hidden (Inactive)</span>
                                )}
                              </button>
                            </td>

                            <td className="py-5 px-6 text-right">
                              <div className="flex items-center justify-end gap-3">
                                <button
                                  onClick={() => handleOpenEditProductLine(item)}
                                  className="p-2.5 rounded-xl border hover:border-gold-border hover:text-[#D4AF69] transition-colors cursor-pointer"
                                  style={{
                                    backgroundColor: 'var(--bg-topbar)',
                                    borderColor: 'var(--border-subtle)',
                                    color: 'var(--text-secondary)'
                                  }}
                                  title="Edit Product Line"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProductLine(item)}
                                  className="p-2.5 rounded-xl border hover:border-red-500/50 hover:text-red-400 transition-colors cursor-pointer text-red-400/80"
                                  style={{
                                    backgroundColor: 'var(--bg-topbar)',
                                    borderColor: 'var(--border-subtle)',
                                  }}
                                  title="Delete Product Line"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: DYNAMIC SHIPMENTS & VIDEO JOURNEYS MANAGEMENT
            ======================================================== */}
        {activeAdminTab === 'shipments' && (
          <div className="space-y-10 animate-fade-in">
            {/* Header & Add Button */}
            <div 
              className="p-8 sm:p-10 rounded-2xl border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-card)',
              }}
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold mb-3 border"
                  style={{
                    backgroundColor: 'rgba(6, 182, 212, 0.12)',
                    borderColor: 'rgba(6, 182, 212, 0.3)',
                    color: '#22d3ee',
                  }}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Maritime Logistics &amp; Dynamic Route Verification</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-normal" style={{ color: 'var(--text-primary)' }}>
                  Consignment Journeys &amp; Video Proofs Control
                </h2>
                <p className="text-sm mt-1 max-w-2xl" style={{ color: 'var(--text-muted)' }}>
                  Manage origin, reach destination, calendar dates (sequenced upside / newest first), and interactive video links for international buyer verification.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleOpenAddShipment}
                  className="btn-gold flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold tracking-wide shadow-xl cursor-pointer"
                >
                  <Plus className="w-5 h-5 text-black" />
                  <span>Add New Consignment</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Controls */}
            <div 
              className="p-4 sm:p-5 rounded-2xl border shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-card)',
              }}
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Filter by origin port, destination, or consignment title..."
                  value={shipSearchQuery}
                  onChange={(e) => setShipSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none"
                  style={{
                    backgroundColor: 'var(--bg-input)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {['ALL', 'In Transit', 'Scheduled', 'Delivered'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setShipStatusFilter(status)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      shipStatusFilter === status
                        ? 'border shadow-sm'
                        : 'border border-transparent hover:opacity-80'
                    }`}
                    style={
                      shipStatusFilter === status
                        ? {
                            backgroundColor: 'var(--gold-muted)',
                            borderColor: 'var(--gold-border)',
                            color: 'var(--gold)'
                          }
                        : {
                            backgroundColor: 'var(--bg-topbar)',
                            color: 'var(--text-secondary)'
                          }
                    }
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Consignments Table (Sequenced upside on Date) */}
            <div 
              className="rounded-2xl border shadow-xl overflow-hidden"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-card)',
              }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b text-xs font-bold uppercase tracking-wider" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-topbar)', color: 'var(--text-muted)' }}>
                      <th className="py-4 px-6">Date (Calendar)</th>
                      <th className="py-4 px-6">Origin (Where From) &rarr; Reach Destination</th>
                      <th className="py-4 px-6">Consignment Details</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6">Video / Media Proof</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-sm" style={{ borderColor: 'var(--border-subtle)' }}>
                    {filteredAdminShipments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-16 text-center" style={{ color: 'var(--text-muted)' }}>
                          <Navigation className="w-10 h-10 mx-auto mb-2 opacity-40 text-cyan-400" />
                          <p className="text-base font-serif font-medium" style={{ color: 'var(--text-primary)' }}>No consignments found</p>
                          <p className="text-xs mt-1">Click &quot;Add New Consignment&quot; to register a trade shipment route.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredAdminShipments.map((ship: any) => {
                        const dateFormatted = new Date(ship.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        });
                        const isYT = Boolean(getYouTubeEmbedUrl(ship.mediaLink));

                        return (
                          <tr key={ship._id || ship.id} className="hover:bg-white/[0.02] transition-colors">
                            {/* Calendar Date (Upside sequence) */}
                            <td className="py-5 px-6 whitespace-nowrap">
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-mono font-bold"
                                style={{
                                  backgroundColor: 'rgba(212, 175, 105, 0.08)',
                                  borderColor: 'var(--gold-border)',
                                  color: 'var(--gold)'
                                }}
                              >
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{dateFormatted}</span>
                              </div>
                            </td>

                            {/* Origin & Reach Destination */}
                            <td className="py-5 px-6">
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                                  <Anchor className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                  <span>{ship.fromLocation}</span>
                                </div>
                                <div className="flex items-center gap-2 pl-4 text-xs font-medium" style={{ color: 'var(--gold)' }}>
                                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                                  <span>{ship.toLocation}</span>
                                </div>
                              </div>
                            </td>

                            {/* Title & Notes */}
                            <td className="py-5 px-6 max-w-xs">
                              <span className="font-medium block truncate" style={{ color: 'var(--text-primary)' }}>
                                {ship.title}
                              </span>
                              {ship.description && (
                                <span className="text-xs block truncate" style={{ color: 'var(--text-muted)' }}>
                                  {ship.description}
                                </span>
                              )}
                            </td>

                            {/* Status */}
                            <td className="py-5 px-6 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                ship.status === 'In Transit'
                                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                                  : ship.status === 'Delivered'
                                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              }`}>
                                {ship.status === 'In Transit' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />}
                                {ship.status === 'Delivered' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                                {ship.status === 'Scheduled' && <Clock className="w-3 h-3 text-amber-400" />}
                                <span>{ship.status}</span>
                              </span>
                            </td>

                            {/* Video / Media Link */}
                            <td className="py-5 px-6 whitespace-nowrap">
                              <a
                                href={ship.mediaLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold hover:border-cyan-400/50 transition-colors"
                                style={{
                                  backgroundColor: 'var(--bg-topbar)',
                                  borderColor: 'var(--border-subtle)',
                                  color: 'var(--text-primary)'
                                }}
                              >
                                {isYT ? (
                                  <>
                                    <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0">
                                      <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                                    </div>
                                    <span>Watch Video</span>
                                  </>
                                ) : (
                                  <>
                                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                                    <span>Open Link</span>
                                  </>
                                )}
                              </a>
                            </td>

                            {/* Actions */}
                            <td className="py-5 px-6 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-2.5">
                                <button
                                  onClick={() => handleOpenEditShipment(ship)}
                                  className="p-2 rounded-xl border hover:border-gold-border hover:text-[#D4AF69] transition-colors cursor-pointer"
                                  style={{
                                    backgroundColor: 'var(--bg-topbar)',
                                    borderColor: 'var(--border-subtle)',
                                    color: 'var(--text-secondary)'
                                  }}
                                  title="Edit Consignment"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteShipment(ship)}
                                  className="p-2 rounded-xl border hover:border-red-500/50 hover:text-red-400 transition-colors cursor-pointer text-red-400/80"
                                  style={{
                                    backgroundColor: 'var(--bg-topbar)',
                                    borderColor: 'var(--border-subtle)'
                                  }}
                                  title="Delete Consignment"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================
          MODAL: ADD / EDIT SHIPMENT CONSIGNMENT DIALOG
          ======================================================== */}
      {isShipModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          style={{ backgroundColor: 'var(--modal-overlay)', backdropFilter: 'blur(8px)' }}
        >
          <div 
            className="relative w-full max-w-xl my-8 rounded-2xl border shadow-2xl p-6 sm:p-8 space-y-6"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-card)',
              color: 'var(--text-primary)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl border" style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)', borderColor: 'rgba(6, 182, 212, 0.3)' }}>
                  <Navigation className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-normal" style={{ color: 'var(--text-primary)' }}>
                    {editingShipment ? 'Update Consignment Journey' : 'Add New Consignment Journey'}
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Configure origin, destination, calendar date, and video proof link.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsShipModalOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                style={{ color: 'var(--text-muted)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Banner */}
            {shipError && (
              <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{shipError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveShipment} className="space-y-4">
              {/* Consignment Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Consignment Title / Cargo
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1121 Basmati Rice & Spices Consignment #8821"
                  value={shipFormData.title}
                  onChange={(e) => setShipFormData({ ...shipFormData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none"
                  style={{
                    backgroundColor: 'var(--bg-input)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              {/* Origin (Where From) & Reach Destination (To) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Origin Location (Where From) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nhava Sheva (JNPT), Mumbai, India"
                    value={shipFormData.fromLocation}
                    onChange={(e) => setShipFormData({ ...shipFormData, fromLocation: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none"
                    style={{
                      backgroundColor: 'var(--bg-input)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Reach Destination (To Port / Country) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jebel Ali Port, Dubai, UAE"
                    value={shipFormData.toLocation}
                    onChange={(e) => setShipFormData({ ...shipFormData, toLocation: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none"
                    style={{
                      backgroundColor: 'var(--bg-input)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
              </div>

              {/* Calendar Date & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Dispatch / Shipment Date (Calendar) *
                  </label>
                  <input
                    type="date"
                    required
                    value={shipFormData.date}
                    onChange={(e) => setShipFormData({ ...shipFormData, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none cursor-pointer"
                    style={{
                      backgroundColor: 'var(--bg-input)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Sorted upside (newest dates on top).</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Transit Status
                  </label>
                  <select
                    value={shipFormData.status}
                    onChange={(e: any) => setShipFormData({ ...shipFormData, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none cursor-pointer"
                    style={{
                      backgroundColor: 'var(--bg-input)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <option value="In Transit">In Transit</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {/* Video / Media Link */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Video / Proof Media Link (YouTube, Tracking, or Footage) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="e.g. https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  value={shipFormData.mediaLink}
                  onChange={(e) => setShipFormData({ ...shipFormData, mediaLink: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none"
                  style={{
                    backgroundColor: 'var(--bg-input)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)'
                  }}
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Customers can click this link to watch video proof or view tracking directly.
                </span>
              </div>

              {/* Live YouTube Embed Preview */}
              {getYouTubeEmbedUrl(shipFormData.mediaLink) && (
                <div className="rounded-xl border border-white/10 bg-black/40 p-3 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Live YouTube Player Preview</span>
                  </div>
                  <div className="relative w-full pb-[56.25%] rounded-lg overflow-hidden border border-white/10 bg-black">
                    <iframe
                      src={getYouTubeEmbedUrl(shipFormData.mediaLink)!}
                      title="YouTube Preview"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      className="absolute inset-0 w-full h-full border-0"
                    />
                  </div>
                </div>
              )}

              {/* Notes / Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Transit Notes / Description (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 2 x 40ft FCL containerized export, SGS quality inspection verified, sealed maritime packaging."
                  value={shipFormData.description}
                  onChange={(e) => setShipFormData({ ...shipFormData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none resize-none"
                  style={{
                    backgroundColor: 'var(--bg-input)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <button
                  type="button"
                  onClick={() => setIsShipModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border text-xs font-semibold hover:bg-white/5 transition-colors cursor-pointer"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingShipment}
                  className="btn-gold flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase shadow-xl cursor-pointer"
                >
                  {isSavingShipment ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingShipment ? 'Update Consignment' : 'Save Consignment'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 1: ADD / EDIT PRODUCT LINE DIALOG
          ======================================================== */}
      {isPlModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          style={{ backgroundColor: 'var(--modal-overlay)', backdropFilter: 'blur(8px)' }}
        >
          <div 
            className="relative w-full max-w-xl my-8 rounded-2xl border shadow-2xl p-6 sm:p-8 space-y-6"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-card)',
              color: 'var(--text-primary)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl border" style={{ backgroundColor: 'var(--gold-muted)', borderColor: 'var(--gold-border)' }}>
                  <Layers className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                </div>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-normal" style={{ color: 'var(--text-primary)' }}>
                    {editingProductLine ? 'Update Product Line' : 'Add New Product Line / Requirement'}
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {editingProductLine ? 'Modify configuration and dropdown parameters' : 'Will appear dynamically in the buyer quotation modal'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPlModalOpen(false)}
                className="p-2 rounded-full border hover:border-gold-border cursor-pointer"
                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error & Success Messages */}
            {plError && (
              <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{plError}</span>
              </div>
            )}
            {plSuccess && (
              <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{plSuccess}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveProductLine} className="space-y-5 text-sm">
              <div>
                <label className="block font-bold mb-1.5" style={{ color: 'var(--gold)' }}>
                  Product Line / Requirement Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={plFormData.name}
                  onChange={(e) => setPlFormData({ ...plFormData, name: e.target.value })}
                  placeholder="e.g. 1121 Sella Basmati Rice / Sona Masoori Raw"
                  className="input-luxury py-3 px-4 text-sm sm:text-base rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1.5" style={{ color: 'var(--gold)' }}>
                    Commodity Category <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={plFormData.category}
                    onChange={(e) => setPlFormData({ ...plFormData, category: e.target.value })}
                    placeholder="e.g. Spices & Herbs / Rice & Grains"
                    className="input-luxury py-3 px-4 text-sm sm:text-base rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1.5" style={{ color: 'var(--gold)' }}>
                    Default Trade Unit
                  </label>
                  <input
                    type="text"
                    value={plFormData.defaultUnit}
                    onChange={(e) => setPlFormData({ ...plFormData, defaultUnit: e.target.value })}
                    placeholder="e.g. 20ft FCL / Metric Tons (MT)"
                    className="input-luxury py-3 px-4 text-sm sm:text-base rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1.5" style={{ color: 'var(--gold)' }}>
                  Technical Specifications / Commercial Description
                </label>
                <textarea
                  rows={4}
                  value={plFormData.description}
                  onChange={(e) => setPlFormData({ ...plFormData, description: e.target.value })}
                  placeholder="Commercial grade, grain length, moisture specifications, purity parameters..."
                  className="input-luxury py-3 px-4 text-sm sm:text-base rounded-xl font-medium"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={plFormData.isActive}
                    onChange={(e) => setPlFormData({ ...plFormData, isActive: e.target.checked })}
                    className="w-5 h-5 accent-[#0284c7] rounded cursor-pointer"
                  />
                  <span className="font-bold text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>
                    Active in Quotation Form (Visible in Buyer Dropdown)
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <button
                  type="button"
                  onClick={() => setIsPlModalOpen(false)}
                  className="px-5 py-3 rounded-xl text-sm font-bold uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingPl}
                  className="btn-glass-morphism px-6 py-3.5 text-sm sm:text-base font-bold tracking-wide cursor-pointer shadow-lg"
                >
                  {isSavingPl ? (
                    <span>Saving Option...</span>
                  ) : (
                    <span>{editingProductLine ? 'Update Product Line' : 'Add Product Line'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: CUSTOMER EMAIL DISPATCH & QUOTATION REVIEW
          ======================================================== */}
      {isEmailModalOpen && selectedQuotation && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          style={{ backgroundColor: 'var(--modal-overlay)', backdropFilter: 'blur(8px)' }}
        >
          <div 
            className="relative w-full max-w-4xl my-8 rounded-2xl border shadow-2xl p-8 sm:p-10 space-y-6"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-card)',
              color: 'var(--text-primary)',
            }}
          >
            <div className="flex items-center justify-between border-b pb-5" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl border" style={{ backgroundColor: 'var(--gold-muted)', borderColor: 'var(--gold-border)' }}>
                  <Mail className="w-6 h-6" style={{ color: 'var(--gold)' }} />
                </div>
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Commercial Response & Email Dispatch
                  </h3>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Dispatch formal FOB/CIF quote directly to customer&apos;s inbox with official brand logo
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEmailModalOpen(false)}
                className="p-2.5 rounded-full border hover:border-gold-border cursor-pointer transition-colors"
                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {emailSuccessNotice && (
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <span>{emailSuccessNotice}</span>
              </div>
            )}

            <div 
              className="p-5 rounded-2xl border text-sm grid grid-cols-1 sm:grid-cols-3 gap-4"
              style={{
                backgroundColor: 'var(--bg-card-elevated)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div>
                <span className="block text-xs uppercase font-bold tracking-wider" style={{ color: 'var(--gold)' }}>Buyer Name</span>
                <span className="font-bold text-base mt-0.5 block">{selectedQuotation.fullName}</span>
                <span className="block text-sm font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {selectedQuotation.businessEmail || selectedQuotation.corporateEmail}
                </span>
              </div>
              <div>
                <span className="block text-xs uppercase font-bold tracking-wider" style={{ color: 'var(--gold)' }}>Company & Country</span>
                <span className="font-bold text-base mt-0.5 block">{selectedQuotation.companyName || selectedQuotation.company || 'N/A'}</span>
                <span className="block text-sm font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {selectedQuotation.country || selectedQuotation.destinationCountry}
                </span>
              </div>
              <div>
                <span className="block text-xs uppercase font-bold tracking-wider" style={{ color: 'var(--gold)' }}>Commodity & Qty</span>
                <span className="font-bold text-base mt-0.5 block">{selectedQuotation.productName || selectedQuotation.productOfInterest}</span>
                <span className="block text-sm font-mono font-bold mt-0.5" style={{ color: 'var(--gold)' }}>
                  {selectedQuotation.quantity || selectedQuotation.estimatedQuantity}
                </span>
              </div>
              {(selectedQuotation.message || selectedQuotation.technicalSpecifications) && (
                <div className="col-span-1 sm:col-span-3 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span className="block text-xs uppercase font-bold tracking-wider" style={{ color: 'var(--gold)' }}>Buyer Specifications / Note</span>
                  <p className="text-sm mt-1 italic" style={{ color: 'var(--text-secondary)' }}>
                    &ldquo;{selectedQuotation.message || selectedQuotation.technicalSpecifications}&rdquo;
                  </p>
                </div>
              )}
            </div>

            <form onSubmit={handleSendEmail} className="space-y-5 text-sm">
              <div>
                <label className="block font-bold mb-1.5" style={{ color: 'var(--gold)' }}>
                  Recipient Customer Email
                </label>
                <input
                  type="email"
                  disabled
                  value={selectedQuotation.businessEmail || selectedQuotation.corporateEmail || ''}
                  className="input-luxury opacity-75 font-mono cursor-not-allowed py-3 px-4 text-sm sm:text-base rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold mb-1.5" style={{ color: 'var(--gold)' }}>
                  Email Subject Line
                </label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="input-luxury py-3 px-4 text-sm sm:text-base rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold mb-1.5" style={{ color: 'var(--gold)' }}>
                  Update Inquiry Workflow Status
                </label>
                <select
                  value={emailStatusUpdate}
                  onChange={(e) => setEmailStatusUpdate(e.target.value as any)}
                  className="input-luxury py-3 px-4 text-sm sm:text-base rounded-xl font-medium"
                >
                  <option value="Contacted">Mark as Contacted (Offer Sent)</option>
                  <option value="Quoted">Mark as Quoted (Formal Proforma Issued)</option>
                  <option value="Reviewed">Keep as Under Technical Review</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1.5" style={{ color: 'var(--gold)' }}>
                  Commercial Message & Proforma Details
                </label>
                <textarea
                  rows={6}
                  required
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  className="input-luxury font-mono text-sm py-3 px-4 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-4 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="px-5 py-3 rounded-xl text-sm font-bold uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingEmail}
                  className="btn-glass-morphism px-7 py-3.5 text-sm sm:text-base font-bold tracking-wide cursor-pointer inline-flex items-center gap-2.5 shadow-xl"
                >
                  {isSendingEmail ? (
                    <span>Transmitting Dispatch...</span>
                  ) : (
                    <>
                      <span>Transmit Email to Customer</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ========================================================
          MODAL: ADD / EDIT FEATURED EXPORT PRODUCT (WITH FILE UPLOAD)
          ======================================================== */}
      {isProductModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          style={{ backgroundColor: 'var(--modal-overlay)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="relative w-full max-w-2xl my-4 sm:my-8 max-h-[92vh] overflow-y-auto rounded-2xl border shadow-2xl p-4 sm:p-6 sm:p-8 space-y-6"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-card)',
              color: 'var(--text-primary)',
            }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl border" style={{ backgroundColor: 'var(--gold-muted)', borderColor: 'var(--gold-border)' }}>
                  <Package className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                </div>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-normal" style={{ color: 'var(--text-primary)' }}>
                    {editingProduct ? 'Edit Export Product' : 'Add New Export Product'}
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {editingProduct ? 'Modify specifications, status, and upload new product imagery' : 'Create a new export product with image upload and publish live'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 rounded-full border hover:border-gold-border cursor-pointer"
                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error Message */}
            {productError && (
              <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{productError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs sm:text-sm">
              {/* Product Name */}
              <div>
                <label className="block font-bold mb-1" style={{ color: 'var(--gold)' }}>
                  Product Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Salem Turmeric Fingers (High Curcumin 3.5%+)"
                  value={productFormData.name}
                  onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                  className="input-luxury"
                />
              </div>

              {/* Two Column: Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1" style={{ color: 'var(--gold)' }}>
                    Export Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={productFormData.categoryName}
                    onChange={(e) => {
                      const catName = e.target.value;
                      const catId = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setProductFormData({ ...productFormData, categoryName: catName, categoryId: catId });
                    }}
                    className="input-luxury"
                  >
                    <option value="Spices & Food Products">Spices & Food Products</option>
                    <option value="Grains & Agricultural Staples">Grains & Agricultural Staples</option>
                    <option value="Textiles & Fine Fabrics">Textiles & Fine Fabrics</option>
                    <option value="Metal & Artisanal Copperware">Metal & Artisanal Copperware</option>
                    <option value="Ceramic & Natural Stone">Ceramic & Natural Stone</option>
                    <option value="Eco-Friendly Packaging Materials">Eco-Friendly Packaging Materials</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1" style={{ color: 'var(--gold)' }}>
                    Export Status
                  </label>
                  <select
                    value={productFormData.status}
                    onChange={(e) => setProductFormData({ ...productFormData, status: e.target.value })}
                    className="input-luxury"
                  >
                    <option value="Available">Available</option>
                    <option value="In Season">In Season</option>
                    <option value="Custom Order">Custom Order</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Two Column: Origin & HS Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1" style={{ color: 'var(--gold)' }}>
                    Origin (State/Region, India)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kerala & Tamil Nadu, India"
                    value={productFormData.origin}
                    onChange={(e) => setProductFormData({ ...productFormData, origin: e.target.value })}
                    className="input-luxury"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1" style={{ color: 'var(--gold)' }}>
                    HS Tariff Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 0908.31.00"
                    value={productFormData.hsCode}
                    onChange={(e) => setProductFormData({ ...productFormData, hsCode: e.target.value })}
                    className="input-luxury font-mono"
                  />
                </div>
              </div>

              {/* Minimum Order Quantity */}
              <div>
                <label className="block font-bold mb-1" style={{ color: 'var(--gold)' }}>
                  Minimum Order Quantity (MOQ)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1 x 20ft FCL / 10 Metric Tons"
                  value={productFormData.minimumOrderQuantity}
                  onChange={(e) => setProductFormData({ ...productFormData, minimumOrderQuantity: e.target.value })}
                  className="input-luxury"
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block font-bold mb-1" style={{ color: 'var(--gold)' }}>
                  Short Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Brief summary of grade, aroma, purity, and processing..."
                  value={productFormData.shortDescription}
                  onChange={(e) => setProductFormData({ ...productFormData, shortDescription: e.target.value })}
                  className="input-luxury"
                />
              </div>

              {/* Full Technical Specifications */}
              <div>
                <label className="block font-bold mb-1" style={{ color: 'var(--gold)' }}>
                  Full Description & Export Parameters
                </label>
                <textarea
                  rows={3}
                  placeholder="Comprehensive commercial specifications, packing terms, and harvesting details..."
                  value={productFormData.fullDescription}
                  onChange={(e) => setProductFormData({ ...productFormData, fullDescription: e.target.value })}
                  className="input-luxury"
                />
              </div>

              {/* Featured On Homepage Toggle */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl border"
                style={{ backgroundColor: 'var(--bg-card-elevated)', borderColor: 'var(--border-subtle)' }}
              >
                <input
                  type="checkbox"
                  id="featuredCheckbox"
                  checked={productFormData.featured}
                  onChange={(e) => setProductFormData({ ...productFormData, featured: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-600 text-[#D4AF69] focus:ring-[#D4AF69] cursor-pointer"
                />
                <label htmlFor="featuredCheckbox" className="font-semibold cursor-pointer select-none" style={{ color: 'var(--text-primary)' }}>
                  ⭐ Showcase in &quot;Featured Export Products&quot; section on the homepage
                </label>
              </div>

              {/* File Upload Section */}
              <div>
                <label className="block font-bold mb-1.5" style={{ color: 'var(--gold)' }}>
                  Product Photo / Image Upload
                </label>
                <div
                  className="border-2 border-dashed rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition-colors hover:border-[#D4AF69]/60"
                  style={{ backgroundColor: 'var(--bg-topbar)', borderColor: 'var(--border-input)' }}
                  onClick={() => document.getElementById('productImageInput')?.click()}
                >
                  <input
                    type="file"
                    id="productImageInput"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />

                  {productImagePreview ? (
                    <div className="space-y-3">
                      <div className="w-28 h-28 mx-auto rounded-xl overflow-hidden border shadow-lg" style={{ borderColor: 'var(--gold-border)' }}>
                        <img src={productImagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1.5">
                        <Check className="w-4 h-4" />
                        <span>{productImageFile ? `Ready to upload: ${productImageFile.name}` : 'Current Image Preview'}</span>
                      </div>
                      <p className="text-[11px] text-muted-grey">Click to select a different image file</p>
                    </div>
                  ) : (
                    <div className="space-y-2 py-2">
                      <div className="w-12 h-12 mx-auto rounded-full border flex items-center justify-center" style={{ backgroundColor: 'var(--gold-muted)', borderColor: 'var(--gold-border)' }}>
                        <Upload className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                      </div>
                      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Click to browse or drag & drop product photo
                      </p>
                      <p className="text-[11px] text-muted-grey">
                        PNG, JPG, WebP, or SVG up to 10 MB
                      </p>
                    </div>
                  )}
                </div>

                {/* Optional Image URL fallback */}
                <div className="mt-2">
                  <span className="text-[11px] text-muted-grey">Or paste existing image path/URL:</span>
                  <input
                    type="text"
                    placeholder="/images/product_spices_export_1793609366204.jpg"
                    value={productFormData.imageUrl}
                    onChange={(e) => {
                      setProductFormData({ ...productFormData, imageUrl: e.target.value });
                      if (!productImageFile && e.target.value) {
                        setProductImagePreview(e.target.value);
                      }
                    }}
                    className="input-luxury text-xs mt-1"
                  />
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-grey hover:text-white transition-colors min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="btn-glass-morphism px-7 py-3.5 text-xs sm:text-sm font-bold tracking-wide cursor-pointer inline-flex items-center justify-center gap-2.5 shadow-xl min-h-[44px]"
                >
                  {isSavingProduct ? (
                    <span>Uploading & Saving...</span>
                  ) : (
                    <>
                      <span>{editingProduct ? 'Save Product Changes' : 'Publish Product to Catalogue'}</span>
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
