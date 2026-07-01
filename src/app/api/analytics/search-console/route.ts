import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export const revalidate = 3600; // Search Console data lags ~2 days; cache 1h

const SITE_URL = 'https://blog.ratnesh-maurya.com/';

/**
 * Google Search Console: top queries + pages for the last 28 days.
 * Reuses the indexing service account (add it to the GSC property with
 * "Full" permission, scope webmasters.readonly). Returns 501 until the
 * env vars are configured so the dashboard can show a setup hint.
 */
export async function GET() {
  const email = process.env.GOOGLE_INDEXING_CLIENT_EMAIL;
  const key = process.env.GOOGLE_INDEXING_PRIVATE_KEY;
  if (!email || !key) {
    return NextResponse.json({ configured: false }, { status: 501 });
  }

  try {
    const auth = new google.auth.JWT({
      email,
      key: key.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });
    await auth.authorize();
    const searchconsole = google.searchconsole({ version: 'v1', auth });

    const endDate = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10);
    const startDate = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);

    const [byQuery, byPage, totals] = await Promise.all([
      searchconsole.searchanalytics.query({
        siteUrl: SITE_URL,
        requestBody: { startDate, endDate, dimensions: ['query'], rowLimit: 15 },
      }),
      searchconsole.searchanalytics.query({
        siteUrl: SITE_URL,
        requestBody: { startDate, endDate, dimensions: ['page'], rowLimit: 15 },
      }),
      searchconsole.searchanalytics.query({
        siteUrl: SITE_URL,
        requestBody: { startDate, endDate, rowLimit: 1 },
      }),
    ]);

    const mapRows = (rows: Array<{ keys?: string[] | null; clicks?: number | null; impressions?: number | null; ctr?: number | null; position?: number | null }> | undefined | null) =>
      (rows ?? []).map((r) => ({
        key: r.keys?.[0] ?? '',
        clicks: r.clicks ?? 0,
        impressions: r.impressions ?? 0,
        ctr: Math.round((r.ctr ?? 0) * 1000) / 10,
        position: Math.round((r.position ?? 0) * 10) / 10,
      }));

    const total = totals.data.rows?.[0];
    return NextResponse.json({
      configured: true,
      startDate,
      endDate,
      totals: {
        clicks: total?.clicks ?? 0,
        impressions: total?.impressions ?? 0,
        ctr: Math.round((total?.ctr ?? 0) * 1000) / 10,
        position: Math.round((total?.position ?? 0) * 10) / 10,
      },
      queries: mapRows(byQuery.data.rows),
      pages: mapRows(byPage.data.rows).map((r) => ({ ...r, key: r.key.replace(SITE_URL.slice(0, -1), '') })),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Search Console query failed';
    console.error('GET /api/analytics/search-console error:', message);
    return NextResponse.json({ configured: true, error: message }, { status: 502 });
  }
}
