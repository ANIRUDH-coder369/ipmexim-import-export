'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Anchor,
  Play,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Navigation,
  ArrowRight,
  X,
  Truck,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { getApiUrl } from '@/utils/apiConfig';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export interface ShipmentItem {
  _id?: string;
  id?: string;
  title: string;
  fromLocation: string;
  toLocation: string;
  date: string;
  mediaLink: string;
  description?: string;
  status: 'In Transit' | 'Scheduled' | 'Dispatched' | 'Delivered';
  isActive?: boolean;
}

// Helper to extract YouTube embed URL from various YouTube formats
export const getYouTubeEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  try {
    const trimmed = url.trim();

    // Match standard watch URL (e.g. youtube.com/watch?v=ID)
    const watchMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (watchMatch && watchMatch[1]) {
      return `https://www.youtube-nocookie.com/embed/${watchMatch[1]}?autoplay=1&rel=0`;
    }

    // Match Shorts (e.g. youtube.com/shorts/ID)
    const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([^"&?\/\s]{11})/i);
    if (shortsMatch && shortsMatch[1]) {
      return `https://www.youtube-nocookie.com/embed/${shortsMatch[1]}?autoplay=1&rel=0`;
    }

    return null;
  } catch (e) {
    return null;
  }
};

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<ShipmentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Video Modal State
  const [activeVideoModal, setActiveVideoModal] = useState<{
    isOpen: boolean;
    title: string;
    embedUrl: string | null;
    rawLink: string;
  }>({
    isOpen: false,
    title: '',
    embedUrl: null,
    rawLink: ''
  });

  const fetchShipments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/shipments`);
      if (!res.ok) {
        throw new Error(`Failed to load shipments: HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.shipments)) {
        setShipments(data.shipments);
      } else {
        setShipments([]);
      }
    } catch (err: any) {
      console.error('Error fetching shipments:', err);
      setError(err.message || 'Unable to connect to shipments server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  // Filter and ensure sequence on date upside (newest date first)
  const filteredShipments = shipments
    .filter((item) => {
      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title?.toLowerCase().includes(q);
        const matchesFrom = item.fromLocation?.toLowerCase().includes(q);
        const matchesTo = item.toLocation?.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q);
        return matchesTitle || matchesFrom || matchesTo || matchesDesc;
      }
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleOpenMedia = (item: ShipmentItem) => {
    const embedUrl = getYouTubeEmbedUrl(item.mediaLink);
    if (embedUrl) {
      setActiveVideoModal({
        isOpen: true,
        title: item.title,
        embedUrl,
        rawLink: item.mediaLink
      });
    } else {
      // If not YouTube, open link directly in a secure new tab
      window.open(item.mediaLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060D1A] text-white">
      <Header />

      <main className="flex-1 pb-24">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Ambient Lighting Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#D4AF69]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md mb-6">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs uppercase tracking-widest font-semibold text-cyan-300">
                Verified Global Trade Logistics
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-white mb-6">
              Live Consignments &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF69] via-amber-200 to-cyan-300">Trade Journeys</span>
            </h1>

            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed mb-10">
              Track active and scheduled export dispatches from Indian gateway ports to global destinations.
              Click on any consignment to view video proof, inspection footage, and maritime transit details.
            </p>

            {/* Quick Filter & Search Bar */}
            <div className="max-w-3xl mx-auto p-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center gap-2">
              <div className="relative w-full flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by Origin, Destination, or Product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/50 transition-colors"
                />
              </div>

              {/* Status Pills */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {['ALL', 'In Transit', 'Scheduled', 'Delivered'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      statusFilter === status
                        ? 'bg-[#D4AF69] text-black shadow-lg shadow-[#D4AF69]/20'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Consignment Journey Cards (Sorted by Date Upside) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-slate-400">Loading live trade journeys...</p>
            </div>
          ) : error ? (
            <div className="py-16 text-center">
              <div className="inline-flex items-center gap-2 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span>{error}</span>
              </div>
              <div className="mt-4">
                <button
                  onClick={fetchShipments}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
                >
                  Retry Connection
                </button>
              </div>
            </div>
          ) : filteredShipments.length === 0 ? (
            <div className="py-20 text-center rounded-2xl border border-white/10 bg-white/5 p-8 max-w-lg mx-auto">
              <Truck className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className="text-lg font-serif font-medium text-white mb-1">No Consignments Found</h3>
              <p className="text-xs text-slate-400 mb-4">
                No shipments match your current filter criteria.
              </p>
              {(searchQuery || statusFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('ALL');
                  }}
                  className="text-xs text-cyan-400 hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShipments.map((item, idx) => {
                const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });

                const isYouTube = Boolean(getYouTubeEmbedUrl(item.mediaLink));

                return (
                  <div
                    key={item._id || item.id || idx}
                    className="group relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-6 backdrop-blur-xl shadow-xl hover:border-cyan-400/40 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Bar: Calendar Date badge & Status Pill */}
                      <div className="flex items-center justify-between gap-3 mb-5">
                        {/* Calendar Date (Upside sequence highlighted) */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-300 text-xs font-mono font-medium">
                          <Calendar className="w-3.5 h-3.5 text-[#D4AF69]" />
                          <span>{formattedDate}</span>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${
                            item.status === 'In Transit'
                              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                              : item.status === 'Delivered'
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {item.status === 'In Transit' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
                          )}
                          {item.status === 'Delivered' && (
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          )}
                          {item.status === 'Scheduled' && (
                            <Clock className="w-3 h-3 text-amber-400" />
                          )}
                          <span>{item.status}</span>
                        </span>
                      </div>

                      {/* Consignment Title */}
                      <h3 className="text-lg font-serif font-normal text-white group-hover:text-amber-200 transition-colors mb-4 line-clamp-2">
                        {item.title}
                      </h3>

                      {/* Origin & Reach Destination Visual Route */}
                      <div className="rounded-xl border border-white/5 bg-black/25 p-4 space-y-3 mb-4">
                        {/* Origin (Where from) */}
                        <div className="flex items-start gap-2.5">
                          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0 mt-0.5">
                            <Anchor className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                              Origin (From Port / Country)
                            </span>
                            <span className="text-xs font-medium text-slate-200 block">
                              {item.fromLocation}
                            </span>
                          </div>
                        </div>

                        {/* Route Connector Arrow */}
                        <div className="pl-4 flex items-center gap-2 text-cyan-400/60">
                          <div className="h-4 w-px bg-cyan-500/30 ml-0.5" />
                          <ArrowRight className="w-3 h-3 text-cyan-400" />
                          <span className="text-[10px] font-mono text-cyan-300/80 uppercase">
                            Global Ocean Transit
                          </span>
                        </div>

                        {/* Destination (Reach destination) */}
                        <div className="flex items-start gap-2.5">
                          <div className="p-1.5 rounded-lg bg-[#D4AF69]/10 border border-[#D4AF69]/20 text-[#D4AF69] shrink-0 mt-0.5">
                            <MapPin className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                              Reach Destination (Port / Country)
                            </span>
                            <span className="text-xs font-medium text-amber-200 block">
                              {item.toLocation}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Description if present */}
                      {item.description && (
                        <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-3">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Bottom Action: Video / Media Link Button */}
                    <div className="pt-2 border-t border-white/5">
                      <button
                        onClick={() => handleOpenMedia(item)}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-cyan-500/15 hover:border-cyan-400/40 text-xs font-semibold text-white transition-all duration-200 group-hover:shadow-md"
                      >
                        {isYouTube ? (
                          <>
                            <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0">
                              <Play className="w-3 h-3 fill-current ml-0.5" />
                            </div>
                            <span>Watch YouTube Video Proof</span>
                          </>
                        ) : (
                          <>
                            <ExternalLink className="w-4 h-4 text-cyan-400" />
                            <span>View External Video / Tracking Link</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Video Player Modal */}
        {activeVideoModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-3xl rounded-2xl border border-white/15 bg-[#0D1527] shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <h3 className="text-sm sm:text-base font-serif font-medium text-white truncate max-w-md">
                    {activeVideoModal.title}
                  </h3>
                </div>
                <button
                  onClick={() =>
                    setActiveVideoModal({ isOpen: false, title: '', embedUrl: null, rawLink: '' })
                  }
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Video Iframe Container */}
              <div className="relative w-full pb-[56.25%] bg-black">
                {activeVideoModal.embedUrl ? (
                  <iframe
                    src={activeVideoModal.embedUrl}
                    title={activeVideoModal.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs">
                    Unable to embed video.
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between px-6 py-3 border-t border-white/10 text-xs">
                <span className="text-slate-400">IPM Exim Official Video Inspection</span>
                <a
                  href={activeVideoModal.rawLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-cyan-400 hover:underline"
                >
                  <span>Open directly in YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
