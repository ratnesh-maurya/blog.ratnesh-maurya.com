import { Metadata } from 'next';
import { BreadcrumbStructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Now — What I\'m Up To | Ratn Labs',
  description: 'What Ratnesh Maurya is working on, learning, reading, and thinking about right now. Updated regularly.',
  keywords: ['now page', 'Ratnesh Maurya now', 'what I am working on', 'current projects'],
  alternates: { canonical: 'https://blog.ratnesh-maurya.com/now' },
  openGraph: {
    title: 'Now — Ratn Labs',
    description: "What I'm working on, learning, and reading right now.",
    url: 'https://blog.ratnesh-maurya.com/now',
    siteName: 'Ratn Labs',
    type: 'profile',
  },
  twitter: { card: 'summary_large_image', title: 'Now — Ratn Labs', creator: '@ratnesh_maurya' },
  robots: { index: true, follow: true },
};

// Update this date whenever you update the page content
const LAST_UPDATED = 'February 2026';

const sections = [
  {
    emoji: '💼',
    heading: 'Work',
    content: [
      'Software Engineer at Initializ.ai — architecting a high-traffic lending platform and building a RAG-based AI assistant to help users query and understand their infrastructure.',
      'Focused on Go and Elixir backends, Kubernetes deployments, and AWS infrastructure.',
    ],
  },
  {
    emoji: '🔨',
    heading: 'Building',
    content: [
      'This blog — adding new content, improving SEO, and making the reading experience better.',
      'Small internal tooling at work to automate repetitive infrastructure tasks.',
    ],
  },
  {
    emoji: '📖',
    heading: 'Reading',
    content: [
      'Designing Data-Intensive Applications by Martin Kleppmann — rereading chapters on replication and distributed transactions.',
      '100 Go Mistakes and How to Avoid Them by Teiva Harsanyi.',
    ],
  },
  {
    emoji: '🧠',
    heading: 'Learning',
    content: [
      'Going deeper into Elixir — OTP, GenServers, and the fault-tolerance model.',
      'Exploring vector databases and embedding pipelines for the RAG system at work.',
    ],
  },
  {
    emoji: '✍️',
    heading: 'Writing',
    content: [
      'Working on a post about how Kubernetes controllers work internally.',
      'Planning a series on building distributed systems in Go from scratch.',
    ],
  },
];

export default function NowPage() {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'Now', url: 'https://blog.ratnesh-maurya.com/now' },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">

          {/* Header */}
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--accent-500)' }}>
              /now
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
              style={{ color: 'var(--text-primary)' }}>
              What I&apos;m doing now
            </h1>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              A snapshot of what I&apos;m focused on right now. Inspired by{' '}
              <a href="https://nownownow.com/about" target="_blank" rel="noopener noreferrer"
                className="underline underline-offset-2" style={{ color: 'var(--accent-500)' }}>
                Derek Sivers&apos; now page movement
              </a>.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
              style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              Last updated: {LAST_UPDATED}
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map(section => (
              <section key={section.heading} className="flex gap-5">
                <div className="text-2xl mt-0.5 flex-shrink-0">{section.emoji}</div>
                <div>
                  <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    {section.heading}
                  </h2>
                  <ul className="space-y-2">
                    {section.content.map((line, i) => (
                      <li key={i} className="text-sm leading-relaxed flex gap-2"
                        style={{ color: 'var(--text-secondary)' }}>
                        <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                          style={{ backgroundColor: 'var(--accent-400)' }} />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-16 pt-8 text-sm" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            <p>
              This page is updated whenever something significant changes. If you want to follow along, subscribe to the{' '}
              <a href="/newsletter" className="underline underline-offset-2" style={{ color: 'var(--accent-500)' }}>
                newsletter
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
