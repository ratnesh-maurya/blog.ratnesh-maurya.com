-- Reels: Instagram bio link page entries. One row per reel/post with related links.
create table if not exists public.reels (
  slug text primary key,
  title text not null,
  description text not null default '',
  reel_url text not null,
  thumb_url text,
  posted_at date not null default current_date,
  links jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.reels enable row level security;

-- Public read so /links page can SSG/ISR with anon key.
create policy "Public read reels"
  on public.reels for select
  to anon, authenticated
  using (true);

-- No public insert/update/delete. Admin uses service role (bypasses RLS).

create index if not exists idx_reels_posted_at
  on public.reels (posted_at desc);

-- Auto-bump updated_at on update.
create or replace function public.reels_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_reels_updated_at on public.reels;
create trigger trg_reels_updated_at
  before update on public.reels
  for each row execute function public.reels_set_updated_at();

comment on table public.reels is 'Instagram reels/posts with related links shown on /links page.';

-- Seed initial entries.
insert into public.reels (slug, title, description, reel_url, posted_at, links) values
  (
    'cursor-claude-personas',
    'cursor-claude-personas: Give Your AI Coding Assistant a Domain Expert Brain in 30 Seconds',
    'A free, open-source collection of 38 role-based AI persona packs for Claude Code, Cursor, and VS Code. Drop one folder into your project and your AI assistant instantly behaves like a seasoned specialist.',
    'https://www.instagram.com/reel/DXthQ6vEfoQ/',
    '2026-04-25',
    '[
      {"label": "Blog post", "url": "https://blog.ratnesh-maurya.com/blog/cursor-claude-personas-give-your-ai-coding-assistant-a-domain-expert-brain-in-30-seconds"},
      {"label": "GitHub repo", "url": "https://github.com/ratnesh-maurya/cursor-claude-personas"}
    ]'::jsonb
  ),
  (
    'caching-strategies',
    'Five Caching Strategies Every Backend Dev Should Know',
    'A beginner-friendly guide to Cache-Aside, Read-Through, Write-Through, Write-Back, and Write-Around — with when to use each.',
    'https://www.instagram.com/p/DXqsZxTkfOm/',
    '2026-04-22',
    '[
      {"label": "Blog post", "url": "https://blog.ratnesh-maurya.com/blog/Distributed-Caching-Strategies-Architecture/"}
    ]'::jsonb
  )
on conflict (slug) do nothing;
