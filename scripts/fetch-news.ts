import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import {
  DEFAULT_TIMEZONE,
  MIN_STORIES,
  SEARCH_DAYS,
  TOPICS,
  WIDE_SEARCH_DAYS,
} from './news/config';
import { generateDigest } from './news/digest';
import { renderDigest } from './news/render';
import {
  existingDigestDates,
  loadCoveredUrls,
  selectCandidates,
  type Candidate,
  type TavilyResult,
} from './news/select';
import { searchTopic } from './news/tavily';
import { slugify, toISODateInTimezone } from './news/util';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!TAVILY_API_KEY || !GEMINI_API_KEY) {
  console.error('Error: set TAVILY_API_KEY and GEMINI_API_KEY (in .env locally, or as repository secrets).');
  process.exit(1);
}

const args = process.argv.slice(2);
const FORCE = args.includes('--force') || ['1', 'true'].includes(process.env.NEWS_FORCE ?? '');
const DRY_RUN = args.includes('--dry-run');

const newsDir = path.join(process.cwd(), 'content', 'news');

async function gather(days: number, covered: Set<string>): Promise<Candidate[]> {
  const settled = await Promise.allSettled(TOPICS.map((t) => searchTopic(TAVILY_API_KEY as string, t, days)));
  const perTopic: Array<{ topic: string; results: TavilyResult[] }> = [];
  settled.forEach((s, i) => {
    if (s.status === 'fulfilled') {
      console.log(`  ${TOPICS[i].id}: ${s.value.length} results`);
      perTopic.push({ topic: TOPICS[i].id, results: s.value });
    } else {
      console.warn(`  ${TOPICS[i].id}: ${s.reason instanceof Error ? s.reason.message : s.reason}`);
    }
  });
  if (perTopic.length === 0) throw new Error('Every Tavily query failed.');
  return selectCandidates(perTopic, { covered, days });
}

async function main() {
  const timeZone = process.env.TAVILY_NEWS_TIMEZONE || DEFAULT_TIMEZONE;
  const date = toISODateInTimezone(new Date(), timeZone);
  fs.mkdirSync(newsDir, { recursive: true });

  if (!FORCE && existingDigestDates(newsDir).has(date)) {
    console.log(`A digest for ${date} already exists — skipping (use --force to publish another).`);
    return;
  }

  const covered = loadCoveredUrls(newsDir);
  console.log(`Searching ${TOPICS.length} topics (${covered.size} URLs already covered)...`);
  let candidates = await gather(SEARCH_DAYS, covered);

  if (candidates.length < MIN_STORIES) {
    console.log(`Only ${candidates.length} new stories — widening the window to ${WIDE_SEARCH_DAYS} days.`);
    candidates = await gather(WIDE_SEARCH_DAYS, covered);
  }
  if (candidates.length < MIN_STORIES) {
    console.log(`Only ${candidates.length} new stories after widening (need ${MIN_STORIES}) — nothing published today.`);
    return;
  }
  console.log(`Selected ${candidates.length} stories.`);

  const digest = await generateDigest(GEMINI_API_KEY as string, candidates, timeZone);
  const { file, frontmatter } = renderDigest(digest, candidates, date, timeZone);

  if (DRY_RUN) {
    console.log(file);
    return;
  }

  let slug = slugify(String(frontmatter.title)) || `daily-digest-${date}`;
  if (fs.existsSync(path.join(newsDir, `${slug}.md`))) slug = `${slug}-${date}`;
  const out = path.join(newsDir, `${slug}.md`);
  fs.writeFileSync(out, file, 'utf8');
  console.log(`News digest written: ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
