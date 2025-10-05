import { BlogPost, SillyQuestion } from '@/types/blog';
import { getSocialImageUrl } from './BlogImage';

interface BlogStructuredDataProps {
  post: BlogPost;
}

export function BlogStructuredData({ post }: BlogStructuredDataProps) {
  const socialImageUrl = getSocialImageUrl({ post, type: 'og' });
  const fullImageUrl = socialImageUrl.startsWith('/')
    ? `https://blog.ratnesh-maurya.com${socialImageUrl}`
    : socialImageUrl;

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
      name: 'Ratnesh Maurya\'s Blog',
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
    }
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

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: question.question,
      text: question.question,
      answerCount: 1,
      dateCreated: dateWithTimezone,
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
      },
      acceptedAnswer: {
        '@type': 'Answer',
        text: question.answer.replace(/<[^>]*>/g, ''),
        dateCreated: dateWithTimezone,
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
          item: `https://blog.ratnesh-maurya.com/silly-questions/${question.slug}`
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
    name: "Blog's By Ratnesh",
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
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://blog.ratnesh-maurya.com/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string',
    },
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
    alumniOf: {
      '@type': 'Organization',
      name: 'Your University' // Update this with actual info
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
  }>;
}

export function BlogListStructuredData({ posts }: BlogListStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: posts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://blog.ratnesh-maurya.com/blog/${post.slug}`,
      name: post.title,
      description: post.description
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
