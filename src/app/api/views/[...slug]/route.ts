import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params;
    // Join array of slug segments and remove trailing slash if present
    const slugString = (Array.isArray(slug) ? slug.join('/') : slug).replace(/\/$/, '');
    const db = await getDatabase();
    const viewsCollection = db.collection('views');

    const viewDoc = await viewsCollection.findOne({ slug: slugString });

    return NextResponse.json({
      slug: slugString,
      views: viewDoc?.views || 0,
    });
  } catch (error) {
    console.error('Error fetching views:', error);
    return NextResponse.json(
      { error: 'Failed to fetch views' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params;
    // Join array of slug segments and remove trailing slash if present
    const slugString = (Array.isArray(slug) ? slug.join('/') : slug).replace(/\/$/, '');
    const db = await getDatabase();
    const viewsCollection = db.collection('views');

    // Increment view count (upsert if doesn't exist)
    const result = await viewsCollection.findOneAndUpdate(
      { slug: slugString },
      {
        $inc: { views: 1 },
        $setOnInsert: { slug: slugString, createdAt: new Date() },
      },
      {
        upsert: true,
        returnDocument: 'after',
      }
    );

    return NextResponse.json({
      slug: slugString,
      views: result?.value?.views || 1,
    });
  } catch (error) {
    console.error('Error incrementing views:', error);
    return NextResponse.json(
      { error: 'Failed to increment views' },
      { status: 500 }
    );
  }
}

