export interface ArticleReference {
  title: string;
  url: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  /** ISO date string. When set, drives `dateModified` / `og:article:modified_time`.
   *  Distinct value from `date` is the freshness signal Google trusts. */
  updated?: string;
  author: string;
  tags: string[];
  category: string;
  readingTime: string;
  featured?: boolean;
  image?: string;
  socialImage?: string; // Custom social sharing image
  questions?: string[]; // SEO questions for FAQ structured data (not displayed on page)
  /** Optional technical-article details. All are shown only when present. */
  /** Main programming language, e.g. "Go". */
  language?: string;
  /** Framework or library the article is about, e.g. "Next.js". */
  framework?: string;
  /** Version the examples were written against, e.g. "Go 1.23". */
  softwareVersion?: string;
  /** Where the examples were actually run, e.g. "macOS 15, Postgres 16". Only fill in what was really tested. */
  testedEnvironment?: string;
  /** http(s) URL of a repository with the article's code. */
  repo?: string;
  /** Official docs and other sources the article relies on. */
  references?: ArticleReference[];
  content: string;
  /** Raw markdown/MDX source before HTML processing. Used for "Copy as Markdown". */
  rawContent?: string;
  /** When 'mdx', content is raw MDX source; when 'md' or omitted, content is HTML. */
  format?: 'md' | 'mdx';
}

export interface SillyQuestion {
  slug: string;
  question: string;
  answer: string;
  date: string;
  tags: string[];
  category: string;
}

export interface TILEntry {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  content: string; // rendered HTML
  rawContent: string; // plain markdown for excerpt
}

export interface NewsPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  query: string;
  tags: string[];
  source: string;
  image?: string;
  content: string; // rendered HTML
  rawContent?: string; // plain markdown source
}

export interface BlogMetadata {
  title: string;
  description: string;
  date: string;
  updated?: string;
  author: string;
  tags: string[];
  category: string;
  featured?: boolean;
  image?: string;
  socialImage?: string;
  /** Optional technical-article details. All are shown only when present. */
  /** Main programming language, e.g. "Go". */
  language?: string;
  /** Framework or library the article is about, e.g. "Next.js". */
  framework?: string;
  /** Version the examples were written against, e.g. "Go 1.23". */
  softwareVersion?: string;
  /** Where the examples were actually run, e.g. "macOS 15, Postgres 16". Only fill in what was really tested. */
  testedEnvironment?: string;
  /** http(s) URL of a repository with the article's code. */
  repo?: string;
  /** Official docs and other sources the article relies on. */
  references?: ArticleReference[];
}

export interface SillyQuestionMetadata {
  question: string;
  date: string;
  tags: string[];
  category: string;
}
