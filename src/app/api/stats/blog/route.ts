import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const viewsCollection = db.collection('views');
    const upvotesCollection = db.collection('upvotes');

    // Use projection to only fetch slug and count fields, and filter out silly-questions
    const viewsDocs = await viewsCollection
      .find({ slug: { $not: { $regex: /^silly-questions\// } } })
      .project({ slug: 1, views: 1 })
      .toArray();
    
    const viewsMap: Record<string, number> = {};
    viewsDocs.forEach(doc => {
      viewsMap[doc.slug] = doc.views || 0;
    });

    // Use projection to only fetch slug and count fields, and filter out silly-questions
    const upvotesDocs = await upvotesCollection
      .find({ slug: { $not: { $regex: /^silly-questions\// } } })
      .project({ slug: 1, upvotes: 1 })
      .toArray();
    
    const upvotesMap: Record<string, number> = {};
    upvotesDocs.forEach(doc => {
      upvotesMap[doc.slug] = doc.upvotes || 0;
    });

    return NextResponse.json(
      {
        views: viewsMap,
        upvotes: upvotesMap,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching blog stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog stats' },
      { status: 500 }
    );
  }
}

