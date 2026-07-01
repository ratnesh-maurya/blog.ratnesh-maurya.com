import { isBotUserAgent } from '@/lib/bot';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/** Coarse device class from the user-agent — no fingerprinting. */
function classifyDevice(ua: string | null): string | null {
  if (!ua) return null;
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua)) return 'tablet';
  if (/Mobi|Android|iPhone|iPod/i.test(ua)) return 'mobile';
  return 'desktop';
}

export async function POST(request: Request) {
  try {
    // Middleware sets this cookie for excluded IPs (author's own devices)
    if (request.headers.get('cookie')?.includes('__exclude_tracking=1')) {
      return NextResponse.json({ ok: true, skipped: true });
    }
    // Crawlers and scrapers never count as visits
    if (isBotUserAgent(request.headers.get('user-agent'))) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const body = await request.json();
    const utmSource = typeof body?.utm_source === 'string' ? body.utm_source.trim() || null : null;
    const utmMedium = typeof body?.utm_medium === 'string' ? body.utm_medium.trim() || null : null;
    const utmCampaign = typeof body?.utm_campaign === 'string' ? body.utm_campaign.trim() || null : null;
    const utmContent = typeof body?.utm_content === 'string' ? body.utm_content.trim() || null : null;
    const utmTerm = typeof body?.utm_term === 'string' ? body.utm_term.trim() || null : null;
    const ref = typeof body?.ref === 'string' ? body.ref.trim() || null : null;
    const path = typeof body?.path === 'string' ? body.path.trim() || null : null;
    const referrer = typeof body?.referrer === 'string' ? body.referrer.trim().slice(0, 500) || null : null;

    // Campaign hit, external referral, or plain (direct) session visit — all valid
    if (!utmSource && !utmMedium && !utmCampaign && !ref && !referrer && !path) {
      return NextResponse.json({ message: 'Empty hit' }, { status: 400 });
    }

    const device = classifyDevice(request.headers.get('user-agent'));
    // Vercel edge geo header; absent locally
    const country = request.headers.get('x-vercel-ip-country') || null;

    const supabase = createClient();
    const { error } = await supabase.from('utm_hits').insert({
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_content: utmContent,
      utm_term: utmTerm,
      ref,
      path,
      referrer,
      device,
      country,
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
