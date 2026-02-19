import { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbStructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Cheatsheets — Go, Docker, PostgreSQL, Kubectl | Ratn Labs',
  description: 'Quick reference cheatsheets for Go, Docker, PostgreSQL, and Kubernetes kubectl. Commands, syntax, and patterns you need while building.',
  keywords: ['Go cheatsheet', 'Docker cheatsheet', 'PostgreSQL cheatsheet', 'kubectl cheatsheet', 'Kubernetes commands', 'Go syntax', 'backend reference'],
  alternates: { canonical: 'https://blog.ratnesh-maurya.com/cheatsheets' },
  openGraph: {
    title: 'Cheatsheets — Ratn Labs',
    description: 'Quick reference for Go, Docker, PostgreSQL, and Kubernetes.',
    url: 'https://blog.ratnesh-maurya.com/cheatsheets',
    siteName: 'Ratn Labs',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Cheatsheets — Ratn Labs', creator: '@ratnesh_maurya' },
  robots: { index: true, follow: true },
};

const sheets = [
  { slug: 'go', title: 'Go', subtitle: 'Syntax, concurrency, CLI, common patterns', emoji: '🐹', tags: ['goroutines', 'channels', 'interfaces', 'error handling'] },
  { slug: 'docker', title: 'Docker', subtitle: 'Dockerfile, build, run, compose commands', emoji: '🐳', tags: ['Dockerfile', 'docker-compose', 'volumes', 'networks'] },
  { slug: 'postgres', title: 'PostgreSQL', subtitle: 'Queries, indexes, JSON, admin commands', emoji: '🐘', tags: ['SELECT', 'indexes', 'JSONB', 'psql'] },
  { slug: 'kubectl', title: 'kubectl', subtitle: 'Kubernetes CLI — pods, deployments, debugging', emoji: '☸️', tags: ['pods', 'deployments', 'services', 'logs'] },
];

export default function CheatsheetsPage() {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'Cheatsheets', url: 'https://blog.ratnesh-maurya.com/cheatsheets' },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="hero-gradient-bg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--accent-500)' }}>
              Quick Reference
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3"
              style={{ color: 'var(--text-primary)' }}>
              Cheatsheets
            </h1>
            <p className="text-base leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>
              The commands and syntax I look up most. Bookmarkable quick references for the tools in my daily stack.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {sheets.map(sheet => (
              <Link key={sheet.slug} href={`/cheatsheets/${sheet.slug}`}
                className="group rounded-xl border p-6 transition-all duration-200"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{sheet.emoji}</span>
                  <div>
                    <h2 className="text-lg font-bold group-hover:text-[var(--accent-500)] transition-colors"
                      style={{ color: 'var(--text-primary)' }}>
                      {sheet.title}
                    </h2>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{sheet.subtitle}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {sheet.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-md"
                      style={{ backgroundColor: 'var(--surface-muted)', color: 'var(--text-muted)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold"
                  style={{ color: 'var(--accent-500)' }}>
                  Open cheatsheet
                  <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
