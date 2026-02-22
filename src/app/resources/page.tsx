import { Metadata } from 'next';
import { BreadcrumbStructuredData } from '@/components/StructuredData';
import { OgImageInBody } from '@/components/OgImageInBody';
import { getStoredOgImageUrl } from '@/lib/og';

export const metadata: Metadata = {
  title: 'Resources — Books, Talks & Tools | Ratn Labs',
  description: 'Curated books, talks, tools, and newsletters for backend engineers — system design, Go, distributed systems, and cloud-native development.',
  keywords: ['backend engineering resources', 'system design books', 'Go books', 'distributed systems resources', 'developer tools', 'engineering reading list'],
  alternates: { canonical: 'https://blog.ratnesh-maurya.com/resources' },
  openGraph: {
    title: 'Resources — Books, Talks & Tools | Ratn Labs',
    description: 'Curated resources for backend engineers — books, talks, tools, and newsletters.',
    url: 'https://blog.ratnesh-maurya.com/resources',
    siteName: 'Ratn Labs',
    type: 'website',
    images: [{ url: getStoredOgImageUrl('resources'), width: 1200, height: 630, alt: 'Resources — Ratn Labs' }],
  },
  twitter: { card: 'summary_large_image', title: 'Resources — Ratn Labs', creator: '@ratnesh_maurya', images: [getStoredOgImageUrl('resources')] },
  robots: { index: true, follow: true },
};

const resources = [
  {
    category: 'Books — System Design',
    emoji: '📐',
    items: [
      { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', desc: 'The definitive guide to building reliable, scalable, and maintainable data systems. Covers replication, partitioning, transactions, and stream processing with uncommon depth.', href: 'https://dataintensive.net/' },
      { title: 'System Design Interview (Vol 1 & 2)', author: 'Alex Xu', desc: 'Practical walkthroughs of real-world system design problems. Great for building intuition on tradeoffs before you need to make them in production.', href: 'https://bytebytego.com/' },
      { title: 'Building Microservices', author: 'Sam Newman', desc: 'The go-to reference for microservices architecture — from service decomposition to deployment, observability, and security.', href: 'https://www.oreilly.com/library/view/building-microservices-2nd/9781492034018/' },
    ],
  },
  {
    category: 'Books — Go',
    emoji: '🐹',
    items: [
      { title: 'The Go Programming Language', author: 'Donovan & Kernighan', desc: 'The definitive Go book. Dense, precise, and written by the language designers. Read it twice.', href: 'https://www.gopl.io/' },
      { title: 'Concurrency in Go', author: 'Katherine Cox-Buday', desc: 'Deep dive into Go\'s concurrency primitives — goroutines, channels, sync primitives, and patterns for writing correct concurrent code.', href: 'https://www.oreilly.com/library/view/concurrency-in-go/9781491941294/' },
      { title: '100 Go Mistakes and How to Avoid Them', author: 'Teiva Harsanyi', desc: 'Practical, mistake-driven learning. Covers common pitfalls in Go with clear explanations and fixes. Excellent for intermediate Go developers.', href: 'https://100go.co/' },
    ],
  },
  {
    category: 'Books — Backend & Architecture',
    emoji: '🏗️',
    items: [
      { title: 'Clean Architecture', author: 'Robert C. Martin', desc: 'Principles for building software that is easy to change and maintain. Focuses on separating concerns, dependency inversion, and testable architecture.', href: 'https://www.oreilly.com/library/view/clean-architecture-a/9780134494272/' },
      { title: 'Release It!', author: 'Michael T. Nygard', desc: 'Patterns for building software that survives the real world — circuit breakers, bulkheads, timeouts, and stability patterns every senior engineer should know.', href: 'https://pragprog.com/titles/mnee2/release-it-second-edition/' },
    ],
  },
  {
    category: 'Talks Worth Watching',
    emoji: '🎙️',
    items: [
      { title: 'Concurrency is not Parallelism', author: 'Rob Pike (Go author)', desc: 'The clearest explanation of the difference between concurrency and parallelism, using Go as the lens. Essential viewing before writing concurrent Go code.', href: 'https://www.youtube.com/watch?v=oV9rvDllKEg' },
      { title: 'How to Build Good Software', author: 'Li Hongyi', desc: 'Why most large software projects fail and how to think about software quality at an organisational level.', href: 'https://www.youtube.com/watch?v=6sNmJtoKDCo' },
      { title: 'The Illustrated Children\'s Guide to Kubernetes', author: 'CNCF', desc: 'Surprisingly good first-principles explanation of what Kubernetes is and why it exists.', href: 'https://www.youtube.com/watch?v=4ht22ReBjno' },
    ],
  },
  {
    category: 'Tools I Use Daily',
    emoji: '🛠️',
    items: [
      { title: 'TablePlus', author: 'TablePlus Inc.', desc: 'Clean, fast GUI for PostgreSQL, MySQL, Redis, and more. The best database client I\'ve used.', href: 'https://tableplus.com/' },
      { title: 'Warp', author: 'Warp', desc: 'A modern terminal with AI assistance, command history search, and collaborative features. Far better than iTerm2 for daily use.', href: 'https://www.warp.dev/' },
      { title: 'Insomnia / Bruno', author: 'Kong / Bruno', desc: 'API testing clients. Bruno is the open-source, Git-friendly option; Insomnia is more polished. Both beat Postman for local development.', href: 'https://www.usebruno.com/' },
      { title: 'Excalidraw', author: 'Excalidraw', desc: 'Hand-drawn style diagrams in the browser. Perfect for system design sketches and architecture diagrams.', href: 'https://excalidraw.com/' },
    ],
  },
  {
    category: 'Newsletters Worth Reading',
    emoji: '📬',
    items: [
      { title: 'ByteByteGo', author: 'Alex Xu', desc: 'Weekly system design deep-dives with excellent diagrams. Consistently high quality.', href: 'https://bytebytego.com/' },
      { title: 'The Pragmatic Engineer', author: 'Gergely Orosz', desc: 'In-depth analysis of the software engineering industry — how big tech works, engineering culture, and career insights.', href: 'https://newsletter.pragmaticengineer.com/' },
      { title: 'Go Weekly', author: 'Golang Weekly', desc: 'Curated Go news, articles, and projects every week.', href: 'https://golangweekly.com/' },
    ],
  },
];

export default function ResourcesPage() {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'Resources', url: 'https://blog.ratnesh-maurya.com/resources' },
  ];

  return (
    <>
      <OgImageInBody src={getStoredOgImageUrl('resources')} alt="Resources — Ratn Labs" />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>

        <div className="hero-gradient-bg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--accent-500)' }}>
              Reading List
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3"
              style={{ color: 'var(--text-primary)' }}>
              Resources
            </h1>
            <p className="text-base leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>
              Books, talks, tools, and newsletters that shaped how I think about backend engineering and systems. No padding — only things I have actually used.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
          {resources.map(section => (
            <section key={section.category}>
              <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-6"
                style={{ color: 'var(--text-muted)' }}>
                <span className="text-base">{section.emoji}</span>
                {section.category}
              </h2>
              <div className="space-y-3">
                {section.items.map(item => (
                  <a key={item.title} href={item.href} target="_blank" rel="noopener noreferrer"
                    className="resource-card flex gap-4 rounded-xl border p-5 transition-all duration-200 group"
                    style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-2 mb-1">
                        <h3 className="text-sm font-bold group-hover:text-[var(--accent-500)] transition-colors"
                          style={{ color: 'var(--text-primary)' }}>
                          {item.title}
                        </h3>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>by {item.author}</span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {item.desc}
                      </p>
                    </div>
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5"
                      style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
