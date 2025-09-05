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
        url: 'https://blog.ratnesh-maurya.com/images/logo.png'
      }
    },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://blog.ratnesh-maurya.com/blog/${post.slug}`,
    },
    keywords: post.tags.join(', '),
    articleSection: post.category,
    wordCount: post.content.replace(/<[^>]*>/g, '').split(' ').length,
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
    }))
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
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: question.question,
      text: question.question,
      answerCount: 1,
      dateCreated: question.date,
      author: {
        '@type': 'Person',
        name: 'Ratnesh Maurya',
        url: 'https://ratnesh-maurya.com'
      },
      acceptedAnswer: {
        '@type': 'Answer',
        text: question.answer.replace(/<[^>]*>/g, ''),
        dateCreated: question.date,
        author: {
          '@type': 'Person',
          name: 'Ratnesh Maurya',
          url: 'https://ratnesh-maurya.com'
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
    author: {
      '@type': 'Person',
      name: 'Ratnesh Maurya',
      url: 'https://ratnesh-maurya.com',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://blog.ratnesh-maurya.com/search?q={search_term_string}',
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
