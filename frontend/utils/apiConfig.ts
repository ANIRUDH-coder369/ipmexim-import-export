/**
 * API Configuration Helper
 * Resolves the API Base URL seamlessly across:
 * 1. Explicit environment variable (NEXT_PUBLIC_API_URL)
 * 2. Live Vercel / Production deployment (defaults to relative /api)
 * 3. Local development (defaults to http://localhost:5000/api)
 */
export const getApiUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    // When deployed live on Vercel or any public domain, use relative /api
    if (host !== 'localhost' && host !== '127.0.0.1') {
      return '/api';
    }
  }

  return 'http://localhost:5000/api';
};
