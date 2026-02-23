// Load environment variables from .env.local if available
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config({ path: '.env.local' });
} catch {
  // dotenv not available, rely on environment variables
  console.log('ℹ️  dotenv not found, using environment variables');
}

import { getAllBlogPosts, getAllSillyQuestions, getAllTILEntries, getTechnicalTermSlugs } from '../src/lib/content';

const BASE_HOST = process.env.INDEXNOW_HOST || 'blog.ratnesh-maurya.com';
const BASE_URL = `https://${BASE_HOST}`;

// Static key used for IndexNow + matching key file in public/
// See https://www.indexnow.org/documentation
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'a1b2c3d4e5f60718293a4b5c6d7e8f90';
const INDEXNOW_ENDPOINT = process.env.INDEXNOW_ENDPOINT || 'https://api.indexnow.org/indexnow';

async function notifyIndexNow(urls: string[]) {
  if (urls.length === 0) {
    console.log('ℹ️  No URLs to submit to IndexNow.');
    return;
  }

  const payload = {
    host: BASE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  console.log(`📡 Submitting ${urls.length} URLs to IndexNow...`);

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();

    if (res.ok) {
      console.log(`✅ IndexNow accepted URLs (status ${res.status}).`);
    } else {
      console.warn(`⚠️  IndexNow responded with status ${res.status}. Body: ${text}`);
    }
  } catch (error) {
    console.error('❌ Error while calling IndexNow:', error);
  }
}

async function collectAllUrls(): Promise<string[]> {
  const [blogPosts, sillyQuestions, tilEntries] = await Promise.all([
    getAllBlogPosts(),
    getAllSillyQuestions(),
    getAllTILEntries(),
  ]);

  const urls: string[] = [
    BASE_URL,
    `${BASE_URL}/blog`,
    `${BASE_URL}/silly-questions`,
    `${BASE_URL}/til`,
    `${BASE_URL}/about`,
    `${BASE_URL}/topics`,
    `${BASE_URL}/search`,
    `${BASE_URL}/uses`,
    `${BASE_URL}/newsletter`,
    `${BASE_URL}/privacy-policy`,
    `${BASE_URL}/series`,
    `${BASE_URL}/glossary`,
    `${BASE_URL}/technical-terms`,
    `${BASE_URL}/resources`,
    `${BASE_URL}/now`,
    `${BASE_URL}/cheatsheets`,
    `${BASE_URL}/cheatsheets/go`,
    `${BASE_URL}/cheatsheets/docker`,
    `${BASE_URL}/cheatsheets/postgres`,
    `${BASE_URL}/cheatsheets/kubectl`,
  ];

  blogPosts.forEach(post => {
    urls.push(`${BASE_URL}/blog/${post.slug}`);
  });

  sillyQuestions.forEach(question => {
    urls.push(`${BASE_URL}/silly-questions/${question.slug}`);
  });

  tilEntries.forEach(entry => {
    urls.push(`${BASE_URL}/til/${entry.slug}`);
  });

  const technicalTermSlugs = getTechnicalTermSlugs();
  technicalTermSlugs.forEach(slug => {
    urls.push(`${BASE_URL}/technical-terms/${slug}`);
  });

  const tagSet = new Set<string>();
  blogPosts.forEach(post => {
    if (post.tags && post.tags.length > 0) {
      post.tags.forEach(tag => tagSet.add(tag));
    }
  });

  tagSet.forEach(tag => {
    const slug = encodeURIComponent(tag.trim().toLowerCase().replace(/\s+/g, '-'));
    urls.push(`${BASE_URL}/blog/tag/${slug}`);
  });

  console.log('📝 URLs prepared for IndexNow:');
  console.log(`   - ${blogPosts.length} blog posts`);
  console.log(`   - ${sillyQuestions.length} silly questions`);
  console.log(`   - ${tilEntries.length} TIL entries`);
  console.log(`   - ${technicalTermSlugs.length} technical terms`);
  console.log(`   - ${tagSet.size} tag pages`);
  console.log(`   - ${urls.length} total URLs\n`);

  return urls;
}

async function run() {
  try {
    const urls = await collectAllUrls();
    await notifyIndexNow(urls);
  } catch (error) {
    console.error('❌ Fatal error during IndexNow notification:', error);
    process.exit(1);
  }
}

run();

