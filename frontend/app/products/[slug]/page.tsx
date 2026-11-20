import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { getProductBySlug } from '@/utils/catalogFilter';
import { ProductDetailClient } from '@/components/public/ProductDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(PRODUCTS, slug);
  if (!product) {
    return {
      title: 'Product Not Found — IPM Exim',
    };
  }
  return {
    title: `${product.name} — IPM Exim Global Trade`,
    description: product.shortDescription,
  };
}

async function ProductDetailContent({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(PRODUCTS, slug);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center space-y-6">
        <h1 className="font-serif text-3xl sm:text-4xl text-[#F5F1E8]">Product Not Found</h1>
        <p className="text-sm text-[#B5B0A6]">
          The product record you requested is either unavailable or has been re-indexed.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF69] text-[#0B0B0B] text-xs font-semibold uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Product Catalogue</span>
        </Link>
      </div>
    );
  }

  return <ProductDetailClient product={product} />;
}

export default function ProductDetailPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-6 py-24 text-center text-[#B5B0A6] animate-pulse">
          Loading product specifications...
        </div>
      }
    >
      <ProductDetailContent params={params} />
    </Suspense>
  );
}
