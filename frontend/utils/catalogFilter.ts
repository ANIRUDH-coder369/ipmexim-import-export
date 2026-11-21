import { Product } from '../types';

export function filterProducts(
  products: Product[],
  options: {
    categoryId?: string;
    searchQuery?: string;
    sortBy?: 'featured' | 'name-asc' | 'name-desc';
  } = {}
): Product[] {
  const { categoryId = 'all', searchQuery = '', sortBy = 'featured' } = options;

  let filtered = [...products];

  // 1. Category filter
  if (categoryId && categoryId !== 'all') {
    filtered = filtered.filter((p) => p.categoryId === categoryId);
  }

  // 2. Search query across name, shortDescription, specifications, origin, and HS code
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter((p) => {
      const matchName = (p.name || '').toLowerCase().includes(q);
      const matchCategory = (p.categoryName || '').toLowerCase().includes(q);
      const matchDesc = (p.shortDescription || '').toLowerCase().includes(q) || (p.fullDescription || '').toLowerCase().includes(q);
      const matchOrigin = (p.origin || '').toLowerCase().includes(q);
      const matchHs = (p.hsCode || '').toLowerCase().includes(q);
      const matchSpecs = Object.entries(p.specifications || {}).some(
        ([key, val]) => key.toLowerCase().includes(q) || String(val).toLowerCase().includes(q)
      );
      return matchName || matchCategory || matchDesc || matchOrigin || matchHs || matchSpecs;
    });
  }

  // 3. Sorting
  if (sortBy === 'name-asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'name-desc') {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  } else {
    // Default: featured first, then name
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.name.localeCompare(b.name);
    });
  }

  return filtered;
}

export function getProductBySlug(products: Product[], slug: string): Product | undefined {
  if (!slug) return undefined;
  const normalized = slug.trim().toLowerCase();
  return products.find((p) => p.slug.toLowerCase() === normalized);
}
