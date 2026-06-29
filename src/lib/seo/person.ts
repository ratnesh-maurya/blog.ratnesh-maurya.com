/**
 * Single source of truth for the Ratnesh Maurya Person entity and the Ratn Labs
 * Organization. Every JSON-LD block in the site references these via stable @id
 * so Google de-duplicates and merges them into one knowledge-graph node.
 *
 * Disambiguation lever: there are multiple "Ratnesh Maurya" profiles online
 * (Idea Cellular, Caravan Indie, etc.). A dense, consistent sameAs graph is the
 * primary signal Google uses to pick the right one for the brand SERP.
 */

export const PERSON_ID = 'https://ratnesh-maurya.com/#person';
export const ORG_ID = 'https://blog.ratnesh-maurya.com/#organization';
export const WEBSITE_ID = 'https://blog.ratnesh-maurya.com/#website';
export const BLOG_ID = 'https://blog.ratnesh-maurya.com/#blog';

export const PORTFOLIO_URL = 'https://ratnesh-maurya.com';
export const BLOG_URL = 'https://blog.ratnesh-maurya.com';

export const PERSON_SAME_AS: readonly string[] = [
  'https://github.com/ratnesh-maurya',
  'https://www.linkedin.com/in/ratnesh-maurya/',
  'https://twitter.com/_ratneshmaurya',
  'https://x.com/_ratneshmaurya',
  'https://peerlist.io/ratnesh_maurya',
  'https://www.instagram.com/ratn_labs/',
  'https://leetcode.com/ratnesh_maurya/',
  'https://codeforces.com/profile/ratnesh_',
  'https://www.wikidata.org/wiki/Q139621726',
  PORTFOLIO_URL,
];

export const ORG_SAME_AS: readonly string[] = [
  PORTFOLIO_URL,
  'https://github.com/ratnesh-maurya',
  'https://www.linkedin.com/in/ratnesh-maurya/',
  'https://twitter.com/_ratneshmaurya',
  'https://www.instagram.com/ratn_labs/',
];

export const PERSON_KNOWS_ABOUT: readonly string[] = [
  'Backend Engineering',
  'System Design',
  'Distributed Systems',
  'Go',
  'Golang',
  'Python',
  'Elixir',
  'TypeScript',
  'PostgreSQL',
  'Kubernetes',
  'AWS',
  'Microservices',
  'API Design',
  'RAG',
  'AI Engineering',
  'Cloud-Native',
];

export const PERSON_IMAGE = 'https://avatars.githubusercontent.com/u/85143283?v=4';

/** A reference to the Person entity. Use everywhere instead of redefining. */
export const personRef = () => ({ '@id': PERSON_ID });

/** A reference to the Organization entity. */
export const orgRef = () => ({ '@id': ORG_ID });

/** A full Person node — emit ONCE per page (in the site @graph or ProfilePage). */
export function personNode() {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Ratnesh Maurya',
    alternateName: ['Ratn', 'deadlock.go'],
    givenName: 'Ratnesh',
    familyName: 'Maurya',
    description:
      'Backend engineer specialising in distributed systems, microservices, and AI-powered infrastructure. Author of Ratn Labs.',
    url: PORTFOLIO_URL,
    image: {
      '@type': 'ImageObject',
      url: PERSON_IMAGE,
      width: 400,
      height: 400,
    },
    jobTitle: 'Software Development Engineer',
    worksFor: {
      '@type': 'Organization',
      name: 'Initializ',
      url: 'https://initializ.ai',
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Dr. Ambedkar Institute of Technology for Handicapped',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Gurugram',
      addressRegion: 'HR',
      addressCountry: 'IN',
    },
    knowsAbout: [...PERSON_KNOWS_ABOUT],
    knowsLanguage: ['en', 'hi'],
    sameAs: [...PERSON_SAME_AS],
  };
}

/** Author block for an article. Lightweight, references the canonical Person. */
export function articleAuthor(name = 'Ratnesh Maurya') {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name,
    url: PORTFOLIO_URL,
    sameAs: [...PERSON_SAME_AS],
  };
}

export function publisherOrg() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'Ratn Labs',
    url: `${BLOG_URL}/`,
    logo: {
      '@type': 'ImageObject',
      url: `${BLOG_URL}/apple-touch-icon.png`,
      width: 180,
      height: 180,
    },
  };
}
