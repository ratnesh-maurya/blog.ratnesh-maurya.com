/**
 * SEO lint — runs before `next build` to catch metadata that will hurt rankings.
 *
 * Checks every blog post and silly-question MDX for:
 *  - title length (40–60 chars; soft warn outside, hard error > 70)
 *  - description length (120–160 chars; hard error > 200 or < 80)
 *  - missing `date`
 *  - `updated` (when present) is a valid ISO date and not before `date`
 *
 * Exits non-zero on hard errors so CI catches them.
 */

import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

interface Issue {
  file: string;
  level: 'error' | 'warn';
  message: string;
}

const ROOT = path.join(process.cwd(), 'content');
const TARGETS = [
  { dir: 'blog', titleField: 'title', descField: 'description' },
  { dir: 'silly-questions', titleField: 'question', descField: '' },
  { dir: 'til', titleField: 'title', descField: '' },
];

const TITLE_HARD_MAX = 70;
const TITLE_SOFT_MIN = 40;
const TITLE_SOFT_MAX = 60;
const DESC_HARD_MIN = 80;
const DESC_HARD_MAX = 200;
const DESC_SOFT_MIN = 120;
const DESC_SOFT_MAX = 160;

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) return walk(full);
    if (e.isFile() && (e.name.endsWith('.md') || e.name.endsWith('.mdx')) && e.name !== 'README.md') return [full];
    return [];
  });
}

function lintFile(file: string, titleField: string, descField: string): Issue[] {
  const issues: Issue[] = [];
  const raw = fs.readFileSync(file, 'utf8');
  const { data } = matter(raw);
  const rel = path.relative(process.cwd(), file);

  const title = data[titleField];
  if (!title || typeof title !== 'string' || !title.trim()) {
    issues.push({ file: rel, level: 'error', message: `missing ${titleField}` });
  } else {
    const len = title.trim().length;
    if (len > TITLE_HARD_MAX) {
      issues.push({ file: rel, level: 'error', message: `${titleField} ${len} chars (max ${TITLE_HARD_MAX})` });
    } else if (len > TITLE_SOFT_MAX || len < TITLE_SOFT_MIN) {
      issues.push({ file: rel, level: 'warn', message: `${titleField} ${len} chars (target ${TITLE_SOFT_MIN}–${TITLE_SOFT_MAX})` });
    }
  }

  if (descField) {
    const desc = data[descField];
    if (!desc || typeof desc !== 'string' || !desc.trim()) {
      issues.push({ file: rel, level: 'error', message: `missing ${descField}` });
    } else {
      const len = desc.trim().length;
      if (len < DESC_HARD_MIN || len > DESC_HARD_MAX) {
        issues.push({ file: rel, level: 'error', message: `${descField} ${len} chars (range ${DESC_HARD_MIN}–${DESC_HARD_MAX})` });
      } else if (len < DESC_SOFT_MIN || len > DESC_SOFT_MAX) {
        issues.push({ file: rel, level: 'warn', message: `${descField} ${len} chars (target ${DESC_SOFT_MIN}–${DESC_SOFT_MAX})` });
      }
    }
  }

  if (!data.date) {
    issues.push({ file: rel, level: 'error', message: 'missing date' });
  }

  if (data.updated) {
    const u = new Date(data.updated);
    const d = data.date ? new Date(data.date) : null;
    if (Number.isNaN(u.getTime())) {
      issues.push({ file: rel, level: 'error', message: `invalid updated: ${data.updated}` });
    } else if (d && u.getTime() < d.getTime()) {
      issues.push({ file: rel, level: 'error', message: 'updated is before date' });
    }
  }

  return issues;
}

function main() {
  const all: Issue[] = [];
  for (const t of TARGETS) {
    const files = walk(path.join(ROOT, t.dir));
    for (const f of files) {
      all.push(...lintFile(f, t.titleField, t.descField));
    }
  }

  const errors = all.filter((i) => i.level === 'error');
  const warns = all.filter((i) => i.level === 'warn');

  for (const w of warns) console.warn(`[seo-lint:warn] ${w.file} — ${w.message}`);
  for (const e of errors) console.error(`[seo-lint:error] ${e.file} — ${e.message}`);

  console.log(`[seo-lint] ${all.length === 0 ? 'clean' : `${errors.length} errors, ${warns.length} warnings`}`);

  if (errors.length > 0) {
    if (process.env.SEO_LINT_SOFT === '1') {
      console.warn('[seo-lint] SEO_LINT_SOFT=1 — not failing build');
      return;
    }
    process.exit(1);
  }
}

main();
