import { Metadata } from 'next';
import { getAllReels } from '@/lib/reels';
import { LinksView } from './LinksView';

const SITE_URL = 'https://blog.ratnesh-maurya.com';

// Purged on demand by /api/admin/reels (revalidatePath), no timed re-render.
export const revalidate = false;

export const metadata: Metadata = {
  title: 'Links — Ratn Labs',
  description: 'Every link mentioned in @ratn_labs Instagram reels — blog posts, repos, and tools.',
  alternates: { canonical: `${SITE_URL}/links/` },
  openGraph: {
    title: 'Links — Ratn Labs',
    description: 'Every link mentioned in @ratn_labs Instagram reels.',
    url: `${SITE_URL}/links/`,
    siteName: 'Ratn Labs',
    type: 'website',
  },
  twitter: { card: 'summary', title: 'Links — Ratn Labs', creator: '@ratnesh_maurya' },
  robots: { index: true, follow: true },
};

export default async function LinksPage() {
  const reels = await getAllReels();
  return <LinksView reels={reels} />;
}
