// Load environment variables from .env.local
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // dotenv not available, rely on environment variables
  console.log('ℹ️  dotenv not found, using environment variables');
}

import { execSync } from 'node:child_process';
import path from 'node:path';
import { getAllBlogPosts, getAllSillyQuestions, getAllTILEntries, getTechnicalTermSlugs } from '../src/lib/content';
import { requestIndexingBatch } from '../src/lib/googleIndexing';

const baseUrl = 'https://blog.ratnesh-maurya.com';

const INDEXABLE_CONTENT_PREFIXES = [
  'content/',
  'src/app/',
  'src/components/',
  'src/lib/content.ts',
];

function toPosixPath(filePath: string): string {
  return filePath.split(path.sep).join('/');
}

function uniqueUrls(urls: string[]): string[] {
  return [...new Set(urls)];
}

function getChangedFilesFromEnv(): string[] {
  const raw = process.env.CHANGED_FILES;
  if (!raw) return [];

  return raw
    .split(/[\n,]+/)
    .map(s => s.trim())
    .filter(Boolean)
    .map(toPosixPath);
}

function safeGitDiff(baseRef: string, headRef = 'HEAD'): string[] {
  try {
    const output = execSync(`git diff --name-only ${baseRef} ${headRef}`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return output
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(toPosixPath);
  } catch {
    return [];
  }
}

function resolveChangedFiles(): string[] {
  const fromEnv = getChangedFilesFromEnv();
  if (fromEnv.length > 0) {
    return fromEnv;
  }

  const vercelPreviousSha = process.env.VERCEL_GIT_PREVIOUS_SHA;
  if (vercelPreviousSha && !/^0+$/.test(vercelPreviousSha)) {
    const diff = safeGitDiff(vercelPreviousSha, 'HEAD');
    if (diff.length > 0) return diff;
  }

  const githubBeforeSha = process.env.GITHUB_BEFORE;
  if (githubBeforeSha && !/^0+$/.test(githubBeforeSha)) {
    const diff = safeGitDiff(githubBeforeSha, 'HEAD');
    if (diff.length > 0) return diff;
  }

  return safeGitDiff('HEAD~1', 'HEAD');
}

function hasRelevantChanges(files: string[]): boolean {
  return files.some(file => INDEXABLE_CONTENT_PREFIXES.some(prefix => file.startsWith(prefix)));
}

function mapStaticContentPathToUrl(filePath: string): string | null {
  if (filePath === 'content/now.md') return `${baseUrl}/now`;
  if (filePath === 'content/privacy-policy.md') return `${baseUrl}/privacy-policy`;
  if (filePath === 'content/uses.json') return `${baseUrl}/uses`;
  if (filePath === 'content/topics.json') return `${baseUrl}/topics`;
  if (filePath === 'content/series.json') return `${baseUrl}/series`;
  if (filePath === 'content/glossary.json') return `${baseUrl}/glossary`;
  return null;
}

function collectChangedUrls(changedFiles: string[], allBlogPosts: Awaited<ReturnType<typeof getAllBlogPosts>>): string[] {
  const urls = new Set<string>();
  const changedBlogSlugs = new Set<string>();
  const changedBlogTagPages = new Set<string>();

  changedFiles.forEach(file => {
    if (file.startsWith('content/blog/')) {
      const match = file.match(/^content\/blog\/(.+?)\.(md|mdx)$/);
      if (match?.[1]) {
        changedBlogSlugs.add(match[1]);
      }
      urls.add(`${baseUrl}/blog`);
    }

    if (file.startsWith('content/silly-questions/')) {
      const match = file.match(/^content\/silly-questions\/(.+?)\.md$/);
      if (match?.[1]) {
        urls.add(`${baseUrl}/silly-questions/${match[1]}`);
      }
      urls.add(`${baseUrl}/silly-questions`);
    }

    if (file.startsWith('content/til/')) {
      const match = file.match(/^content\/til\/(.+?)\.md$/);
      if (match?.[1]) {
        urls.add(`${baseUrl}/til/${match[1]}`);
      }
      urls.add(`${baseUrl}/til`);
    }

    if (file.startsWith('content/technical-terms/')) {
      const match = file.match(/^content\/technical-terms\/(.+?)\.md$/);
      if (match?.[1]) {
        urls.add(`${baseUrl}/technical-terms/${match[1]}`);
      }
      urls.add(`${baseUrl}/technical-terms`);
      urls.add(`${baseUrl}/glossary`);
    }

    if (file.startsWith('content/cheatsheets/')) {
      const match = file.match(/^content\/cheatsheets\/(.+?)\.json$/);
      if (match?.[1]) {
        urls.add(`${baseUrl}/cheatsheets/${match[1]}`);
      }
      urls.add(`${baseUrl}/cheatsheets`);
    }

    const staticUrl = mapStaticContentPathToUrl(file);
    if (staticUrl) {
      urls.add(staticUrl);
    }
  });

  if (changedFiles.some(file => file.startsWith('src/app/blog/') || file.startsWith('src/components/TableOfContents'))) {
    urls.add(`${baseUrl}/blog`);
    allBlogPosts.forEach(post => urls.add(`${baseUrl}/blog/${post.slug}`));
  }

  if (changedFiles.some(file => file.startsWith('src/app/silly-questions/'))) {
    urls.add(`${baseUrl}/silly-questions`);
  }

  if (changedFiles.some(file => file.startsWith('src/app/til/'))) {
    urls.add(`${baseUrl}/til`);
  }

  if (changedFiles.some(file => file.startsWith('src/app/technical-terms/'))) {
    urls.add(`${baseUrl}/technical-terms`);
  }

  changedBlogSlugs.forEach(slug => {
    urls.add(`${baseUrl}/blog/${slug}`);
    const post = allBlogPosts.find(p => p.slug === slug);
    if (post?.tags?.length) {
      post.tags.forEach(tag => {
        const tagSlug = encodeURIComponent(tag.trim().toLowerCase().replace(/\s+/g, '-'));
        changedBlogTagPages.add(tagSlug);
      });
    }
  });

  if (changedBlogTagPages.size > 0) {
    changedBlogTagPages.forEach(tagSlug => {
      urls.add(`${baseUrl}/blog/tag/${tagSlug}`);
    });
  }

  return uniqueUrls([...urls]);
}

function collectAllUrls(
  blogPosts: Awaited<ReturnType<typeof getAllBlogPosts>>,
  sillyQuestions: Awaited<ReturnType<typeof getAllSillyQuestions>>,
  tilEntries: Awaited<ReturnType<typeof getAllTILEntries>>,
): string[] {
  // Static pages
  const staticPages = [
    baseUrl,
    `${baseUrl}/blog`,
    `${baseUrl}/silly-questions`,
    `${baseUrl}/til`,
    `${baseUrl}/about`,
    `${baseUrl}/topics`,
    `${baseUrl}/search`,
    `${baseUrl}/uses`,
    `${baseUrl}/newsletter`,
    `${baseUrl}/privacy-policy`,
    `${baseUrl}/series`,
    `${baseUrl}/glossary`,
    `${baseUrl}/technical-terms`,
    `${baseUrl}/resources`,
    `${baseUrl}/now`,
    `${baseUrl}/cheatsheets`,
    `${baseUrl}/cheatsheets/go`,
    `${baseUrl}/cheatsheets/docker`,
    `${baseUrl}/cheatsheets/postgres`,
    `${baseUrl}/cheatsheets/kubectl`,
  ];

  const urls: string[] = [...staticPages];

  // Blog post URLs
  blogPosts.forEach(post => {
    urls.push(`${baseUrl}/blog/${post.slug}`);
  });

  // Silly question URLs
  sillyQuestions.forEach(question => {
    urls.push(`${baseUrl}/silly-questions/${question.slug}`);
  });

  // TIL entry URLs
  tilEntries.forEach(entry => {
    urls.push(`${baseUrl}/til/${entry.slug}`);
  });

  // Technical term URLs
  const technicalTermSlugs = getTechnicalTermSlugs();
  technicalTermSlugs.forEach(slug => {
    urls.push(`${baseUrl}/technical-terms/${slug}`);
  });

  // Tag pages (derived from blog posts)
  const tagSet = new Set<string>();
  blogPosts.forEach(post => {
    if (post.tags && post.tags.length > 0) {
      post.tags.forEach(tag => tagSet.add(tag));
    }
  });

  tagSet.forEach(tag => {
    const slug = encodeURIComponent(tag.trim().toLowerCase().replace(/\s+/g, '-'));
    urls.push(`${baseUrl}/blog/tag/${slug}`);
  });

  return uniqueUrls(urls);
}

async function indexAllPosts() {
  console.log('🚀 Starting Google Indexing API requests...\n');

  // Check if credentials are configured
  if (!process.env.GOOGLE_INDEXING_CLIENT_EMAIL || !process.env.GOOGLE_INDEXING_PRIVATE_KEY) {
    console.warn('⚠️  Google Indexing API credentials not found in environment variables.');
    console.warn('   Skipping indexing requests. Add credentials to .env.local to enable indexing.\n');
    process.exit(0);
  }

  try {
    const shouldIndexAll = process.argv.includes('--all') || process.env.INDEX_ALL === 'true';

    // Get all dynamic content
    const [blogPosts, sillyQuestions, tilEntries] = await Promise.all([
      getAllBlogPosts(),
      getAllSillyQuestions(),
      getAllTILEntries(),
    ]);

    const changedFiles = resolveChangedFiles();
    const relevantChanges = hasRelevantChanges(changedFiles);

    const urls = shouldIndexAll
      ? collectAllUrls(blogPosts, sillyQuestions, tilEntries)
      : collectChangedUrls(changedFiles, blogPosts);

    if (!shouldIndexAll) {
      if (changedFiles.length === 0) {
        console.log('ℹ️  No changed files detected from git/env. Skipping indexing.');
        process.exit(0);
      }

      if (!relevantChanges || urls.length === 0) {
        console.log(`ℹ️  ${changedFiles.length} files changed, but none affect indexable pages. Skipping indexing.`);
        process.exit(0);
      }
    }

    console.log(`📝 Found ${urls.length} URLs to index (${shouldIndexAll ? 'full mode' : 'changed-only mode'}):`);
    if (!shouldIndexAll) {
      console.log(`   - ${changedFiles.length} changed files detected`);
      console.log('   - Changed files sample:');
      changedFiles.slice(0, 10).forEach(file => console.log(`     • ${file}`));
      if (changedFiles.length > 10) {
        console.log(`     • ... and ${changedFiles.length - 10} more`);
      }
    }
    console.log('');

    // Index URLs in batches to respect rate limits (200 per day)
    const batchSize = 50; // Process in smaller batches to avoid overwhelming the API
    const batches: string[][] = [];

    for (let i = 0; i < urls.length; i += batchSize) {
      batches.push(urls.slice(i, i + batchSize));
    }

    let totalSuccess = 0;
    let totalFailed = 0;
    const allErrors: string[] = [];

    for (let i = 0; i < batches.length; i++) {
      console.log(`📦 Processing batch ${i + 1}/${batches.length} (${batches[i].length} URLs)...`);

      const result = await requestIndexingBatch(batches[i]);
      totalSuccess += result.success;
      totalFailed += result.failed;
      allErrors.push(...result.errors);

      // Add a small delay between batches to be respectful of API limits
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      }
    }

    console.log('\n✅ Indexing complete!');
    console.log(`   ✓ Successfully indexed: ${totalSuccess} URLs`);
    if (totalFailed > 0) {
      console.log(`   ✗ Failed: ${totalFailed} URLs`);
      if (allErrors.length > 0) {
        console.log('\n   Errors:');
        allErrors.slice(0, 10).forEach(error => console.log(`   - ${error}`));
        if (allErrors.length > 10) {
          console.log(`   ... and ${allErrors.length - 10} more errors`);
        }
      }
    }
  } catch (error) {
    console.error('❌ Fatal error during indexing:', error);
    process.exit(1);
  }
}

indexAllPosts();
