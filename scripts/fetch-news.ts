import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables locally
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('Error: Missing GEMINI_API_KEY. Add it to .env');
  process.exit(1);
}

if (!TAVILY_API_KEY) {
  console.error('Error: Missing TAVILY_API_KEY. Add it to .env');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  generationConfig: {
    responseMimeType: 'application/json',
    maxOutputTokens: 16384,
    // @ts-ignore — thinkingConfig is valid for gemini-2.5-flash but not yet in SDK types
    thinkingConfig: { thinkingBudget: 0 },
    responseSchema: {
      type: SchemaType.OBJECT,
      properties: {
        title: {
          type: SchemaType.STRING,
          description: 'A catchy SEO optimized title for the blog post.',
        },
        description: {
          type: SchemaType.STRING,
          description: 'A brief SEO meta description.',
        },
        keywords: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
          description: 'List of relevant tags/keywords for the blog post.',
        },
        content: {
          type: SchemaType.STRING,
          description: 'The full markdown content of the blog post. Start with an engaging hook. Arrange news from latest to oldest. Add detailed commentary derived only from the context. Do not invent facts.',
        },
      },
      required: ['title', 'description', 'keywords', 'content'],
    },
  },
});

interface TavilyResult {
  title: string;
  url: string;
  content: string;
  raw_content?: string;
  published_date?: string;
  score?: number;
  images?: any[];
}

// ... helper methods etc
const DEFAULT_MAX_RESULTS = 5;
const DEFAULT_TIMEZONE = 'Asia/Kolkata';
const GEMINI_TIMEOUT_MS = 2 * 60 * 1000;
const GEMINI_MAX_ATTEMPTS = 3;
const GEMINI_RETRY_DELAY_MS = 2000;
// Focused on tech/AI news — ordered by signal strength so Tavily picks the most relevant results
const DEFAULT_QUERY = '(OpenAI OR Anthropic OR "Google DeepMind" OR "Meta AI" OR Mistral OR Gemini OR Claude OR GPT OR "AI model" OR LLM OR "AI agent") OR ("software engineering" OR "developer tools" OR "open source release" OR TypeScript OR Rust OR "Go lang" OR "Next.js" OR React OR Vercel OR GitHub) OR ("tech startup" OR "product launch" OR "cloud computing" OR "system design" OR "API" OR "database")';

function toISODateInTimezone(date: Date, tzone: string): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: tzone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const parts = formatter.formatToParts(date);
    const y = parts.find((p) => p.type === 'year')?.value;
    const m = parts.find((p) => p.type === 'month')?.value;
    const d = parts.find((p) => p.type === 'day')?.value;
    return `${y}-${m}-${d}`;
  } catch (e) {
    return date.toISOString().split('T')[0];
  }
}

function slugify(text: string): string {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return await Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(`Gemini response timed out after ${timeoutMs}ms`)), timeoutMs);
    }),
  ]);
}

function isCompleteDigestResponse(
  value: unknown,
): value is { title: string; description: string; keywords: string[]; content: string } {
  if (!value || typeof value !== 'object') return false;
  const digest = value as { title?: unknown; description?: unknown; keywords?: unknown; content?: unknown };
  return (
    typeof digest.title === 'string' &&
    digest.title.trim().length > 0 &&
    typeof digest.description === 'string' &&
    digest.description.trim().length > 0 &&
    Array.isArray(digest.keywords) &&
    digest.keywords.every((k) => typeof k === 'string') &&
    typeof digest.content === 'string' &&
    digest.content.trim().length > 0
  );
}

async function fetchTavilyNews(query: string, maxResults: number) {
  const url = 'https://api.tavily.com/search';
  const payload = {
    api_key: TAVILY_API_KEY,
    query,
    search_depth: 'advanced',
    include_answer: true,
    include_images: true,
    include_image_descriptions: true,
    include_raw_content: true,
    max_results: maxResults,
    include_domains: [
      'techcrunch.com', 'theverge.com', 'wired.com', 'arstechnica.com',
      'venturebeat.com', 'thenewstack.io', 'infoq.com', 'dev.to',
      'github.blog', 'openai.com', 'anthropic.com', 'deepmind.google',
      'huggingface.co', 'hacker-news.firebaseio.com', 'news.ycombinator.com',
      'zdnet.com', 'engadget.com', 'mit.edu', 'ieee.org', 'arxiv.org',
    ],
    exclude_domains: [],
    topic: "news",
    days: 2,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Tavily API responded with status ${response.status}: ${await response.text()}`);
  }

  return response.json();
}

async function generateDigestWithGemini(rawResults: TavilyResult[], dateStr: string) {
  // Sort from latest to oldest
  const sortedArticles = [...rawResults].sort((a, b) => {
     const dateA = a.published_date ? new Date(a.published_date).getTime() : 0;
     const dateB = b.published_date ? new Date(b.published_date).getTime() : 0;
     return dateB - dateA;
  });

  const contextData = sortedArticles.map((article, i) => {
    let articleImages = '';
    if (article.images && article.images.length > 0) {
      // Tavily returns top-level images as strings and nested ones as objects usually,
      // let's safely handle both formats.
      articleImages = '\nAvailable Images for this article:\n' + article.images.map((img: any) => {
        if (typeof img === 'string') return `- ![${article.title}](${img})`;
        return `- ![${img.description || article.title}](${img.url || img})`;
      }).join('\n');
    }

    // Prefer raw_content (full article text), fall back to snippet. Cap at 3000 chars per article
    // to stay within Gemini's context window across all articles.
    const bodyText = (article.raw_content || article.content || '').slice(0, 3000);

    return `
Article ${i + 1}:
Title: ${article.title}
Published: ${article.published_date || 'Unknown'}
URL: ${article.url}
Content: ${bodyText}${articleImages}`;
  }).join('\n\n');

  const prompt = `
You are an expert tech blogger and editorial designer. I will provide you with a list of recent AI and software development news articles with their FULL content, sorted from latest to oldest.
Your task: Use ONLY the information present in these articles to write a highly formatted, beautifully structured daily digest blog post. Cover EVERY article provided — do not skip any.

Requirements:
1. **Intro Hook & Global TL;DR**:
   - Start with an engaging 2-3 sentence introduction that captures the overall theme of the day's news.
   - IMMEDIATELY following, provide a bulleted **## TL;DR** section listing one punchy bullet per article. Every article must appear here.
2. **One section per article**: Write a dedicated ## section for EVERY article in the list. Do not merge or skip articles.
3. **Honest summaries**: Write each section based strictly on the article's provided content. Do NOT invent facts, statistics, or quotes not present in the source. If a detail is unclear, write around it rather than making it up.
4. **Depth from source**: Each section should be 2-4 paragraphs that synthesize the key points from the article content. Pull specific details, numbers, and quotes that are actually present in the source.
5. **Visual Separation**: Use horizontal rules (---) between articles.
6. **Key Takeaways**: Use a blockquote (> ) for the single most important insight per article.
7. **Styling**: Bold company names, technologies, and key numbers.
8. **Images**: Use the EXACT image markdown from "Available Images for this article". Place each image right under its ## heading.
9. **Links**: End each section with [🔗 Read more](URL) linking to the source article URL.
10. Output valid Markdown. DO NOT include frontmatter in the content string.

Date context: The news is for ${dateStr}.

Here are the ${sortedArticles.length} articles (cover ALL of them):
${contextData}
  `;

  console.log(`Calling Gemini gemini-2.5-flash for ${sortedArticles.length} articles...`);
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= GEMINI_MAX_ATTEMPTS; attempt++) {
    try {
      if (attempt > 1) {
        console.log(`Retrying Gemini call (${attempt}/${GEMINI_MAX_ATTEMPTS})...`);
      }

      const result = await withTimeout(model.generateContent(prompt), GEMINI_TIMEOUT_MS);
      const responseText = result.response.text();
      const parsed = JSON.parse(responseText);

      const finishReason = result.response.candidates?.[0]?.finishReason;
      if (finishReason && finishReason !== 'STOP') {
        throw new Error(`Gemini response incomplete (finishReason: ${finishReason})`);
      }

      if (!isCompleteDigestResponse(parsed)) {
        throw new Error('Gemini response missing required fields or returned empty content');
      }

      return parsed;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`Gemini digest attempt ${attempt}/${GEMINI_MAX_ATTEMPTS} failed: ${lastError.message}`);

      if (attempt < GEMINI_MAX_ATTEMPTS) {
        await delay(GEMINI_RETRY_DELAY_MS);
      }
    }
  }

  throw lastError ?? new Error('Gemini digest generation failed');
}

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function main() {
  const timeZone = process.env.TAVILY_NEWS_TIMEZONE || DEFAULT_TIMEZONE;
  const date = toISODateInTimezone(new Date(), timeZone);
  const query = process.env.TAVILY_NEWS_QUERY || DEFAULT_QUERY;

  const maxResultsArg = parseInt(process.argv.includes('--max-results') ? process.argv[process.argv.indexOf('--max-results') + 1] : String(DEFAULT_MAX_RESULTS), 10);
  const maxResults = isNaN(maxResultsArg) ? DEFAULT_MAX_RESULTS : Math.min(maxResultsArg, 20);

  const newsDir = path.join(process.cwd(), 'content', 'news');
  const rawDir = path.join(newsDir, 'raw');
  ensureDir(newsDir);
  ensureDir(rawDir);

  console.log('Fetching news from Tavily...');
  const data = await fetchTavilyNews(query, maxResults);
  const results = data.results || [];

  if (results.length === 0) {
    throw new Error('Tavily returned no usable results.');
  }

  // Generate content using Gemini
  const llmResponse = await generateDigestWithGemini(results, date);
  const safeFilename = slugify(llmResponse.title || `daily-digest-${date}`);
  const markdownPath = path.join(newsDir, `${safeFilename}.md`);

  // Build the markdown file with frontmatter
  const frontmatter = `---
title: "${llmResponse.title.replace(/"/g, '\\"')}"
description: "${llmResponse.description.replace(/"/g, '\\"')}"
date: "${date}"
tags: [${(llmResponse.keywords || []).map((k: string) => `"${k}"`).join(', ')}]
source: "tavily"
---
`;

  const finalMarkdown = `${frontmatter}

${llmResponse.content}
`;

  fs.writeFileSync(markdownPath, finalMarkdown, 'utf8');

  console.log(`News digest written: ${markdownPath}`);

  // Delete the raw folder once we have the article
  if (fs.existsSync(rawDir)) {
    fs.rmSync(rawDir, { recursive: true, force: true });
    console.log(`Cleaned up raw folder: ${rawDir}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
