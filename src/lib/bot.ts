/**
 * Bot detection shared by client trackers and API tracking routes.
 * Goal: keep stats/utm/vitals limited to real readers — crawlers that
 * execute JS (Googlebot, headless audits) and direct scrapers both
 * inflate numbers otherwise.
 */

// Matches search crawlers, social preview fetchers, headless/automation
// tools, uptime monitors, and HTTP libraries used by scrapers.
export const BOT_UA_PATTERN =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegram|discord|twitterbot|linkedinbot|embedly|quora|pinterest|vkshare|redditbot|applebot|semrush|ahrefs|mj12|dotbot|petalbot|bytespider|gptbot|claudebot|ccbot|perplexity|amazonbot|headless|lighthouse|pagespeed|gtmetrix|pingdom|uptimerobot|statuscake|phantomjs|puppeteer|playwright|selenium|python-requests|python-urllib|aiohttp|httpx|go-http-client|okhttp|curl|wget|scrapy|node-fetch|axios|java\/|libwww/i;

/** Server-side check from a request's User-Agent header. */
export function isBotUserAgent(ua: string | null | undefined): boolean {
  if (!ua) return true; // no UA at all = not a browser
  return BOT_UA_PATTERN.test(ua);
}

/** Client-side check — automation flags plus the same UA patterns. */
export function isBotBrowser(): boolean {
  if (typeof navigator === 'undefined') return true;
  if (navigator.webdriver) return true; // headless Chrome, Selenium, Playwright
  return isBotUserAgent(navigator.userAgent);
}
