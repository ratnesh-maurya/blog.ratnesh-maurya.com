import { INCLUDE_DOMAINS, RESULTS_PER_TOPIC, type NewsTopic } from './config';
import { delay } from './util';
import type { TavilyResult } from './select';

const ENDPOINT = 'https://api.tavily.com/search';
const MAX_ATTEMPTS = 3;

export async function searchTopic(apiKey: string, topic: NewsTopic, days: number): Promise<TavilyResult[]> {
  const body = JSON.stringify({
    api_key: apiKey,
    query: topic.query,
    topic: 'news',
    days,
    search_depth: 'advanced',
    max_results: RESULTS_PER_TOPIC,
    include_raw_content: true,
    include_images: true,
    include_image_descriptions: true,
    include_domains: INCLUDE_DOMAINS,
  });

  let lastError = '';
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    if (res.ok) {
      const data = (await res.json()) as { results?: TavilyResult[] };
      return data.results ?? [];
    }
    lastError = `${res.status}: ${(await res.text()).slice(0, 200)}`;
    // Only rate limits and server errors are worth retrying.
    if (res.status !== 429 && res.status < 500) break;
    await delay(1500 * 2 ** (attempt - 1));
  }
  throw new Error(`Tavily "${topic.id}" failed (${lastError})`);
}
