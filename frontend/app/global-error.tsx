'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0B1120', color: '#F8FAFC', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '1rem', color: '#D4AF69' }}>
            Application Error
          </h2>
          <p style={{ maxWidth: '480px', color: '#94A3B8', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            An unexpected error occurred. Our team has been notified.
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: '0.75rem 1.75rem',
              borderRadius: '0.75rem',
              backgroundColor: '#D4AF69',
              color: '#0B1120',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              boxShadow: '0 4px 14px rgba(212, 175, 105, 0.3)'
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
