import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const defaultFrom = new Date(today);
    defaultFrom.setDate(defaultFrom.getDate() - 29);

    const fromStr = fromParam ?? defaultFrom.toISOString().slice(0, 10);
    const toStr = toParam ?? today.toISOString().slice(0, 10);

    const fromDate = new Date(fromStr);
    const toDate = new Date(toStr);
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return NextResponse.json({ message: 'Invalid date (use YYYY-MM-DD)' }, { status: 400 });
    }

    const supabase = createClient();
    const { data, error } = await supabase.rpc('get_utm_flow', {
      p_from: fromStr,
      p_to: toStr,
    });

    if (error) {
      console.error('get_utm_flow error:', error);
      return NextResponse.json({ message: 'Failed to load flow data' }, { status: 500 });
    }

    const result = data as {
      flows?: Array<{ source: string; content_type: string; count: number }>;
      total?: number;
    } | null;

    return NextResponse.json({
      flows: Array.isArray(result?.flows) ? result.flows : [],
      total: typeof result?.total === 'number' ? result.total : 0,
      from: fromStr,
      to: toStr,
    });
  } catch (e) {
    console.error('GET /api/analytics/utm-flow error:', e);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
