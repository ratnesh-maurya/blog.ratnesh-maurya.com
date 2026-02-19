import { google } from 'googleapis';

function createJWTClient() {
  if (!process.env.GOOGLE_INDEXING_CLIENT_EMAIL || !process.env.GOOGLE_INDEXING_PRIVATE_KEY) {
    return null;
  }

  return new google.auth.JWT({
    email: process.env.GOOGLE_INDEXING_CLIENT_EMAIL,
    key: process.env.GOOGLE_INDEXING_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });
}

export async function requestIndexing(url: string): Promise<{ success: boolean; error?: string }> {
  try {
    const jwtClient = createJWTClient();
    if (!jwtClient) {
      console.warn('Google Indexing API credentials not configured. Skipping indexing request.');
      return { success: false, error: 'Credentials not configured' };
    }

    await jwtClient.authorize();
    await google.indexing('v3').urlNotifications.publish({
      auth: jwtClient,
      requestBody: {
        url: url,
        type: 'URL_UPDATED',
      },
    });
    console.log(`✓ Indexing requested for: ${url}`);
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`✗ Indexing Error for ${url}:`, errorMessage);
    return { success: false, error: errorMessage };
  }
}

export async function requestIndexingBatch(urls: string[]): Promise<{ success: number; failed: number; errors: string[] }> {
  const results = await Promise.allSettled(
    urls.map(url => requestIndexing(url))
  );

  let success = 0;
  let failed = 0;
  const errors: string[] = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value.success) {
      success++;
    } else {
      failed++;
      const errorMsg = result.status === 'rejected' 
        ? result.reason?.message || 'Unknown error'
        : result.value.error || 'Unknown error';
      errors.push(`${urls[index]}: ${errorMsg}`);
    }
  });

  return { success, failed, errors };
}
