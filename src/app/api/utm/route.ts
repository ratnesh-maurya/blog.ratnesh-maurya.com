import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const utmSource = typeof body?.utm_source === 'string' ? body.utm_source.trim() || null : null;
    const utmMedium = typeof body?.utm_medium === 'string' ? body.utm_medium.trim() || null : null;
    const utmCampaign = typeof body?.utm_campaign === 'string' ? body.utm_campaign.trim() || null : null;
    const utmContent = typeof body?.utm_content === 'string' ? body.utm_content.trim() || null : null;
    const utmTerm = typeof body?.utm_term === 'string' ? body.utm_term.trim() || null : null;
    const ref = typeof body?.ref === 'string' ? body.ref.trim() || null : null;
    const path = typeof body?.path === 'string' ? body.path.trim() || null : null;

    if (!utmSource && !utmMedium && !utmCampaign && !ref) {
      return NextResponse.json(
        { message: 'At least one of utm_source, utm_medium, utm_campaign, ref is required' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const { error } = await supabase.from('utm_hits').insert({
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_content: utmContent,
      utm_term: utmTerm,
      ref,
      path,
    });

    if (error) {
      console.error('utm hit insert error:', error);
      return NextResponse.json({ message: 'Failed to record UTM hit' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('POST /api/utm error:', e);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
