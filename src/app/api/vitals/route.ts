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

    const body = await request.json();
    const metric = typeof body?.metric === 'string' ? body.metric : null;
    const value = typeof body?.value === 'number' && isFinite(body.value) ? body.value : null;
    const rating = typeof body?.rating === 'string' && RATINGS.has(body.rating) ? body.rating : null;
    const path = typeof body?.path === 'string' ? body.path.slice(0, 300) : null;

    if (!metric || !METRICS.has(metric) || value === null || value < 0 || value > 120000) {
      return NextResponse.json({ message: 'Invalid vital' }, { status: 400 });
    }

    const supabase = createClient();
    const { error } = await supabase.from('web_vitals').insert({ metric, value, rating, path });
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
