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
  published_date?: string;
  score?: number;
  images?: any[];
}

// ... helper methods etc
const DEFAULT_MAX_RESULTS = 10;
const DEFAULT_TIMEZONE = 'Asia/Kolkata';
const DEFAULT_QUERY = 'AI OR "Software Development" OR "Next.js" OR "React" OR "Cloud Architecture" OR "System Design" OR "TypeScript" OR "Postgres" OR "Go" OR "Rust" language';

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

async function fetchTavilyNews(query: string, maxResults: number) {
  const url = 'https://api.tavily.com/search';
  const payload = {
    api_key: TAVILY_API_KEY,
    query,
    search_depth: 'advanced',
    include_answer: true,
    include_images: true,
    include_image_descriptions: true,
    include_raw_content: false,
    max_results: maxResults,
    include_domains: [],
    exclude_domains: [],
    topic: "news",
    days: 3,
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

    return `
Article ${i + 1}:
Title: ${article.title}
Published: ${article.published_date || 'Unknown'}
URL: ${article.url}
Content Fragment: ${article.content}${articleImages}`;
  }).join('\n\n');

  const prompt = `
You are an expert tech blogger and editorial designer. I will provide you with a list of recent AI and software development news articles, sorted from latest to oldest.
Your task: Use ONLY these provided articles to write a highly formatted, beautifully structured daily digest blog post.

Requirements:
1. **Intro Hook & Global TL;DR**:
   - Start with an engaging, impromptu introduction that captures the overall theme of the day's news.
   - IMMEDIATELY following the intro, provide a bulleted **"⚡ TL;DR"** section at the very top summarizing the 3-5 biggest news drops in this digest. Format this with a bold `## ⚡ TL;DR` heading and concise, punchy bullet points to give readers an instant bird's-eye view.
2. **Visual Separation**: Differentiate each topic clearly. Use horizontal rules (---) to separate different news items to maximize the viewing experience.
3. **Headings**: Use proper markdown headings (## for main news topics).
4. **Key Takeaways**: For each news item, use blockquotes (> ) to highlight the TL;DR or most important insight.
5. **Styling**: Make the formatting pop. Use bold text for companies, technologies, and crucial numbers.
6. **Images**: Use the EXACT markdown image paths from "Available Images for this article". Place images strategically in the topic section so they look great (ideally right under the ## heading).
7. **Links**: Provide clear Markdown links to the source articles at the end of each topic section, formatted beautifully (e.g., [🔗 Read full source block](URL)).
8. Do NOT reinvent or add facts not present in the provided fragments. You can add editorial flow, but stay true to the content.
9. Output valid Markdown for the 'content' field in your response. DO NOT include any frontmatter in the 'content' string.

Date context: The news is for ${dateStr}.

Here are the articles:
${contextData}
  `;

  console.log('Calling Gemini model gemini-1.5-flash for generation...');
  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  return JSON.parse(responseText);
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
