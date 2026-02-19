---
title: "PostgreSQL: JSONB is almost always better than JSON"
date: "2025-01-18"
category: "PostgreSQL"
tags: ["postgres", "json", "jsonb", "database"]
---

PostgreSQL has two JSON types: `json` and `jsonb`. Always use `jsonb` unless you have a specific reason not to.

| Feature | `json` | `jsonb` |
|---|---|---|
| Storage | Exact text copy | Binary, parsed |
| Indexing | Not indexable | GIN/GiST indexable |
| Operators | Limited | Full (`@>`, `?`, `#>`) |
| Insert speed | Faster | Slightly slower |
| Query speed | Slower | Much faster |

`json` preserves whitespace and key order; `jsonb` doesn't. That's the only time `json` wins.

```sql
-- Create a GIN index on a jsonb column for fast key lookups
CREATE INDEX idx_metadata ON posts USING GIN (metadata);

-- Query: find all rows where metadata contains a specific key-value
SELECT * FROM posts WHERE metadata @> '{"status": "published"}';
```
