import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content');
const cheatsheetsDir = path.join(contentDir, 'cheatsheets');

export interface NowSection {
  emoji: string;
  heading: string;
  content: string[];
}

export interface NowContent {
  lastUpdated: string;
  sections: NowSection[];
}

export function getNowContent(): NowContent {
  const filePath = path.join(contentDir, 'now.md');
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(raw);
  return {
    lastUpdated: data.lastUpdated ?? 'Unknown',
    sections: data.sections ?? [],
  };
}

export interface UsesItem {
  name: string;
  desc: string;
  href?: string;
  badge?: string;
}

export interface UsesSection {
  title: string;
  emoji: string;
  items: UsesItem[];
}

export function getUsesContent(): { sections: UsesSection[] } {
  const filePath = path.join(contentDir, 'uses.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw) as { sections: UsesSection[] };
}

export interface GlossaryItem {
  term: string;
  def: string;
}

export interface GlossaryCategory {
  category: string;
  items: GlossaryItem[];
}

export function getGlossaryContent(): { terms: GlossaryCategory[] } {
  const filePath = path.join(contentDir, 'glossary.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw) as { terms: GlossaryCategory[] };
}

export interface PrivacySection {
  title: string;
  body: string[];
}

export interface PrivacyPolicyContent {
  lastRevised: string;
  tldr: string;
  sections: PrivacySection[];
}

export function getPrivacyPolicyContent(): PrivacyPolicyContent {
  const filePath = path.join(contentDir, 'privacy-policy.md');
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(raw);
  return {
    lastRevised: data.lastRevised ?? 'Unknown',
    tldr: data.tldr ?? '',
    sections: data.sections ?? [],
  };
}

export interface SeriesConfigItem {
  id: string;
  title: string;
  desc: string;
  emoji: string;
  matchCategory?: string;
  matchTags?: string[];
  orderedSlugs?: string[];
}

export function getSeriesConfig(): SeriesConfigItem[] {
  const filePath = path.join(contentDir, 'series.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw) as SeriesConfigItem[];
}

export interface TopicMeta {
  emoji: string;
  description: string;
  color: string;
  textColor: string;
}

export function getTopicsMeta(): Record<string, TopicMeta> {
  const filePath = path.join(contentDir, 'topics.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw) as Record<string, TopicMeta>;
}

export interface CheatsheetSection {
  title: string;
  code: string;
}

export interface CheatsheetContent {
  title: string;
  description: string;
  subtitle?: string;
  keywords: string[];
  emoji?: string;
  sections: CheatsheetSection[];
}

export function getCheatsheet(slug: string): CheatsheetContent | null {
  try {
    const filePath = path.join(cheatsheetsDir, `${slug}.json`);
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw) as CheatsheetContent;
  } catch {
    return null;
  }
}

export function getCheatsheetSlugs(): string[] {
  if (!fs.existsSync(cheatsheetsDir)) return [];
  return fs.readdirSync(cheatsheetsDir)
    .filter((n) => n.endsWith('.json'))
    .map((n) => n.replace(/\.json$/, ''));
}
