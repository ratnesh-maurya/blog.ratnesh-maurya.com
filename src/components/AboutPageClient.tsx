'use client';

import Link from 'next/link';
import Image from 'next/image';

export function AboutPageClient() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-40 h-40 mx-auto mb-8 rounded-full overflow-hidden shadow-2xl ring-4" style={{ '--tw-ring-color': 'var(--primary-200)' } as React.CSSProperties}>
            <Image
              src="https://avatars.githubusercontent.com/u/85143283?v=4"
              alt="Ratnesh Maurya - Software Engineer"
              width={160}
              height={160}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              priority
            />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold gradient-text-primary mb-4">
            Ratnesh Maurya
          </h1>
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-2xl">🇮🇳</span>
            <p className="text-xl font-medium" style={{ color: 'var(--text-primary)' }}>
              Software Engineer @Initializ
            </p>
          </div>
          <p className="text-lg leading-relaxed max-w-4xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Hi there! I&apos;m a passionate Software Development Engineer specializing in backend development 
            and cloud-native technologies. Currently working at Initializ, I love building scalable systems 
            with Golang and Elixir, sharing knowledge, and occasionally asking silly questions that lead to great discoveries.
          </p>
          
          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-8 mt-8 text-sm" style={{ color: 'var(--text-muted)' }}>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span>65 followers</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>31 stars</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
              </svg>
              <span>32 repositories</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          {/* Story */}
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-2xl shadow-sm border p-8" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>My Story</h2>
              <div className="prose prose-lg max-w-none leading-relaxed space-y-4" style={{ color: 'var(--text-secondary)' }}>
                <p>
                  My journey in backend engineering started with curiosity and a passion for building scalable systems.
                  Like many engineers, I&apos;ve made my fair share of mistakes – from database design flaws
                  to accidentally bringing down production servers (yes, that happened).
                </p>
                <p>
                  But here&apos;s the thing: every mistake taught me something valuable. Every &ldquo;silly question&rdquo;
                  I asked led to deeper understanding. That&apos;s why I created this blog – to share not just
                  the polished tutorials, but also the messy, real-world experiences that make us better engineers.
                </p>
                <p>
                  When I&apos;m not coding, you&apos;ll find me exploring new backend technologies, optimizing database queries,
                  contributing to open source projects, or writing about the latest trends in backend development.
                  I believe in learning in public and helping others avoid the pitfalls I&apos;ve stumbled into.
                </p>
              </div>
            </div>

            <div className="rounded-2xl shadow-sm border p-8" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>What You&apos;ll Find Here</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Backend Engineering</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Deep dives into backend systems, APIs, databases, and scalable architecture.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Silly Questions</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Those &ldquo;dumb&rdquo; questions that actually lead to brilliant insights and solutions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Featured */}
            <div className="rounded-2xl shadow-sm border p-6" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Featured</h3>
              <div className="space-y-4">
                {[
                  {
                    title: "Building Scalable APIs with Go",
                    description: "Best practices for designing robust backend services",
                    link: "/blog/scalable-apis-go",
                    type: "Blog Post"
                  },
                  {
                    title: "Database Optimization Techniques",
                    description: "Performance tuning strategies for production systems",
                    link: "/blog/database-optimization",
                    type: "Tutorial"
                  },
                  {
                    title: "Microservices with Elixir",
                    description: "Building fault-tolerant distributed systems",
                    link: "/blog/microservices-elixir",
                    type: "Deep Dive"
                  }
                ].map((item, index) => (
                  <div key={index}>
                    <Link href={item.link} className="block group">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--primary-500)' }}></div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium group-hover:underline" style={{ color: 'var(--text-primary)' }}>
                            {item.title}
                          </h4>
                          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="rounded-2xl shadow-sm border p-6" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Let&apos;s Connect</h3>
              <div className="space-y-3">
                <a
                  href="https://github.com/ratnesh-maurya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 rounded-lg border transition-all duration-200 group"
                  style={{ borderColor: 'var(--border)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary-300)';
                    e.currentTarget.style.backgroundColor = 'var(--primary-50)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <svg className="w-5 h-5 mr-3" style={{ color: 'var(--text-secondary)' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>GitHub</span>
                </a>
                <a
                  href="https://linkedin.com/in/ratnesh-maurya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 rounded-lg border transition-all duration-200 group"
                  style={{ borderColor: 'var(--border)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary-300)';
                    e.currentTarget.style.backgroundColor = 'var(--primary-50)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <svg className="w-5 h-5 mr-3" style={{ color: 'var(--text-secondary)' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>LinkedIn</span>
                </a>
              </div>
            </div>

            {/* Fun Stats */}
            <div className="rounded-2xl border p-6" style={{ 
              background: 'linear-gradient(135deg, var(--primary-50), var(--primary-100))', 
              borderColor: 'var(--primary-200)' 
            }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Fun Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Coffee consumed</span>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>∞ cups</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Bugs fixed</span>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>999+</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Lines of code</span>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>50k+</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Silly questions asked</span>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>∞</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
