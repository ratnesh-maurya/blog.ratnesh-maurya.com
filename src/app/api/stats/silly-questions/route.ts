import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const viewsCollection = db.collection('views');
    const upvotesCollection = db.collection('upvotes');

    // Query only silly-questions slugs using regex index
    const viewsDocs = await viewsCollection
      .find({ slug: /^silly-questions\// })
      .project({ slug: 1, views: 1 })
      .toArray();
    
    const viewsMap: Record<string, number> = {};
    viewsDocs.forEach(doc => {
      const slug = doc.slug.replace('silly-questions/', '');
      viewsMap[slug] = doc.views || 0;
    });

    // Query only silly-questions slugs using regex index
    const upvotesDocs = await upvotesCollection
      .find({ slug: /^silly-questions\// })
      .project({ slug: 1, upvotes: 1 })
      .toArray();
    
    const upvotesMap: Record<string, number> = {};
    upvotesDocs.forEach(doc => {
      const slug = doc.slug.replace('silly-questions/', '');
      upvotesMap[slug] = doc.upvotes || 0;
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
    console.error('Error fetching silly questions stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch silly questions stats' },
      { status: 500 }
    );
  }
}

