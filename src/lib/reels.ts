import { supabase } from '@/lib/supabase/client';

export type ReelLink = { label: string; url: string };

export type Reel = {
  slug: string;
  title: string;
  description: string;
  reel_url: string;
  thumb_url: string | null;
  posted_at: string;
  links: ReelLink[];
};

export async function getAllReels(): Promise<Reel[]> {
  const { data, error } = await supabase
    .from('reels')
    .select('slug, title, description, reel_url, thumb_url, posted_at, links')
    .order('posted_at', { ascending: false });

  if (error) {
    console.error('getAllReels error:', error);
    return [];
  }
  return (data ?? []) as Reel[];
}

export async function getLatestReel(): Promise<Reel | null> {
  const { data, error } = await supabase
    .from('reels')
    .select('slug, title, description, reel_url, thumb_url, posted_at, links')
    .order('posted_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('getLatestReel error:', error);
    return null;
  }
  return (data as Reel) ?? null;
}

export function withUtm(url: string, slug: string): string {
  try {
    const u = new URL(url);
    if (!u.searchParams.has('utm_source')) {
      u.searchParams.set('utm_source', 'instagram');
      u.searchParams.set('utm_medium', 'bio');
      u.searchParams.set('utm_campaign', slug);
    }
    return u.toString();
  } catch {
    return url;
  }
}
