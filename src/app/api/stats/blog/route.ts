import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const viewsCollection = db.collection('views');
    const upvotesCollection = db.collection('upvotes');

    // Get all views
    const viewsDocs = await viewsCollection.find({}).toArray();
    const viewsMap: Record<string, number> = {};
    viewsDocs.forEach(doc => {
      viewsMap[doc.slug] = doc.views || 0;
    });

    // Get all upvotes
    const upvotesDocs = await upvotesCollection.find({}).toArray();
    const upvotesMap: Record<string, number> = {};
    upvotesDocs.forEach(doc => {
      upvotesMap[doc.slug] = doc.upvotes || 0;
    });

    return NextResponse.json({
      views: viewsMap,
      upvotes: upvotesMap,
    });
  } catch (error) {
    console.error('Error fetching blog stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog stats' },
      { status: 500 }
    );
  }
}

