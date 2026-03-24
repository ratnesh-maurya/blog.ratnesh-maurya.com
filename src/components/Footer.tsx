'use client';

import { TotalViews } from '@/components/TotalViews';
import Link from 'next/link';

const contentLinks = [
  { label: 'Blog Posts', href: '/blog' },
  { label: 'Silly Questions', href: '/silly-questions' },
  { label: 'Today I Learned', href: '/til' },
  { label: 'Topics', href: '/topics' },
  { label: 'Series', href: '/series' },
];

const referenceLinks = [
  { label: 'Technical Terms', href: '/technical-terms' },
  { label: 'Cheatsheets', href: '/cheatsheets' },
  { label: 'Glossary', href: '/glossary' },
  { label: 'Resources', href: '/resources' },
];

const siteLinks = [
  { label: 'About', href: '/about' },
  { label: 'Newsletter', href: '/newsletter' },
  { label: 'Contact', href: '/contact' },
  { label: 'Editorial Policy', href: '/editorial-policy' },
  { label: 'Corrections', href: '/corrections' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'RSS Feed', href: '/rss.xml' },
];

const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/ratnesh-maurya',
    path: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/ratnesh-maurya',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  {
    label: 'X',
    href: 'https://x.com/ratnesh_maurya_',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  {
    label: 'Portfolio',
    href: 'https://ratnesh-maurya.com',
    path: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9',
    isStroke: true,
  },
];

function FooterSection({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="nb-section-label mb-4" style={{ color: 'var(--footer-text-muted)' }}>
        {title}
      </h4>
      <ul className="space-y-2.5">
        {links.map(link => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm font-semibold transition-colors duration-150"
              style={{ color: 'var(--footer-text-secondary)' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = 'var(--footer-text-primary)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = 'var(--footer-text-secondary)';
              }}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--footer-bg)',
        borderTop: '2px solid var(--nb-border)',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main footer grid */}
        <div className="py-14">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">

            {/* Brand */}
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="inline-flex w-8 h-8 items-center justify-center rounded-lg flex-shrink-0"
                  style={{ backgroundColor: 'var(--footer-surface)', border: '2px solid var(--footer-border)' }}
                >
                  <span className="text-xs font-black" style={{ color: 'var(--footer-text-primary)' }}>R</span>
                </span>
                <h3 className="text-xl font-black" style={{ color: 'var(--footer-text-primary)' }}>
                  Ratn<span style={{ color: 'var(--accent-500)' }}>Labs</span>
                </h3>
              </div>

              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--footer-text-secondary)' }}>
                Systems thinking, backend architecture, and AI engineering.
              </p>

              {/* Social icons */}
              <div className="flex flex-wrap gap-2">
                {socialLinks.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150 hover:scale-95"
                    style={{
                      backgroundColor: 'var(--footer-surface)',
                      border: '2px solid var(--footer-border)',
                      color: 'var(--footer-text-secondary)',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--footer-surface-hover)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-500)';
                      (e.currentTarget as HTMLElement).style.color = 'var(--footer-text-primary)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--footer-surface)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--footer-border)';
                      (e.currentTarget as HTMLElement).style.color = 'var(--footer-text-secondary)';
                    }}
                    aria-label={s.label}
                  >
                    <svg
                      className="w-4 h-4"
                      fill={s.isStroke ? 'none' : 'currentColor'}
                      stroke={s.isStroke ? 'currentColor' : undefined}
                      strokeWidth={s.isStroke ? 2 : undefined}
                      viewBox="0 0 24 24"
                    >
                      <path
                        d={s.path}
                        strokeLinecap={s.isStroke ? 'round' : undefined}
                        strokeLinejoin={s.isStroke ? 'round' : undefined}
                      />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <FooterSection title="Content" links={contentLinks} />
            <FooterSection title="Reference" links={referenceLinks} />
            <FooterSection title="Site" links={siteLinks} />
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="py-5 flex flex-col sm:flex-row justify-between items-center gap-3"
          style={{ borderTop: '1px solid var(--footer-border)' }}
        >
          <p className="text-xs font-semibold" style={{ color: 'var(--footer-text-muted)' }}>
            &copy; {new Date().getFullYear()} Ratnesh Maurya. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold" style={{ color: 'var(--footer-text-muted)' }}>
            <span>Views: <TotalViews /></span>
            <span style={{ color: 'var(--footer-border)' }}>|</span>
            <span>Next.js · Tailwind · TypeScript</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
