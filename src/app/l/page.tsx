import { redirect } from 'next/navigation';
import { getLatestReel } from '@/lib/reels';

export const revalidate = 60;

export default async function ShortLinksPage() {
  const latest = await getLatestReel();
  redirect(latest ? `/links#${latest.slug}` : '/links');
}
