/** Tunables for the daily news digest (scripts/fetch-news.ts). */

export const DEFAULT_TIMEZONE = 'Asia/Kolkata';

/** Tavily look-back window. Widened once if too few new stories survive dedupe. */
export const SEARCH_DAYS = 2;
export const WIDE_SEARCH_DAYS = 5;

export const RESULTS_PER_TOPIC = 6;
/** Stories sent to the model. */
export const MAX_STORIES = 10;
/** Below this many new stories, skip publishing instead of shipping a thin digest. */
export const MIN_STORIES = 3;
/** Keeps one outlet from dominating the digest. */
export const MAX_PER_DOMAIN = 3;
/** Stories beyond this many become one-line "Quick hits" (lowest importance first). */
export const FULL_SECTION_LIMIT = 7;

export const GEMINI_MODEL = 'gemini-2.5-flash';

export interface NewsTopic {
  id: string;
  /** Used as a hint for the model's category assignment. */
  label: string;
  /** Plain-language query — Tavily is a semantic search, it does not evaluate boolean operators. */
  query: string;
}

export const TOPICS: NewsTopic[] = [
  {
    id: 'ai-models',
    label: 'AI Models',
    query: 'new AI model releases, benchmarks and announcements from OpenAI, Anthropic, Google DeepMind, Meta, Mistral and open-weight labs',
  },
  {
    id: 'ai-tooling',
    label: 'AI Agents & Tooling',
    query: 'AI coding agents, MCP, LLM developer tooling, inference costs and API pricing changes for developers',
  },
  {
    id: 'dev-tools',
    label: 'Developer Tools',
    query: 'programming language and framework releases: Go, Rust, TypeScript, Next.js, React, GitHub and open source developer tools',
  },
  {
    id: 'infra',
    label: 'Cloud & Infrastructure',
    query: 'cloud infrastructure, databases, Kubernetes and distributed systems: major releases, architecture write-ups and outages',
  },
  {
    id: 'security',
    label: 'Security',
    query: 'security vulnerabilities, CVEs, supply-chain attacks and breaches affecting developers and open source software',
  },
];

/** Category names the model may use; anything else is mapped to "Industry". */
export const CATEGORIES = [
  'AI Models',
  'AI Agents & Tooling',
  'Developer Tools',
  'Cloud & Infrastructure',
  'Security',
  'Industry',
] as const;
export type Category = (typeof CATEGORIES)[number];

/** Curated, engineering-focused sources (Tavily matches subdomains too). */
export const INCLUDE_DOMAINS = [
  // News / analysis
  'techcrunch.com', 'theverge.com', 'wired.com', 'arstechnica.com', 'venturebeat.com',
  'zdnet.com', 'engadget.com', 'theregister.com', 'techmeme.com', 'siliconangle.com',
  // Engineering press and commentary
  'thenewstack.io', 'infoq.com', 'dev.to', 'stackoverflow.blog',
  'simonwillison.net', 'pragmaticengineer.com', 'latent.space',
  // Labs and platform vendors
  'openai.com', 'anthropic.com', 'deepmind.google', 'blog.google', 'ai.meta.com',
  'mistral.ai', 'huggingface.co', 'github.blog', 'devblogs.microsoft.com',
  'aws.amazon.com', 'cloud.google.com', 'vercel.com', 'nextjs.org',
  // Language and infra projects
  'go.dev', 'blog.rust-lang.org', 'kubernetes.io', 'cncf.io', 'blog.cloudflare.com',
  'netflixtechblog.com', 'engineering.fb.com',
  // Security
  'bleepingcomputer.com', 'thehackernews.com', 'krebsonsecurity.com',
];
