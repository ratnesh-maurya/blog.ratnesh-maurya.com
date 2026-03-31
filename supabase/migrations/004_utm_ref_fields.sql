-- Add utm_content, utm_term, and ref columns to utm_hits.
-- Tracks ?utm_content=, ?utm_term=, and ?ref=peerlist style params.

alter table public.utm_hits
  add column if not exists utm_content text,
  add column if not exists utm_term    text,
  add column if not exists ref         text;

create index if not exists idx_utm_hits_ref
  on public.utm_hits (ref);

comment on column public.utm_hits.utm_content is 'UTM content param — e.g. ?utm_content=hero-cta';
comment on column public.utm_hits.utm_term    is 'UTM term param — e.g. ?utm_term=golang';
comment on column public.utm_hits.ref         is 'Referral source param — e.g. ?ref=peerlist';
