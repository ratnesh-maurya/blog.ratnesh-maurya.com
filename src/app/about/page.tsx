import { OgImageInBody } from '@/components/OgImageInBody';
import { PageStatsTracker } from '@/components/PageStatsTracker';
import { BreadcrumbStructuredData } from '@/components/StructuredData';
import { getAllBlogPosts } from '@/lib/content';
import { oembedAlternate } from '@/lib/oembed';
import { getStoredOgImageUrl } from '@/lib/og';
import { getNowContent } from '@/lib/static-content';
import { getUsesContent } from '@/lib/static-content';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About — Ratnesh Maurya',
  description: 'Ratnesh Maurya is a backend engineer specialising in system design, distributed systems, and scalable architecture. Based in India, building and writing about what matters in software.',
  keywords: ['Ratnesh Maurya', 'backend engineer', 'system design', 'distributed systems', 'Go', 'TypeScript', 'about', 'now', 'uses'],
  alternates: { canonical: 'https://blog.ratnesh-maurya.com/about', types: { ...oembedAlternate('/about') } },
  openGraph: {
    title: 'About — Ratnesh Maurya',
    description: 'Backend engineer specialising in system design, distributed systems, and scalable architecture.',
    url: 'https://blog.ratnesh-maurya.com/about',
    siteName: 'Ratn Labs',
    type: 'profile',
    locale: 'en_US',
    images: [{ url: getStoredOgImageUrl('about'), width: 1200, height: 630, alt: 'About — Ratnesh Maurya' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About — Ratnesh Maurya',
    description: 'Backend engineer specialising in system design, distributed systems, and scalable architecture.',
    creator: '@ratnesh_maurya',
    images: [getStoredOgImageUrl('about')],
  },
  robots: { index: true, follow: true },
};

const skills = [
  { group: 'Languages', items: ['Go', 'Elixir', 'TypeScript', 'JavaScript', 'SQL'] },
  { group: 'Backend', items: ['REST APIs', 'gRPC', 'Microservices', 'RAG / AI Assistants', 'Secure APIs'] },
  { group: 'Databases', items: ['PostgreSQL', 'Redis', 'MongoDB', 'MySQL'] },
  { group: 'Cloud & Infra', items: ['AWS', 'Kubernetes', 'Docker', 'CI/CD', 'Linux'] },
  { group: 'Frontend', items: ['React', 'Next.js', 'Tailwind CSS', 'HTML', 'CSS'] },
  { group: 'Concepts', items: ['System Design', 'Distributed Systems', 'Cloud-Native', 'Scalable Architecture', 'Encryption'] },
];

const projects = [
  { name: 'Personal Tracker', desc: 'A comprehensive personal tracker to help you build better habits.', href: 'https://tracker.ratnesh-maurya.com/' },
  { name: 'Rehabify', desc: 'A comprehensive management platform for Nasha Mukti Kendras (de-addiction centers).', href: 'https://rehabify.ratnesh-maurya.com/home' },
  { name: 'JSONic', desc: 'A lightweight and powerful utility for working with JSON data.', href: 'https://jsonic.ratnesh-maurya.com/' },
  { name: 'MDConverter', desc: 'Instantly transform any text into beautiful markdown. Just paste and watch.', href: 'https://mdconverter.ratnesh-maurya.com/' },
];

const timeline = [
  { year: 'Aug 2024–Now', title: 'Software Engineer', org: 'Initializ.ai', desc: 'Architecting and developing high-traffic lending platforms serving thousands of concurrent users. Building a RAG-based AI Assistant for the Initializ platform. Go, Elixir, Kubernetes, AWS.' },
  { year: 'Aug 2023–Jul 2024', title: 'SDE Intern', org: 'Initializ.ai', desc: 'Built secure client-side encryption modules and custom Kubernetes controllers for automated infrastructure management.' },
  { year: 'Mar 2023–Aug 2023', title: 'Software Developer Intern', org: 'EMSEC', desc: 'Engineered a secure and scalable backend system to manage SSL certificate data from over 100 websites.' },
];

const socials = [
  { label: 'GitHub', href: 'https://github.com/ratnesh-maurya', icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/ratnesh-maurya', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
  { label: 'Twitter / X', href: 'https://x.com/ratnesh_maurya_', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
];

export default async function AboutPage() {
  const posts = await getAllBlogPosts();
  const featuredPosts = posts.slice(0, 3);
  const { lastUpdated, sections: nowSections } = getNowContent();
  const { sections: usesSections } = getUsesContent();

  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'About', url: 'https://blog.ratnesh-maurya.com/about' },
  ];

  return (
    <>
      <OgImageInBody src={getStoredOgImageUrl('about')} alt="About — Ratnesh Maurya" />
      <BreadcrumbStructuredData items={breadcrumbItems} />

      <div className="min-h-screen" style={{ backgroundColor: 'transparent' }}>
        {/* Hero */}
        <div className="hero-gradient-bg">
          <div className="page-header max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
              <div className="relative flex-shrink-0">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-lg"
                  style={{ outline: '2px solid var(--accent-200)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://avatars.githubusercontent.com/u/85143283?v=4"
                    alt="Ratnesh Maurya"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 bg-green-400"
                  style={{ borderColor: 'var(--background)' }}
                  title="Currently at Initializ.ai"
                />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color: 'var(--accent-500)' }}>
                  About me
                </p>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2"
                  style={{ color: 'var(--text-primary)' }}>
                  Ratnesh Maurya
                </h1>
                <p className="text-base font-medium mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Software Engineer &middot; Go &amp; Elixir &middot; Cloud-Native
                </p>
                <div className="flex flex-wrap gap-2">
                  {socials.map(s => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200 hover:shadow-sm"
                      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text-secondary)' }}>
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d={s.icon} />
                      </svg>
                      {s.label}
                    </a>
                  ))}
                  <a href="https://ratnesh-maurya.com" target="_blank" rel="noopener noreferrer"
                    className="nb-badge nb-badge-primary inline-flex items-center gap-1.5 transition-opacity duration-150 hover:opacity-75">
                    Portfolio &rarr;
                  </a>
                </div>
              </div>
            </div>

            {/* In-page nav for sections */}
            <nav className="mt-10 flex flex-wrap gap-2" aria-label="Page sections">
              {['Background', 'Now', 'Skills', 'Projects', 'Journey', 'Uses', 'Writing'].map(s => (
                <a key={s} href={`#${s.toLowerCase()}`}
                  className="text-xs font-medium px-3 py-1.5 rounded-full border transition-colors hover:shadow-sm"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                  {s}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-16">

          {/* Bio */}
          <section id="background">
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-6"
              style={{ color: 'var(--text-muted)' }}>
              Background
            </h2>
            <div className="space-y-4 max-w-3xl">
              {[
                "I'm a passionate Software Development Engineer at Initializ with experience building scalable backend systems and cloud-native applications. I specialize in crafting robust, high-performance solutions that handle thousands of concurrent users.",
                "My expertise lies in backend development with Go, Elixir, PostgreSQL, Redis, Kubernetes and AWS — focusing on distributed systems, microservices architectures, and secure APIs.",
                "I write about things I learn while building: system design tradeoffs, Go internals, AWS infrastructure, and the occasional silly bug that cost me three hours. The goal is to capture genuine insights from real engineering work, not textbook theory.",
              ].map((p, i) => (
                <p key={i} className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {p}
                </p>
              ))}
            </div>
          </section>

          {/* Stats bar */}
          <section>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Blog posts', value: posts.length.toString() },
                { label: 'Topics covered', value: [...new Set(posts.map(p => p.category))].length.toString() },
                { label: 'Years writing', value: '2+' },
                { label: 'Open source', value: '\u221E' },
              ].map(stat => (
                <div key={stat.label} className="rounded-2xl p-6 text-center transition-all duration-150 hover:-translate-y-0.5"
                  style={{ backgroundColor: 'var(--nb-card-0)', border: '2px solid var(--nb-border)', boxShadow: 'var(--nb-shadow-sm)' }}>
                  <div className="text-3xl font-extrabold mb-1" style={{ color: '#1C1C1A' }}>
                    {stat.value}
                  </div>
                  <div className="text-xs font-medium" style={{ color: '#545450' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Now */}
          <section id="now">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: 'var(--text-muted)' }}>
                What I&apos;m doing now
              </h2>
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full"
                style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Updated {lastUpdated}
              </span>
            </div>
            <div className="space-y-8">
              {nowSections.map(section => (
                <div key={section.heading} className="flex gap-5">
                  <div className="text-2xl mt-0.5 flex-shrink-0">{section.emoji}</div>
                  <div>
                    <h3 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                      {section.heading}
                    </h3>
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
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section id="skills">
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-6"
              style={{ color: 'var(--text-muted)' }}>
              Skills & Technologies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map(group => (
                <div key={group.group} className="rounded-2xl p-5 transition-shadow duration-200 hover:shadow-md"
                  style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <h3 className="text-xs font-semibold uppercase tracking-wider mb-3"
                    style={{ color: 'var(--accent-500)' }}>
                    {group.group}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map(item => (
                      <span key={item} className="text-xs px-2.5 py-1 rounded-md font-medium"
                        style={{ backgroundColor: 'var(--surface-muted)', color: 'var(--text-secondary)' }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Projects */}
          <section id="projects">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: 'var(--text-muted)' }}>
                Projects
              </h2>
              <a href="https://ratnesh-maurya.com" target="_blank" rel="noopener noreferrer"
                className="text-xs font-semibold"
                style={{ color: 'var(--accent-500)' }}>
                See all &#8599;
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map(proj => (
                <a key={proj.name} href={proj.href} target="_blank" rel="noopener noreferrer"
                  className="project-card flex flex-col gap-1.5 p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                  <span className="text-sm font-semibold transition-colors group-hover:text-[var(--accent-500)]"
                    style={{ color: 'var(--text-primary)' }}>
                    {proj.name}
                  </span>
                  <span className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {proj.desc}
                  </span>
                </a>
              ))}
            </div>
          </section>

          {/* Timeline */}
          <section id="journey">
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-6"
              style={{ color: 'var(--text-muted)' }}>
              Journey
            </h2>
            <div className="space-y-0">
              {timeline.map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: 'var(--accent-400)' }} />
                    {i < timeline.length - 1 && (
                      <div className="w-px flex-1 mt-1" style={{ backgroundColor: 'var(--accent-200)' }} />
                    )}
                  </div>
                  <div className="pb-10">
                    <p className="text-xs font-mono font-semibold mb-1" style={{ color: 'var(--accent-500)' }}>
                      {item.year}
                    </p>
                    <h3 className="text-base font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>
                      {item.title}
                    </h3>
                    <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                      {item.org}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Uses */}
          <section id="uses">
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-6"
              style={{ color: 'var(--text-muted)' }}>
              Tools & Setup
            </h2>
            <div className="space-y-10">
              {usesSections.map(section => (
                <div key={section.title}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">{section.emoji}</span>
                    <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                      {section.title}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {section.items.map(item => (
                      <div key={item.name}
                        className="flex items-start gap-4 p-4 rounded-2xl border transition-shadow duration-200 hover:shadow-sm"
                        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            {item.href ? (
                              <a href={item.href} target="_blank" rel="noopener noreferrer"
                                className="text-sm font-semibold transition-colors hover:text-[var(--accent-500)]"
                                style={{ color: 'var(--text-primary)' }}>
                                {item.name} &#8599;
                              </a>
                            ) : (
                              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                                {item.name}
                              </span>
                            )}
                            {item.badge && (
                              <span className="nb-badge nb-badge-primary">
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
                </div>
              ))}
            </div>
          </section>

          {/* Featured Posts */}
          <section id="writing">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: 'var(--text-muted)' }}>
                Recent Writing
              </h2>
              <Link href="/blog" className="text-xs font-semibold"
                style={{ color: 'var(--accent-500)' }}>
                All posts &rarr;
              </Link>
            </div>
            <div className="space-y-3">
              {featuredPosts.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`}
                  className="flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md group"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1"
                      style={{ color: 'var(--accent-500)' }}>
                      {post.category}
                    </p>
                    <h3 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-[var(--accent-500)] transition-colors"
                      style={{ color: 'var(--text-primary)' }}>
                      {post.title}
                    </h3>
                  </div>
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5 transition-transform duration-200 group-hover:translate-x-0.5"
                    style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-2xl p-8 text-center"
            style={{ backgroundColor: 'var(--nb-card-1)', border: '2px solid var(--nb-border)', boxShadow: 'var(--nb-shadow)' }}>
            <h2 className="text-xl font-extrabold tracking-tight mb-2" style={{ color: '#1C1C1A' }}>
              Let&apos;s connect
            </h2>
            <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: '#545450' }}>
              I&apos;m always happy to talk about system design, backend engineering, or interesting engineering problems.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="https://linkedin.com/in/ratnesh-maurya" target="_blank" rel="noopener noreferrer"
                className="nb-btn nb-btn-primary inline-flex items-center gap-2">
                Connect on LinkedIn
              </a>
              <a href="https://x.com/ratnesh_maurya_" target="_blank" rel="noopener noreferrer"
                className="nb-btn inline-flex items-center gap-2" style={{ color: '#1C1C1A' }}>
                Follow on X
              </a>
            </div>
          </section>
        </div>
      </div>
      <PageStatsTracker type="about" slug="about" />
    </>
  );
}
