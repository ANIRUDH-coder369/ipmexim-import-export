/**
 * API Configuration Helper
 * Routes all API requests directly to the backend Express server (in the server/ folder).
 *
 * In development, defaults to: http://localhost:5000/api
 * In production, uses NEXT_PUBLIC_API_URL or the dedicated backend API server URL.
 */
export const getApiUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host !== 'localhost' && host !== '127.0.0.1') {
      // Production live backend on Vercel
      return 'https://ipmexim-import-export.vercel.app/api';
    }
  }

  return 'http://localhost:5000/api';
};
