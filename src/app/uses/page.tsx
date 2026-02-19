import { Metadata } from 'next';
import { BreadcrumbStructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Uses — Tools & Setup · Ratn Labs',
  description: "The tools, software, hardware, and services Ratnesh Maurya uses daily as a backend engineer. Editor, terminal, cloud services, and dev workflow.",
  keywords: ['developer setup', 'tools', 'VS Code', 'Go tools', 'backend developer workflow', 'developer productivity', 'Ratnesh Maurya uses'],
  alternates: { canonical: 'https://blog.ratnesh-maurya.com/uses' },
  openGraph: {
    title: 'Uses — Tools & Setup · Ratn Labs',
    description: "The tools, software, and hardware I use daily as a backend engineer.",
    url: 'https://blog.ratnesh-maurya.com/uses',
    siteName: 'Ratn Labs',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uses — Tools & Setup · Ratn Labs',
    description: "The tools and setup I use daily as a backend engineer.",
    creator: '@ratnesh_maurya',
  },
  robots: { index: true, follow: true },
};

interface UsesItem {
  name: string;
  desc: string;
  href?: string;
  badge?: string;
}

interface UsesSection {
  title: string;
  emoji: string;
  items: UsesItem[];
}

const sections: UsesSection[] = [
  {
    title: 'Editor & Terminal',
    emoji: '💻',
    items: [
      { name: 'VS Code', desc: 'My daily editor. Clean, fast, and the extension ecosystem covers everything I need.', href: 'https://code.visualstudio.com', badge: 'Primary' },
      { name: 'Cursor', desc: 'AI-native IDE on top of VS Code — excellent for exploring unfamiliar codebases quickly.', href: 'https://cursor.sh' },
      { name: 'Zsh + Oh My Zsh', desc: 'Shell with sensible defaults, aliases, and plugins (git, zsh-autosuggestions, syntax highlighting).', badge: 'Daily driver' },
      { name: 'iTerm2', desc: 'Terminal emulator on macOS. Native splits, profiles per project, and solid colour themes.', href: 'https://iterm2.com' },
      { name: 'tmux', desc: 'Session management for long-running processes — invaluable when SSHing into remote servers.', href: 'https://github.com/tmux/tmux' },
    ],
  },
  {
    title: 'Languages & Runtimes',
    emoji: '⚡',
    items: [
      { name: 'Go', desc: 'My go-to (pun intended) for backend services. Compiled, fast, simple concurrency, and excellent tooling.', href: 'https://go.dev', badge: 'Favourite' },
      { name: 'TypeScript', desc: 'For anything touching the web layer — APIs, full-stack apps, tooling scripts.', href: 'https://typescriptlang.org' },
      { name: 'Python', desc: 'Scripting, data processing, and quick prototypes. Hard to beat for one-off automation.', href: 'https://python.org' },
      { name: 'Node.js', desc: 'Runtime for TypeScript services and tooling when the JS ecosystem wins.', href: 'https://nodejs.org' },
    ],
  },
  {
    title: 'Databases',
    emoji: '🗄️',
    items: [
      { name: 'PostgreSQL', desc: 'First choice for relational data. Reliable, feature-rich, and the JSONB support is underrated.', href: 'https://postgresql.org', badge: 'Preferred' },
      { name: 'MongoDB', desc: 'When the data model genuinely calls for documents. Used for content-heavy and flexible schemas.', href: 'https://mongodb.com' },
      { name: 'Redis', desc: 'Caching, pub/sub, rate limiting, and session storage. Always nearby in the stack.', href: 'https://redis.io' },
      { name: 'DynamoDB', desc: 'When I need single-digit millisecond latency at scale and can design around its constraints.', href: 'https://aws.amazon.com/dynamodb' },
    ],
  },
  {
    title: 'Cloud & Infrastructure',
    emoji: '☁️',
    items: [
      { name: 'AWS', desc: 'Primary cloud. Mostly S3, Lambda, EC2, RDS, SNS/SQS, and IAM. Deep familiarity with the pricing model too.', href: 'https://aws.amazon.com', badge: 'Primary' },
      { name: 'Docker', desc: 'Containers for local dev parity, CI pipelines, and deployment. docker-compose for multi-service local setups.', href: 'https://docker.com' },
      { name: 'GitHub Actions', desc: 'CI/CD pipelines. Simple YAML, good marketplace, free tier is generous.', href: 'https://github.com/features/actions' },
      { name: 'Vercel', desc: 'Frontend and Next.js deployments. Zero-config, edge network, excellent DX.', href: 'https://vercel.com' },
      { name: 'Linux (Ubuntu)', desc: 'All production servers run Linux. Ubuntu for predictability, documentation density, and package availability.', badge: 'Production' },
    ],
  },
  {
    title: 'Dev Tools',
    emoji: '🔧',
    items: [
      { name: 'Postman / Bruno', desc: 'API development and testing. Bruno for local-first, git-friendly collections.', href: 'https://www.usebruno.com' },
      { name: 'DBeaver', desc: 'Database GUI that works with every database I use. Saves time on schema exploration.', href: 'https://dbeaver.io' },
      { name: 'Git', desc: "Version control. Conventional commits, feature branches, squash merges. Nothing exotic.", href: 'https://git-scm.com', badge: 'Essential' },
      { name: 'k9s', desc: 'Terminal UI for Kubernetes. Makes cluster inspection and log tailing much less painful.', href: 'https://k9scli.io' },
      { name: 'jq', desc: 'JSON on the command line. Indispensable when working with API responses in scripts.', href: 'https://jqlang.github.io/jq' },
    ],
  },
  {
    title: 'This Blog\'s Stack',
    emoji: '📝',
    items: [
      { name: 'Next.js 15 (App Router)', desc: 'Framework. Server components, static generation, and API routes all in one place.', href: 'https://nextjs.org', badge: 'Powering this site' },
      { name: 'Tailwind CSS', desc: 'Utility-first CSS. Once you internalize the scale, the speed is unmatched.', href: 'https://tailwindcss.com' },
      { name: 'MongoDB Atlas', desc: 'View counts and upvotes are stored here. Free tier handles the traffic comfortably.', href: 'https://mongodb.com/atlas' },
      { name: 'Vercel', desc: 'Deployment. Every push to main deploys in ~30 seconds.', href: 'https://vercel.com' },
      { name: 'Markdown + gray-matter', desc: 'All posts are plain Markdown files in the repo. No CMS, no database for content.', href: 'https://github.com/jonschlinkert/gray-matter' },
    ],
  },
  {
    title: 'Productivity & Writing',
    emoji: '📋',
    items: [
      { name: 'Obsidian', desc: 'Personal knowledge base and drafts. Local-first, Markdown, and the graph view is genuinely useful.', href: 'https://obsidian.md', badge: 'Note taking' },
      { name: 'Linear', desc: 'Issue tracking for projects. Fast, keyboard-driven, and doesn\'t get in the way.', href: 'https://linear.app' },
      { name: 'Excalidraw', desc: 'Whiteboard for system design diagrams. Hand-drawn look makes it feel low-stakes and fast to iterate.', href: 'https://excalidraw.com' },
      { name: 'Notion', desc: 'Team docs and wikis when collaborating. Not for personal notes (too slow), but good for shared knowledge.', href: 'https://notion.so' },
    ],
  },
];

export default function UsesPage() {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'Uses', url: 'https://blog.ratnesh-maurya.com/uses' },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />

      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        {/* Header */}
        <div className="hero-gradient-bg">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-14">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--accent-500)' }}>
              Setup & tooling
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4"
              style={{ color: 'var(--text-primary)' }}>
              Uses
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              The tools, software, and services I use daily. Inspired by{' '}
              <a href="https://uses.tech" target="_blank" rel="noopener noreferrer"
                className="underline underline-offset-2 transition-colors"
                style={{ color: 'var(--accent-500)' }}>
                uses.tech
              </a>.
              Last updated February 2026.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {sections.map(section => (
            <section key={section.title}>
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xl">{section.emoji}</span>
                <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                  {section.title}
                </h2>
              </div>
              <div className="space-y-2">
                {section.items.map(item => (
                  <div key={item.name}
                    className="flex items-start gap-4 p-4 rounded-xl border"
                    style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        {item.href ? (
                          <a href={item.href} target="_blank" rel="noopener noreferrer"
                            className="text-sm font-semibold transition-colors"
                            style={{ color: 'var(--text-primary)' }}>
                            {item.name} ↗
                          </a>
                        ) : (
                          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {item.name}
                          </span>
                        )}
                        {item.badge && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)' }}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Outro */}
          <div className="rounded-2xl p-6 text-center"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Curious about something not listed? Reach out on{' '}
              <a href="https://x.com/ratnesh_maurya_" target="_blank" rel="noopener noreferrer"
                className="font-medium" style={{ color: 'var(--accent-500)' }}>
                Twitter/X
              </a>{' '}or{' '}
              <a href="https://linkedin.com/in/ratnesh-maurya" target="_blank" rel="noopener noreferrer"
                className="font-medium" style={{ color: 'var(--accent-500)' }}>
                LinkedIn
              </a>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
