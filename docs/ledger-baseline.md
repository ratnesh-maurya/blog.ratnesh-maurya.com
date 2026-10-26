# Ledger migration baseline (taken on main @ 3b592ac, before Phase 1)

Screenshots live in `docs/ledger-baseline/` (gitignored). Headless Chrome, OS light scheme, placeholder Supabase env.

| Metric | Baseline |
|---|---|
| `grep -rE 'nb-\|glass-' src` lines | 650 |
| `.tsx` files containing a raw hex | 13 |
| `data-accent\|accent-color\|ColorAccent\|AccentColor` lines | 30 |
| Tailwind palette classes (`text-red-`, `text-white`, `bg-green-`, `gray`, `slate`, `zinc`…) lines | 98 |
| `src/app/globals.css` lines | 1799 |
