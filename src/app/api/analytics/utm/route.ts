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
    defaultFrom.setDate(defaultFrom.getDate() - 89);
    const defaultTo = new Date(today);

    const fromStr = fromParam ?? defaultFrom.toISOString().slice(0, 10);
    const toStr = toParam ?? defaultTo.toISOString().slice(0, 10);
    const fromDate = new Date(fromStr);
    const toDate = new Date(toStr);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return NextResponse.json(
        { message: 'Invalid from or to date (use YYYY-MM-DD)' },
        { status: 400 }
      );
    }

    const from = fromStr;
    const to = toStr;

    const supabase = createClient();
    const { data, error } = await supabase.rpc('get_utm_analytics', {
      p_from: from,
      p_to: to,
    });

    if (error) {
      console.error('get_utm_analytics error:', error);
      return NextResponse.json(
        { message: 'Failed to load UTM analytics' },
        { status: 500 }
      );
    }

    const result = data as {
      bySource?: Array<{ source: string; count: number }>;
      byMedium?: Array<{ medium: string; count: number }>;
      byCampaign?: Array<{ campaign: string; count: number }>;
      daily?: Array<{ day: string; count: number }>;
      total?: number;
    } | null;

    if (!result) {
      return NextResponse.json({
        bySource: [],
        byMedium: [],
        byCampaign: [],
        daily: [],
        total: 0,
        from,
        to,
      });
    }

    const bySource = Array.isArray(result.bySource) ? result.bySource : [];
    const byMedium = Array.isArray(result.byMedium) ? result.byMedium : [];
    const byCampaign = Array.isArray(result.byCampaign) ? result.byCampaign : [];
    const daily = Array.isArray(result.daily) ? result.daily.sort((a, b) => a.day.localeCompare(b.day)) : [];
    const total = typeof result.total === 'number' ? result.total : 0;

    return NextResponse.json({
      bySource,
      byMedium,
      byCampaign,
      daily,
      total,
      from,
      to,
    });
  } catch (e) {
    console.error('GET /api/analytics/utm error:', e);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
