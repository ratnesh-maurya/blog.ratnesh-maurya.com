import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const viewsCollection = db.collection('views');
    const upvotesCollection = db.collection('upvotes');

    // Get all views for silly questions (slug format: silly-questions/[slug])
    const viewsDocs = await viewsCollection.find({}).toArray();
    const viewsMap: Record<string, number> = {};
    viewsDocs.forEach(doc => {
      if (doc.slug.startsWith('silly-questions/')) {
        const slug = doc.slug.replace('silly-questions/', '');
        viewsMap[slug] = doc.views || 0;
      }
    });

    // Get all upvotes for silly questions
    const upvotesDocs = await upvotesCollection.find({}).toArray();
    const upvotesMap: Record<string, number> = {};
    upvotesDocs.forEach(doc => {
      if (doc.slug.startsWith('silly-questions/')) {
        const slug = doc.slug.replace('silly-questions/', '');
        upvotesMap[slug] = doc.upvotes || 0;
      }
    });

    return NextResponse.json({
      views: viewsMap,
      upvotes: upvotesMap,
    });
  } catch (error) {
    console.error('Error fetching silly questions stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch silly questions stats' },
      { status: 500 }
    );
  }
}

