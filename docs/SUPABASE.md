# Supabase setup for views, upvotes, and reports

Views, upvotes, and reports are stored in Supabase (PostgreSQL) and used from the client only (no API). See [Supabase Next.js quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs).

## 1. Environment variables

In `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL` — Project URL from Supabase dashboard → Settings → API.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` — Publishable/anon key (client-safe).

## 2. Create the table and RPC

In Supabase **SQL Editor** → New query → paste and run the contents of:

**supabase/migrations/001_stats_and_events.sql**

This creates `stats` (type, slug, views, upvotes, reports), `stats_events` (one row per view/upvote/report for analytics), and the `increment_stat(type, slug, metric)` RPC. All increments run from the client via the RPC; no API route is used.

## 3. App behaviour

- **Blog** and **silly-questions** listing pages load stats from Supabase by type (`blog` / `silly-questions`).
- Individual post pages call `increment_stat(..., 'view')` from the client when the page is viewed, and use the same RPC for upvotes (and optionally `'report'`).
- **Total views** in the footer comes from Supabase (sum of `stats.views`). Use `getTotalReports()` from `@/lib/supabase/stats` if you want to show total reports (e.g. in an admin view).
- **stats_events** stores one row per view/upvote/report (event_type, type, slug, created_at) for analytics; no IP or user identifier. Query it in Supabase (e.g. by type/slug or time range) for "how many views/reports are coming in."

**Why two calls in dev?** React Strict Mode (Next.js dev) double-mounts components, so effects run twice. ViewIncrementer uses sessionStorage so we only count one view per (type, slug) per tab, which also avoids double-count on remount.

**Can counts be gamed?** Yes. The Supabase anon key is in the client bundle, so anyone can call `increment_stat` (or the REST API) and inflate numbers. Counts are best-effort. To harden: add a server API that reads IP, rate-limits, then calls Supabase with the service role; or use Supabase Edge Functions with rate limiting.
