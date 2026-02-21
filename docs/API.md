# Blog Stats API — Specification for Go Backend

Generic API for **views** and **upvotes** across all page types (blog, til, silly-questions, technical-terms, now, etc.) using **type**, **slug**, and **metric** (view | upvote). The backend captures **IP address**, **timestamp**, and any other analytics data; the client only sends type, slug, and metric.

**Scope:** Views and upvotes only. Indexing/reindex is **not** part of this API (stays in the blog).

**Base URL (example):** `https://api.example.com` or `https://blog-api.ratnesh-maurya.com`  
The blog uses an env var (e.g. `NEXT_PUBLIC_API_BASE`) and calls `{base}/stats/...` instead of `/api/...`.

---

## Model

- **type** — Page/section. Examples: `blog`, `til`, `silly-questions`, `technical-terms`, `now`, `about`, or any string the blog uses for a page kind.
- **slug** — Page identifier within that type (e.g. post slug, term slug). No slash; single segment per type.
- **metric** — Either `view` or `upvote`.

**Backend-handled (do not require from client):**

- **Timestamp** — When the event occurred (server time when request is processed).
- **IP address** — From `X-Forwarded-For`, `X-Real-IP`, or request remote address.
- Any other analytics (user agent, etc.) is up to the backend.

---

## Data store (backend design)

Suggested: one collection (e.g. `stats` or `counts`) with documents like:

| Field       | Type     | Description |
|------------|----------|-------------|
| `type`     | string   | Page type (blog, til, silly-questions, technical-terms, now, …) |
| `slug`     | string   | Page slug within that type |
| `views`    | int64    | View count |
| `upvotes`  | int64    | Upvote count |
| `updatedAt`| datetime | Last update (views or upvotes) |

**Unique compound key:** `(type, slug)`.

Optional: a separate **events** (or **logs**) collection to store each increment with IP, timestamp, type, slug, metric for analytics/audit.

**Indexes:** `(type, slug)` unique; `type` for stats by type; `views`/`upvotes` if you aggregate.

---

## 1. Record event (increment) — POST /api/stats

Increment a view or upvote for a given type and slug. Backend records IP, timestamp, and increments the counter.

**Request**

- **Method:** `POST`
- **Path:** `/api/stats`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**

```json
{
  "type": "blog",
  "slug": "my-post-title",
  "metric": "view"
}
```

- **type** (string, required) — e.g. `blog`, `til`, `silly-questions`, `technical-terms`, `now`.
- **slug** (string, required) — page slug (no slashes).
- **metric** (string, required) — `"view"` or `"upvote"`.

**Response**

- **Status:** `200 OK`
- **Body (JSON):**

```json
{
  "type": "blog",
  "slug": "my-post-title",
  "metric": "view",
  "count": 43
}
```

`count` is the new value for that metric after increment.

- **400** — Missing or invalid `type`, `slug`, or `metric` (e.g. not `view` or `upvote`). Body e.g. `{ "error": "type, slug, and metric (view|upvote) are required" }`.
- **500** — Server error. Body e.g. `{ "error": "message" }`.

**Behaviour**

- Validate `type`, `slug`, `metric`. If `metric` is not `view` or `upvote`, return 400.
- Capture IP (from request) and server timestamp; store in events log if you have one.
- Upsert document by `(type, slug)`: increment `views` if `metric == "view"`, else increment `upvotes`. Set `updatedAt` to now.
- Return the new count for that metric.

---

## 2. Get count(s) — GET /api/stats

Get view and/or upvote count for one (type, slug). Optionally support getting both metrics in one call.

**Request**

- **Method:** `GET`
- **Path:** `/api/stats`
- **Query parameters:**
  - **type** (string, required) — e.g. `blog`, `til`, `silly-questions`, `technical-terms`.
  - **slug** (string, required) — page slug.
  - **metric** (string, optional) — `view` or `upvote`. If omitted, return both.

**Examples**

- `GET /api/stats?type=blog&slug=my-post&metric=view` — view count only.
- `GET /api/stats?type=blog&slug=my-post` — both views and upvotes.

**Response**

- **Status:** `200 OK`
- **Headers (suggested):**  
  `Cache-Control: public, s-maxage=30, stale-while-revalidate=120`
- **Body when metric=view:**  
  `{ "type": "blog", "slug": "my-post", "metric": "view", "count": 42 }`
- **Body when metric=upvote:**  
  `{ "type": "blog", "slug": "my-post", "metric": "upvote", "count": 7 }`
- **Body when metric omitted:**  
  `{ "type": "blog", "slug": "my-post", "views": 42, "upvotes": 7 }`

- **400** — Missing `type` or `slug`. Body e.g. `{ "error": "type and slug are required" }`.
- **500** — Server error.

**Behaviour**

- Find document by `(type, slug)`. If not found, return count(s) as 0.
- Return the requested metric(s).

---

## 3. Get stats by type (for listing pages) — GET /api/stats/by-type

Return views and upvotes for every slug of a given type (e.g. for blog listing, technical terms listing). One call per type.

**Request**

- **Method:** `GET`
- **Path:** `/api/stats/by-type`
- **Query parameters:**
  - **type** (string, required) — e.g. `blog`, `til`, `silly-questions`, `technical-terms`.

**Example**

- `GET /api/stats/by-type?type=blog`

**Response**

- **Status:** `200 OK`
- **Headers (suggested):**  
  `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`
- **Body (JSON):**

```json
{
  "type": "blog",
  "views": {
    "post-slug-1": 100,
    "post-slug-2": 200
  },
  "upvotes": {
    "post-slug-1": 5,
    "post-slug-2": 10
  }
}
```

Keys in `views` and `upvotes` are slugs (no type prefix). Slugs with no data may be omitted or present with 0.

- **400** — Missing `type`. Body e.g. `{ "error": "type is required" }`.
- **500** — Server error.

**Behaviour**

- Find all documents with `type` equal to the query `type`.
- Build two maps: `slug -> views`, `slug -> upvotes`. Return both.

---

## 4. Get totals — GET /api/stats/total

Total views (and optionally total upvotes) across all types and slugs.

**Request**

- **Method:** `GET`
- **Path:** `/api/stats/total`

**Response**

- **Status:** `200 OK`
- **Headers (suggested):**  
  `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`
- **Body (JSON):**

```json
{
  "totalViews": 12345,
  "totalUpvotes": 678
}
```

- **500** — Server error.

**Behaviour**

- Sum `views` and `upvotes` over all documents. Return both totals.

---

## Summary

| Method | Path                 | Purpose |
|--------|----------------------|--------|
| POST   | `/api/stats`         | Increment view or upvote (body: type, slug, metric). Backend captures IP, timestamp. |
| GET    | `/api/stats`         | Get count(s) for one (type, slug). Query: type, slug, optional metric. |
| GET    | `/api/stats/by-type` | Get views + upvotes for all slugs of one type. Query: type. |
| GET    | `/api/stats/total`   | Get totalViews and totalUpvotes across all types/slugs. |

---

## Type and slug: how the blog will call

The frontend will send the **type** and **slug** that identify each page. Examples:

| Page                | type              | slug example          |
|---------------------|-------------------|------------------------|
| Blog post           | `blog`            | `my-post-title`        |
| Silly question      | `silly-questions` | `css-not-working`      |
| Technical term      | `technical-terms` | `cap-theorem`          |
| TIL entry           | `til`             | `go-defer-loop-gotcha` |
| Static (e.g. /now)  | `now`             | `now` or empty         |

Slug is always the segment(s) that identify the page within that type (no leading type prefix in slug). Backend stores and returns counts keyed by `(type, slug)`.

---

## CORS and base URL

- Allow the blog origin in CORS (e.g. `https://blog.ratnesh-maurya.com`).
- Blog will call `{API_BASE}/stats`, `{API_BASE}/stats/by-type`, `{API_BASE}/stats/total` (e.g. `NEXT_PUBLIC_API_BASE`).

---

## Environment variables (Go service)

- Your store connection string (e.g. PostgreSQL/Supabase or other).
- No indexing/reindex env vars; that stays in the blog.
