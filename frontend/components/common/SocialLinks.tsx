import React from 'react';
import { COMPANY_INFO } from '@/data/company';

export const FacebookIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export const LinkedinIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

export const IndiaMartIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <span className="font-bold text-[10px] tracking-tight uppercase px-1 py-0.5 border border-current rounded-none inline-flex items-center justify-center leading-none">
    IndiaMART
  </span>
);

interface SocialLinksProps {
  className?: string;
  iconSize?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  className = '',
  iconSize = 'md',
  showLabels = false,
}) => {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const padClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  };

  const links = [
    {
      name: 'Facebook',
      url: COMPANY_INFO.socialLinks.facebook,
      icon: <FacebookIcon className={sizeClasses[iconSize]} />,
    },
    {
      name: 'Instagram',
      url: COMPANY_INFO.socialLinks.instagram,
      icon: <InstagramIcon className={sizeClasses[iconSize]} />,
    },
    {
      name: 'LinkedIn',
      url: COMPANY_INFO.socialLinks.linkedin,
      icon: <LinkedinIcon className={sizeClasses[iconSize]} />,
    },
    {
      name: 'IndiaMART',
      url: COMPANY_INFO.socialLinks.indiamart,
      icon: <IndiaMartIcon className={sizeClasses[iconSize]} />,
    },
  ];

  return (
    <div className={`flex items-center flex-wrap gap-2 ${className}`}>
      {links.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          title={`Visit IPM Exim on ${link.name}`}
          aria-label={`Visit IPM Exim on ${link.name}`}
          className={`border transition-all flex items-center gap-1.5 ${padClasses[iconSize]} hover:scale-105 cursor-pointer shadow-sm`}
          style={{
            backgroundColor: 'var(--bg-card-elevated)',
            borderColor: 'var(--border-input)',
            color: 'var(--text-muted)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--gold)';
            e.currentTarget.style.borderColor = 'var(--gold)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.borderColor = 'var(--border-input)';
          }}
        >
          {link.icon}
          {showLabels && <span className="text-xs font-medium">{link.name}</span>}
        </a>
      ))}
    </div>
  );
};
