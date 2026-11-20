import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-24 text-center">
      <div className="max-w-md space-y-6">
        <span className="text-xs uppercase tracking-widest text-[#D4AF69] font-mono">
          Error 404 &bull; Record Not Located
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#F5F1E8]">
          Page Not Found
        </h1>
        <p className="text-sm text-[#B5B0A6] leading-relaxed">
          The requested trade route or catalog item does not exist or has been relocated within the IPM Exim directory.
        </p>
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF69] hover:bg-[#B89146] text-[#0B0B0B] text-xs font-semibold uppercase tracking-wider transition-colors shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Global Gateway</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
