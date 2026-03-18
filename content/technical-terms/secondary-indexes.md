---
title: Secondary Indexes
description: A secondary index is any index on a table column that is not the primary key. It is stored separately from the table rows.
questions:
  - What is Secondary Indexes?
  - When is Secondary Indexes used?
  - What are the trade-offs of Secondary Indexes?
---

## Definition

A **secondary index** is an index built on a column (or set of columns) that is **not** the table’s primary key. It’s an additional lookup structure that helps the database find rows quickly without scanning the whole table.

## How it works (clustered vs non-clustered)

The exact mechanics depend on the storage engine:

- **Clustered primary key (common in InnoDB / many LSM-backed engines)**: the primary key defines the physical (or logical) ordering of rows. A secondary index typically stores:
  - the indexed key (e.g., `email`)
  - a pointer to the row, often implemented as the **primary key value** (e.g., `id`)

So a lookup on `email` becomes a two-step plan:
1) Traverse the secondary index to find matching primary keys  
2) Fetch the corresponding rows via the primary key (sometimes called a **bookmark lookup** / “back to table”)

- **Heap table + nonclustered indexes (common in some engines)**: the secondary index may point to a row location (RID/page+slot). Updates that move rows can turn those pointers into extra maintenance work.

## Use cases

Secondary indexes are used when you filter, sort, or join on columns that are not the primary key:

- **Point lookups**: `SELECT * FROM users WHERE email = ?`
- **Range queries**: `WHERE created_at >= ? AND created_at < ?`
- **Sorting**: `ORDER BY last_seen_at DESC LIMIT 50` (when the index matches the order)
- **Joins**: `orders(user_id)` index to speed `JOIN users ON orders.user_id = users.id`

They’re also the building block for patterns like:

- **Unique constraints** on non-PK columns (unique index on `email`)
- **Composite indexes** (`(org_id, created_at)`), especially for “filter then sort” queries
- **Covering indexes** (when the index contains all columns needed by the query, avoiding row fetches)

## Trade-offs (what you pay for)

Secondary indexes are not free:

- **Write amplification**: every `INSERT`, `DELETE`, and any `UPDATE` that touches an indexed column must also update each affected index.
- **Extra storage**: indexes can be comparable in size to the table, especially with wide keys or many indexes.
- **Slower bulk loads**: adding many indexes before ingest can make writes much slower; a common pattern is “load first, index later.”
- **Planner complexity**: the query planner must choose between indexes; a “wrong” choice can still happen, especially with skewed data or stale stats.
- **Hot spots**: an index on a monotonically increasing key (e.g., `created_at` without sharding/partitioning considerations) can concentrate writes.

The core tension is simple: **secondary indexes trade write cost + storage for read speed.**

## Example

Create a secondary index for fast lookup by email:

```sql
CREATE INDEX idx_users_email ON users(email);

SELECT id, name FROM users WHERE email = 'a@b.com';
```

Composite index that supports “filter then sort”:

```sql
CREATE INDEX idx_posts_author_created ON posts(author_id, created_at DESC);

SELECT id, title
FROM posts
WHERE author_id = 42
ORDER BY created_at DESC
LIMIT 20;
```

## Practical guidance

- **Index the access patterns you actually have**: start from the slow query log, not from intuition.
- **Prefer selective columns** (many distinct values) for filters; low-cardinality columns often don’t help.
- **Limit “index sprawl”**: many overlapping indexes increase maintenance without improving plans.
- **Watch for “back to table” reads**: if the query touches many rows, a secondary index can be slower than a sequential scan; sometimes a covering index or different query shape is better.

## References

- PlanetScale (MySQL indexes): https://planetscale.com/learn/courses/mysql-for-developers/indexes/covering-indexes
