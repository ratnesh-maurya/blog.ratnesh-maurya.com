import { isBotUserAgent } from '@/lib/bot';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const METRICS = new Set(['LCP', 'CLS', 'INP', 'FCP', 'TTFB']);
const RATINGS = new Set(['good', 'needs-improvement', 'poor']);

/** Receives Core Web Vitals beacons and stores them for the dashboard. */
export async function POST(request: Request) {
  try {
    if (request.headers.get('cookie')?.includes('__exclude_tracking=1')) {
      return NextResponse.json({ ok: true, skipped: true });
    }
    if (isBotUserAgent(request.headers.get('user-agent'))) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const body = await request.json();
    const path = typeof body?.path === 'string' ? body.path.slice(0, 300) : null;
    // Batched beacon: { path, metrics: [...] }. Legacy single-metric body still accepted.
    const items: unknown[] = Array.isArray(body?.metrics) ? body.metrics.slice(0, 10) : [body];

    const rows = items.flatMap((item) => {
      const it = item as { metric?: unknown; value?: unknown; rating?: unknown; path?: unknown };
      const metric = typeof it?.metric === 'string' ? it.metric : null;
      const value = typeof it?.value === 'number' && isFinite(it.value) ? it.value : null;
      const rating = typeof it?.rating === 'string' && RATINGS.has(it.rating) ? it.rating : null;
      const rowPath = path ?? (typeof it?.path === 'string' ? it.path.slice(0, 300) : null);
      if (!metric || !METRICS.has(metric) || value === null || value < 0 || value > 120000) return [];
      return [{ metric, value, rating, path: rowPath }];
    });
    if (rows.length === 0) {
      return NextResponse.json({ message: 'Invalid vital' }, { status: 400 });
    }

    const supabase = createClient();
    const { error } = await supabase.from('web_vitals').insert(rows);
    if (error) {
      console.error('web_vitals insert error:', error);
      return NextResponse.json({ message: 'Failed to record' }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('POST /api/vitals error:', e);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
