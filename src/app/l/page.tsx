import { redirect } from 'next/navigation';
import { getLatestReel } from '@/lib/reels';

// Purged on demand by /api/admin/reels (revalidatePath), no timed re-render.
export const revalidate = false;

export default async function ShortLinksPage() {
  const latest = await getLatestReel();
  redirect(latest ? `/links#${latest.slug}` : '/links');
}
