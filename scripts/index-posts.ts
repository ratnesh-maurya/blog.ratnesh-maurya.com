// Load environment variables from .env.local
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // dotenv not available, rely on environment variables
  console.log('ℹ️  dotenv not found, using environment variables');
}

import { getAllBlogPosts, getAllSillyQuestions } from '../src/lib/content';
import { requestIndexingBatch } from '../src/lib/googleIndexing';

const baseUrl = 'https://blog.ratnesh-maurya.com';

async function indexAllPosts() {
  console.log('🚀 Starting Google Indexing API requests...\n');

  // Check if credentials are configured
  if (!process.env.GOOGLE_INDEXING_CLIENT_EMAIL || !process.env.GOOGLE_INDEXING_PRIVATE_KEY) {
    console.warn('⚠️  Google Indexing API credentials not found in environment variables.');
    console.warn('   Skipping indexing requests. Add credentials to .env.local to enable indexing.\n');
    process.exit(0);
  }

  try {
    // Get all blog posts and silly questions
    const [blogPosts, sillyQuestions] = await Promise.all([
      getAllBlogPosts(),
      getAllSillyQuestions()
    ]);

    // Build list of URLs to index
    const urls: string[] = [
      baseUrl,
      `${baseUrl}/blog`,
      `${baseUrl}/silly-questions`,
      `${baseUrl}/about`,
    ];

    // Add blog post URLs
    blogPosts.forEach(post => {
      urls.push(`${baseUrl}/blog/${post.slug}`);
    });

    // Add silly question URLs
    sillyQuestions.forEach(question => {
      urls.push(`${baseUrl}/silly-questions/${question.slug}`);
    });

    // Add tag pages
    const tagSet = new Set<string>();
    blogPosts.forEach(post => {
      if (post.tags && post.tags.length > 0) {
        post.tags.forEach(tag => {
          tagSet.add(tag);
        });
      }
    });

    tagSet.forEach(tag => {
      const slug = encodeURIComponent(tag.trim().toLowerCase().replace(/\s+/g, '-'));
      urls.push(`${baseUrl}/blog/tag/${slug}`);
    });

    console.log(`📝 Found ${urls.length} URLs to index:`);
    console.log(`   - ${blogPosts.length} blog posts`);
    console.log(`   - ${sillyQuestions.length} silly questions`);
    console.log(`   - ${tagSet.size} tag pages`);
    console.log(`   - 4 main pages\n`);

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
