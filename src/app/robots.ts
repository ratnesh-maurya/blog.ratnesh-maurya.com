import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Allow all crawlers — including AI bots (Perplexity, ChatGPT, Claude, Gemini, etc.)
      // If AI assistants index your content, they cite source URLs in answers → referral traffic.
      // This is Generative Engine Optimization (GEO) — block nothing, gain citations.
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',    // API routes have no crawl value
          '/_next/', // Next.js build internals
        ],
      },
      // Explicitly allow major search and AI crawlers
      { userAgent: 'Googlebot',      allow: '/' },
      { userAgent: 'Bingbot',        allow: '/' },
      { userAgent: 'GPTBot',         allow: '/' }, // ChatGPT — cites sources in answers
      { userAgent: 'ChatGPT-User',   allow: '/' },
      { userAgent: 'PerplexityBot',  allow: '/' }, // Perplexity — strong source citations
      { userAgent: 'anthropic-ai',   allow: '/' }, // Claude
      { userAgent: 'Claude-Web',     allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' }, // Gemini
      { userAgent: 'cohere-ai',      allow: '/' },
      { userAgent: 'CCBot',          allow: '/' }, // Common Crawl (used by many AI systems)
      { userAgent: 'Amazonbot',      allow: '/' },
      { userAgent: 'YouBot',         allow: '/' }, // You.com AI search
      { userAgent: 'Diffbot',        allow: '/' }, // Powers many AI knowledge graphs
    ],
    sitemap: 'https://blog.ratnesh-maurya.com/sitemap.xml',
    host: 'https://blog.ratnesh-maurya.com',
  };
}
