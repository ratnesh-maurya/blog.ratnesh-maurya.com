import { BlogPost, SillyQuestion, TILEntry } from '@/types/blog';
import { getSocialImageUrl } from './BlogImage';

const BLOG_BASE = 'https://blog.ratnesh-maurya.com';

function absoluteOgImageUrl(path: string): string {
  return path.startsWith('http') ? path : `${BLOG_BASE}${path.startsWith('/') ? path : `/${path}`}`;
}

interface BlogStructuredDataProps {
  post: BlogPost;
}

export function BlogStructuredData({ post }: BlogStructuredDataProps) {
  const socialImageUrl = getSocialImageUrl({ post, type: 'og' });
  const fullImageUrl = absoluteOgImageUrl(socialImageUrl);

  // Convert date to ISO 8601 format with timezone
  const datePublished = new Date(post.date).toISOString();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: [fullImageUrl],
    author: {
      '@type': 'Person',
      name: post.author,
      url: 'https://ratnesh-maurya.com',
      sameAs: [
        'https://github.com/ratnesh-maurya',
        'https://linkedin.com/in/ratnesh-maurya',
        'https://twitter.com/ratnesh_maurya'
      ]
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ratn Labs',
      url: 'https://blog.ratnesh-maurya.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://blog.ratnesh-maurya.com/images/logo.png',
        width: 512,
        height: 512
      }
    },
    datePublished: datePublished,
    dateModified: datePublished,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://blog.ratnesh-maurya.com/blog/${post.slug}`,
    },
    url: `https://blog.ratnesh-maurya.com/blog/${post.slug}`,
    keywords: post.tags.join(', '),
    articleSection: post.category,
    wordCount: post.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length,
    timeRequired: post.readingTime,
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    copyrightHolder: {
      '@type': 'Person',
      name: 'Ratnesh Maurya'
    },
    copyrightYear: new Date(post.date).getFullYear(),
    genre: ['Technology', 'Programming', 'Web Development'],
    about: post.tags.map(tag => ({
      '@type': 'Thing',
      name: tag
    })),
    commentCount: 0,
    interactionStatistic: {
      '@type': 'InteractionCounter',
      interactionType: 'https://schema.org/ReadAction',
      userInteractionCount: 0
    },
    // speakable — highlights key passage for AI assistants and voice search
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.speakable-intro'],
    },
    isPartOf: {
      '@type': 'Blog',
      '@id': 'https://blog.ratnesh-maurya.com/#blog',
      name: 'Ratn Labs',
      url: 'https://blog.ratnesh-maurya.com',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface SillyQuestionStructuredDataProps {
  question: SillyQuestion;
}

export function SillyQuestionStructuredData({ question }: SillyQuestionStructuredDataProps) {
  // Convert date to ISO 8601 format with timezone
  const dateWithTimezone = new Date(question.date).toISOString();
  const questionUrl = `https://blog.ratnesh-maurya.com/silly-questions/${question.slug}`;
  const answerText = question.answer.replace(/<[^>]*>/g, '');

  const ogImageUrl = `${BLOG_BASE}/silly-questions/${question.slug}/opengraph-image`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    image: {
      '@type': 'ImageObject',
      url: ogImageUrl,
      width: 1200,
      height: 630,
    },
    mainEntity: {
      '@type': 'Question',
      name: question.question,
      text: question.question,
      answerCount: 1,
      dateCreated: dateWithTimezone,
      dateModified: dateWithTimezone,
      upvoteCount: 0,
      url: questionUrl,
      keywords: question.tags.join(', '),
      author: {
        '@type': 'Person',
        name: 'Ratnesh Maurya',
        url: 'https://ratnesh-maurya.com',
        sameAs: [
          'https://github.com/ratnesh-maurya',
          'https://linkedin.com/in/ratnesh-maurya',
          'https://twitter.com/ratnesh_maurya'
        ]
      },
      acceptedAnswer: {
        '@type': 'Answer',
        text: answerText,
        dateCreated: dateWithTimezone,
        dateModified: dateWithTimezone,
        upvoteCount: 0,
        url: questionUrl,
        author: {
          '@type': 'Person',
          name: 'Ratnesh Maurya',
          url: 'https://ratnesh-maurya.com',
          sameAs: [
            'https://github.com/ratnesh-maurya',
            'https://linkedin.com/in/ratnesh-maurya',
            'https://twitter.com/ratnesh_maurya'
          ]
        }
      }
    },
    about: {
      '@type': 'Thing',
      name: question.category
    },
    keywords: question.tags.join(', '),
    inLanguage: 'en-US',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://blog.ratnesh-maurya.com'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Silly Questions',
          item: 'https://blog.ratnesh-maurya.com/silly-questions'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: question.question,
          item: questionUrl
        }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function WebsiteStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: "Ratn Labs",
    description: 'A blog about web development, programming, and the silly mistakes we all make along the way.',
    url: 'https://blog.ratnesh-maurya.com',
    inLanguage: 'en-US',
    author: {
      '@type': 'Person',
      name: 'Ratnesh Maurya',
      url: 'https://ratnesh-maurya.com',
      sameAs: [
        'https://github.com/ratnesh-maurya',
        'https://linkedin.com/in/ratnesh-maurya',
        'https://twitter.com/ratnesh_maurya'
      ]
    },
    potentialAction: [{
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://blog.ratnesh-maurya.com/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string',
    }, {
      '@type': 'ReadAction',
      target: ['https://blog.ratnesh-maurya.com/blog'],
    }],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function OrganizationStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Ratnesh Maurya',
    url: 'https://ratnesh-maurya.com',
    image: 'https://avatars.githubusercontent.com/u/85143283?v=4',
    jobTitle: 'Backend Engineer',
    description: 'Backend engineer passionate about system design, web development, and sharing knowledge through blogging.',
    sameAs: [
      'https://github.com/ratnesh-maurya',
      'https://linkedin.com/in/ratnesh-maurya',
      'https://twitter.com/ratnesh_maurya',
      'https://blog.ratnesh-maurya.com'
    ],
    knowsAbout: [
      'Backend Development',
      'System Design',
      'Web Development',
      'JavaScript',
      'TypeScript',
      'Node.js',
      'React',
      'Next.js',
      'Database Design',
      'API Development'
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Ratn Labs',
      url: 'https://blog.ratnesh-maurya.com',
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface BreadcrumbStructuredDataProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface FAQStructuredDataProps {
  questions: Array<{
    question: string;
    answer: string;
    slug: string;
  }>;
}

export function FAQStructuredData({ questions }: FAQStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer.replace(/<[^>]*>/g, '').substring(0, 500) + '...'
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface BlogListStructuredDataProps {
  posts: Array<{
    title: string;
    description: string;
    slug: string;
    date: string;
    author: string;
    category?: string;
    tags?: string[];
  }>;
}

export function BlogListStructuredData({ posts }: BlogListStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'All Blog Posts — Ratn Labs',
    description: 'Explore articles on web development, backend engineering, system design, and more.',
    url: 'https://blog.ratnesh-maurya.com/blog',
    inLanguage: 'en-US',
    author: {
      '@type': 'Person',
      name: 'Ratnesh Maurya',
      url: 'https://ratnesh-maurya.com',
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://blog.ratnesh-maurya.com/blog/${post.slug}`,
        name: post.title,
        description: post.description,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function ProfilePageStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    dateCreated: '2023-01-01T00:00:00Z',
    dateModified: new Date().toISOString(),
    mainEntity: {
      '@type': 'Person',
      '@id': 'https://ratnesh-maurya.com/#person',
      name: 'Ratnesh Maurya',
      alternateName: 'Ratn',
      description: 'Backend engineer specialising in system design, distributed systems, and web development. Building scalable backend systems and sharing insights through writing.',
      image: {
        '@type': 'ImageObject',
        url: 'https://avatars.githubusercontent.com/u/85143283?v=4',
        width: 400,
        height: 400,
      },
      url: 'https://ratnesh-maurya.com',
      sameAs: [
        'https://github.com/ratnesh-maurya',
        'https://linkedin.com/in/ratnesh-maurya',
        'https://twitter.com/ratnesh_maurya',
        'https://blog.ratnesh-maurya.com',
      ],
      jobTitle: 'Backend Engineer',
      knowsAbout: [
        'Backend Development',
        'System Design',
        'Distributed Systems',
        'Web Development',
        'JavaScript',
        'TypeScript',
        'Go',
        'Node.js',
        'React',
        'Next.js',
        'AWS',
        'Database Design',
        'API Development',
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// ─── Glossary: DefinedTermSet + DefinedTerm ───────────────────────────────────
interface GlossaryTerm { term: string; def: string; }
interface GlossaryCategory { category: string; items: GlossaryTerm[]; }
interface GlossaryStructuredDataProps { terms: GlossaryCategory[]; }

export function GlossaryStructuredData({ terms }: GlossaryStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': 'https://blog.ratnesh-maurya.com/glossary#termset',
    name: 'Backend Engineering Glossary',
    description: 'Definitions for common backend, system design, Go, and distributed systems terms.',
    url: 'https://blog.ratnesh-maurya.com/glossary',
    publisher: {
      '@type': 'Person',
      name: 'Ratnesh Maurya',
      url: 'https://ratnesh-maurya.com',
    },
    hasDefinedTerm: terms.flatMap(cat =>
      cat.items.map(item => ({
        '@type': 'DefinedTerm',
        name: item.term,
        description: item.def,
        inDefinedTermSet: 'https://blog.ratnesh-maurya.com/glossary#termset',
        url: `https://blog.ratnesh-maurya.com/glossary#${item.term.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      }))
    ),
  };
  return (
    <script type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
  );
}

// ─── Technical Term: DefinedTerm (individual page) ───────────────────────────
interface TechnicalTermStructuredDataProps {
  title: string;
  description: string;
  slug: string;
  ogImageUrl?: string;
}

export function TechnicalTermStructuredData({ title, description, slug, ogImageUrl }: TechnicalTermStructuredDataProps) {
  const url = `https://blog.ratnesh-maurya.com/technical-terms/${slug}`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: title,
    description,
    url,
    inDefinedTermSet: 'https://blog.ratnesh-maurya.com/technical-terms#termset',
    ...(ogImageUrl && {
      image: {
        '@type': 'ImageObject',
        url: ogImageUrl,
        width: 1200,
        height: 630,
      },
    }),
    author: {
      '@type': 'Person',
      name: 'Ratnesh Maurya',
      url: 'https://ratnesh-maurya.com',
      sameAs: [
        'https://github.com/ratnesh-maurya',
        'https://linkedin.com/in/ratnesh-maurya',
        'https://twitter.com/ratnesh_maurya',
      ],
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ratn Labs',
      url: 'https://blog.ratnesh-maurya.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    isPartOf: {
      '@type': 'DefinedTermSet',
      '@id': 'https://blog.ratnesh-maurya.com/technical-terms#termset',
      name: 'Technical Terms — Backend & System Design',
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// ─── Technical Term: FAQPage (per-term) ───────────────────────────────────────
interface TechnicalTermFAQItem { question: string; answer: string; }
interface TechnicalTermFAQStructuredDataProps {
  termTitle: string;
  termUrl: string;
  faq: TechnicalTermFAQItem[];
}

export function TechnicalTermFAQStructuredData({
  termTitle,
  termUrl,
  faq,
}: TechnicalTermFAQStructuredDataProps) {
  if (!faq || faq.length === 0) return null;
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question' as const,
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: item.answer,
      },
    })),
    name: `${termTitle} — Frequently Asked Questions`,
    url: termUrl,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// ─── Technical Terms: DefinedTermSet ──────────────────────────────────────────
interface TechnicalTermCard { slug: string; title: string; description: string; }
interface TechnicalTermsStructuredDataProps { terms: TechnicalTermCard[]; }

export function TechnicalTermsStructuredData({ terms }: TechnicalTermsStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': 'https://blog.ratnesh-maurya.com/technical-terms#termset',
    name: 'Technical Terms — Backend & System Design',
    description: 'Definitions for indexing, clustering, CAP, ACID, replication, and other backend and system design terms.',
    url: 'https://blog.ratnesh-maurya.com/technical-terms',
    publisher: {
      '@type': 'Person',
      name: 'Ratnesh Maurya',
      url: 'https://ratnesh-maurya.com',
    },
    hasDefinedTerm: terms.map((t) => ({
      '@type': 'DefinedTerm' as const,
      name: t.title,
      description: t.description,
      inDefinedTermSet: 'https://blog.ratnesh-maurya.com/technical-terms#termset',
      url: `https://blog.ratnesh-maurya.com/technical-terms/${t.slug}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// ─── Cheatsheet: TechArticle ──────────────────────────────────────────────────
interface CheatsheetStructuredDataProps {
  title: string;
  description: string;
  slug: string;
  keywords: string[];
}

export function CheatsheetStructuredData({ title, description, slug, keywords }: CheatsheetStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description,
    url: `https://blog.ratnesh-maurya.com/cheatsheets/${slug}`,
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    keywords: keywords.join(', '),
    author: {
      '@type': 'Person',
      name: 'Ratnesh Maurya',
      url: 'https://ratnesh-maurya.com',
      sameAs: ['https://github.com/ratnesh-maurya', 'https://linkedin.com/in/ratnesh-maurya'],
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ratn Labs',
      url: 'https://blog.ratnesh-maurya.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://blog.ratnesh-maurya.com/cheatsheets/${slug}`,
    },
    image: {
      '@type': 'ImageObject',
      url: `${BLOG_BASE}/cheatsheets/${slug}/opengraph-image`,
      width: 1200,
      height: 630,
    },
    isPartOf: {
      '@type': 'WebSite',
      '@id': 'https://blog.ratnesh-maurya.com/#website',
    },
  };
  return (
    <script type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
  );
}

// ─── TIL: TechArticle ────────────────────────────────────────────────────────
interface TILStructuredDataProps { entry: TILEntry; }

export function TILStructuredData({ entry }: TILStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: entry.title,
    description: `Today I Learned: ${entry.title}. A short engineering note about ${entry.category}.`,
    datePublished: new Date(entry.date).toISOString(),
    dateModified: new Date(entry.date).toISOString(),
    url: `https://blog.ratnesh-maurya.com/til/${entry.slug}`,
    keywords: entry.tags.join(', '),
    articleSection: entry.category,
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    author: {
      '@type': 'Person',
      name: 'Ratnesh Maurya',
      url: 'https://ratnesh-maurya.com',
      sameAs: ['https://github.com/ratnesh-maurya', 'https://linkedin.com/in/ratnesh-maurya'],
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ratn Labs',
      url: 'https://blog.ratnesh-maurya.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://blog.ratnesh-maurya.com/til/${entry.slug}`,
    },
    image: {
      '@type': 'ImageObject',
      url: `${BLOG_BASE}/til/${entry.slug}/opengraph-image`,
      width: 1200,
      height: 630,
    },
    isPartOf: {
      '@type': 'Blog',
      '@id': 'https://blog.ratnesh-maurya.com/#blog',
      name: 'Ratn Labs',
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1'],
    },
  };
  return (
    <script type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
  );
}

// ─── TIL Listing: ItemList ────────────────────────────────────────────────────
interface TILListStructuredDataProps { entries: TILEntry[]; }

export function TILListStructuredData({ entries }: TILListStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Today I Learned — Ratn Labs',
    description: 'Short practical learnings from real engineering work — Go, PostgreSQL, Kubernetes, AWS, Docker.',
    url: 'https://blog.ratnesh-maurya.com/til',
    numberOfItems: entries.length,
    itemListElement: entries.map((entry, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: entry.title,
      url: `https://blog.ratnesh-maurya.com/til/${entry.slug}`,
      description: `TIL about ${entry.category}: ${entry.title}`,
    })),
  };
  return (
    <script type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
  );
}

// ─── Cheatsheets Listing: CollectionPage + ItemList ───────────────────────────
interface CheatsheetListItem { slug: string; title: string; subtitle: string; }
interface CheatsheetsListStructuredDataProps { sheets: CheatsheetListItem[]; }

export function CheatsheetsListStructuredData({ sheets }: CheatsheetsListStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Cheatsheets — Go, Docker, PostgreSQL, Kubectl | Ratn Labs',
    description: 'Quick reference cheatsheets for Go, Docker, PostgreSQL, and Kubernetes kubectl. Commands, syntax, and patterns you need while building.',
    url: `${BLOG_BASE}/cheatsheets`,
    inLanguage: 'en-US',
    author: {
      '@type': 'Person',
      name: 'Ratnesh Maurya',
      url: 'https://ratnesh-maurya.com',
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: sheets.length,
      itemListElement: sheets.map((sheet, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `${BLOG_BASE}/cheatsheets/${sheet.slug}`,
        name: sheet.title,
        description: sheet.subtitle,
      })),
    },
  };
  return (
    <script type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
  );
}

// ─── Series Listing: CollectionPage + ItemList ────────────────────────────────
interface SeriesListItem { id: string; title: string; desc: string; postCount: number; }
interface SeriesListStructuredDataProps { series: SeriesListItem[]; }

export function SeriesListStructuredData({ series }: SeriesListStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Series — Learning Paths | Ratn Labs',
    description: 'Grouped reading paths for backend engineering topics — system design, AWS, Go, and more.',
    url: `${BLOG_BASE}/series`,
    inLanguage: 'en-US',
    author: {
      '@type': 'Person',
      name: 'Ratnesh Maurya',
      url: 'https://ratnesh-maurya.com',
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: series.length,
      itemListElement: series.map((s, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `${BLOG_BASE}/series`,
        name: s.title,
        description: `${s.desc} (${s.postCount} posts)`,
      })),
    },
  };
  return (
    <script type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
  );
}

// ─── Resources Listing: CollectionPage + ItemList ─────────────────────────────
interface ResourceSection { category: string; items: { title: string; author: string; href: string; }[]; }
interface ResourcesListStructuredDataProps { sections: ResourceSection[]; }

export function ResourcesListStructuredData({ sections }: ResourcesListStructuredDataProps) {
  const allItems = sections.flatMap(s => s.items);
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Resources — Books, Talks & Tools | Ratn Labs',
    description: 'Curated books, talks, tools, and newsletters for backend engineers — system design, Go, distributed systems, and cloud-native development.',
    url: `${BLOG_BASE}/resources`,
    inLanguage: 'en-US',
    author: {
      '@type': 'Person',
      name: 'Ratnesh Maurya',
      url: 'https://ratnesh-maurya.com',
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: allItems.length,
      itemListElement: allItems.map((item, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: item.href,
        name: item.title,
        description: `By ${item.author}`,
      })),
    },
  };
  return (
    <script type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
  );
}
