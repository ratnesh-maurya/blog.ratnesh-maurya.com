import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { CATEGORIES, GEMINI_MODEL, TOPICS, type Category } from './config';
import { hostnameOf, type Candidate } from './select';
import { delay, toISODateInTimezone, withTimeout } from './util';

const TIMEOUT_MS = 2 * 60 * 1000;
const MAX_ATTEMPTS = 3;
const BASE_RETRY_DELAY_MS = 2000;
/** Per-article text cap, to keep all stories inside the context window. */
const BODY_CHARS = 3500;

export interface DigestItem {
  /** 0-based index into the candidate list. */
  index: number;
  headline: string;
  category: Category;
  /** 1 (minor) – 5 (major). */
  importance: number;
  tldr: string;
  summary: string;
  keyFacts: string[];
  whyItMatters: string;
  takeaway: string;
  caveat: string;
}

export interface Digest {
  title: string;
  description: string;
  keywords: string[];
  intro: string;
  items: DigestItem[];
  watch: string[];
}

const str = (description: string) => ({ type: SchemaType.STRING as const, description });
const strList = (description: string) => ({
  type: SchemaType.ARRAY as const,
  items: { type: SchemaType.STRING as const },
  description,
});

function buildModel(apiKey: string) {
  return new GoogleGenerativeAI(apiKey).getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: {
      responseMimeType: 'application/json',
      maxOutputTokens: 16384,
      // @ts-expect-error thinkingConfig is valid for gemini-2.5-flash but missing from the SDK types
      thinkingConfig: { thinkingBudget: 0 },
      responseSchema: {
        type: SchemaType.OBJECT as const,
        properties: {
          title: str('Digest title, max 60 characters. Name the 1-2 biggest stories concretely. No clickbait, no emoji.'),
          description: str('Meta description, 120-160 characters, summarising what the digest covers.'),
          keywords: strList('5-8 specific tags (product, company, technology names). No generic tags like "AI" or "News".'),
          intro: str('2-3 sentences: the single theme or tension running through today\'s news, and which story matters most.'),
          items: {
            type: SchemaType.ARRAY as const,
            description: 'One entry per provided article.',
            items: {
              type: SchemaType.OBJECT as const,
              properties: {
                source: { type: SchemaType.INTEGER as const, description: 'The article number from the input (1-based).' },
                headline: str('Plain-text headline (max 90 chars) that states what happened. No markdown.'),
                category: str(`One of: ${CATEGORIES.join(' | ')}`),
                importance: { type: SchemaType.INTEGER as const, description: '1-5. 5 = changes how engineers build or operate things this week; 1 = minor/niche.' },
                tldr: str('One sentence (max 140 chars) with the concrete fact.'),
                summary: str('2-3 short paragraphs separated by blank lines: what happened, the specifics, the context. Only facts present in the source.'),
                keyFacts: strList('2-4 short bullets: concrete numbers, versions, dates, prices or names taken from the source.'),
                whyItMatters: str('1-2 sentences on the practical impact for backend, systems and AI engineers. Concrete, not generic.'),
                takeaway: str('One memorable sentence — the single thing to remember.'),
                caveat: str('Empty string unless the source itself says the news is a rumour, early preview, single-source report or unconfirmed. Then say so in one sentence.'),
              },
              required: ['source', 'headline', 'category', 'importance', 'tldr', 'summary', 'keyFacts', 'whyItMatters', 'takeaway', 'caveat'],
            },
          },
          watch: strList('2-3 follow-ups worth watching, each grounded in the articles (a pending decision, rollout, or open question).'),
        },
        required: ['title', 'description', 'keywords', 'intro', 'items', 'watch'],
      },
    },
  });
}

function buildPrompt(candidates: Candidate[], dateStr: string): string {
  const topicLabel = new Map(TOPICS.map((t) => [t.id, t.label]));
  const articles = candidates
    .map((c, i) => {
      const body = (c.raw_content || c.content || '').replace(/\s+/g, ' ').trim().slice(0, BODY_CHARS);
      const hints = c.topics.map((t) => topicLabel.get(t) ?? t).join(', ');
      return `[${i + 1}] ${c.title}
Source: ${hostnameOf(c.url)} | Published: ${c.published_date || 'unknown'} | Topic hint: ${hints}
Content: ${body}`;
    })
    .join('\n\n');

  return `You are the editor of "Ratn Labs Daily", a news digest read by backend, systems and AI engineers who want signal, not hype. The date is ${dateStr}.

Write the digest from the ${candidates.length} articles below.

Rules:
1. Use ONLY facts present in the articles. Never invent numbers, quotes, versions, dates or names. If the source is vague, stay vague. Do not use outside knowledge to fill gaps.
2. Cover EVERY article exactly once in "items" (reference it by its number). Do not merge or skip any.
3. Be specific: prefer "cuts p99 latency from 120ms to 40ms" over "improves performance". Keep concrete numbers, versions and names from the source.
4. "whyItMatters" must be about practical impact for engineers (what to change, evaluate, patch, or watch). If an article has no real engineering impact, say so plainly rather than inflating it.
5. Rate "importance" honestly. A digest where everything is a 5 is useless; most days have one or two 4-5 stories and several 2-3.
6. Plain, neutral tone. No hype words (revolutionary, game-changing, groundbreaking), no emoji, no rhetorical questions.
7. Do not use markdown headings or links inside any field. Plain text only (paragraph breaks are fine).
8. Title max 60 characters; description 120-160 characters.

Articles:

${articles}`;
}

const CATEGORY_SET = new Set<string>(CATEGORIES);

function toCategory(raw: unknown): Category {
  return typeof raw === 'string' && CATEGORY_SET.has(raw) ? (raw as Category) : 'Industry';
}

const nonEmpty = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;

/** Validates the model output against the candidate list; throws on anything unusable. */
export function parseDigest(value: unknown, candidateCount: number): Digest {
  const d = value as Record<string, unknown> | null;
  if (!d || typeof d !== 'object') throw new Error('Digest is not an object');
  if (!nonEmpty(d.title) || !nonEmpty(d.description) || !nonEmpty(d.intro)) {
    throw new Error('Digest missing title, description or intro');
  }
  if (!Array.isArray(d.items)) throw new Error('Digest missing items');

  const seen = new Set<number>();
  const items: DigestItem[] = [];
  for (const raw of d.items as Array<Record<string, unknown>>) {
    const source = Number(raw?.source);
    if (!Number.isInteger(source) || source < 1 || source > candidateCount || seen.has(source)) continue;
    if (![raw.headline, raw.tldr, raw.summary, raw.whyItMatters].every(nonEmpty)) continue;
    seen.add(source);
    items.push({
      index: source - 1,
      headline: (raw.headline as string).trim(),
      category: toCategory(raw.category),
      importance: Math.min(5, Math.max(1, Math.round(Number(raw.importance) || 3))),
      tldr: (raw.tldr as string).trim(),
      summary: (raw.summary as string).trim(),
      keyFacts: Array.isArray(raw.keyFacts) ? raw.keyFacts.filter(nonEmpty).map((s) => s.trim()) : [],
      whyItMatters: (raw.whyItMatters as string).trim(),
      takeaway: nonEmpty(raw.takeaway) ? raw.takeaway.trim() : '',
      caveat: nonEmpty(raw.caveat) ? raw.caveat.trim() : '',
    });
  }

  // The model is told to cover everything; tolerate a small miss but not a truncated reply.
  if (items.length < Math.ceil(candidateCount * 0.8)) {
    throw new Error(`Digest covers ${items.length}/${candidateCount} articles`);
  }

  return {
    title: (d.title as string).trim(),
    description: (d.description as string).trim(),
    keywords: Array.isArray(d.keywords) ? d.keywords.filter(nonEmpty).map((s) => s.trim()).slice(0, 8) : [],
    intro: (d.intro as string).trim(),
    items,
    watch: Array.isArray(d.watch) ? d.watch.filter(nonEmpty).map((s) => s.trim()).slice(0, 3) : [],
  };
}

export async function generateDigest(apiKey: string, candidates: Candidate[], timeZone: string): Promise<Digest> {
  const model = buildModel(apiKey);
  const prompt = buildPrompt(candidates, toISODateInTimezone(new Date(), timeZone));
  console.log(`Calling ${GEMINI_MODEL} for ${candidates.length} articles...`);

  let lastError: Error | undefined;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      if (attempt > 1) console.log(`Retrying Gemini call (${attempt}/${MAX_ATTEMPTS})...`);
      // Non-streaming: streaming fails to parse long structured JSON.
      const text = await withTimeout(
        model.generateContent(prompt).then((r) => r.response.text()),
        TIMEOUT_MS,
        'Gemini response',
      );
      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch {
        throw new Error(`JSON parse failed (likely truncated): ...${text.slice(-160)}`);
      }
      return parseDigest(parsed, candidates.length);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`Gemini attempt ${attempt}/${MAX_ATTEMPTS} failed: ${lastError.message}`);
      if (attempt < MAX_ATTEMPTS) await delay(BASE_RETRY_DELAY_MS * 2 ** (attempt - 1));
    }
  }
  throw lastError ?? new Error('Gemini digest generation failed');
}
