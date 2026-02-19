import { requestIndexing } from '@/lib/googleIndexing';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url, secret } = await request.json();

    // Security: Prevent random people from spamming your API
    if (secret !== process.env.GOOGLE_INDEXING_SECRET_TOKEN) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { message: 'URL is required' },
        { status: 400 }
      );
    }

    const result = await requestIndexing(url);

    if (result.success) {
      return NextResponse.json({
        message: 'Indexing request sent successfully',
        url: url,
      });
    } else {
      return NextResponse.json(
        {
          message: 'Indexing request failed',
          error: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Reindex API error:', error);
    return NextResponse.json(
      {
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
