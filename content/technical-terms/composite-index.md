---
title: Composite Index
description: A composite index (multi-column index) indexes multiple columns together in a single B-tree, optimizing queries that filter or sort on the combined column set while following the leftmost prefix rule.
questions:
  - What is Composite Index?
  - When is Composite Index used?
  - What are the trade-offs of Composite Index?
---

## Definition

A composite index (also called a multi-column index) indexes two or more columns together in a single B-tree structure, enabling the database to efficiently satisfy queries that filter, sort, or group on those columns.

## How it works

A composite index on `(col_a, col_b, col_c)` creates a B-tree where keys are sorted first by `col_a`, then by `col_b` within each `col_a` value, then by `col_c` within each `(col_a, col_b)` pair. This is exactly like a phone book sorted by last name, then first name, then middle name.

The **leftmost prefix rule** determines which queries can use the index. A composite index on `(a, b, c)` can be used for queries that filter on: `a` alone, `(a, b)`, or `(a, b, c)`. It cannot efficiently be used for queries that filter only on `b` or `c` without `a`, because the B-tree is sorted by `a` first.

Column order matters. The most selective (highest cardinality) column should generally come first for equality lookups, while range-scanned columns should come last. If your query is `WHERE status = 'active' AND created_at > '2025-01-01'`, put `status` first (equality) and `created_at` second (range).

A **covering index** includes all columns a query needs in the index itself, so the database can answer the query from the index alone without reading the table (index-only scan). This is the fastest possible query path.

## When to use it

- **Multi-column WHERE clauses** — `WHERE department = 'eng' AND salary > 100000` benefits from `(department, salary)`.
- **Queries with ORDER BY matching the index** — `WHERE status = 'active' ORDER BY created_at DESC` uses `(status, created_at DESC)` to avoid a sort.
- **JOIN conditions** — `ON orders.customer_id = customers.id` combined with `WHERE orders.status = 'pending'` benefits from `(customer_id, status)` on the orders table.
- **Covering queries** — `SELECT email, name FROM users WHERE tenant_id = ?` with index `(tenant_id, email, name)` reads no table data at all.

## Trade-offs

**Gains:** Dramatically faster queries for multi-column filters and sorts. Covering indexes eliminate table reads entirely. One composite index can serve multiple query patterns (any leftmost prefix).

**Costs:** Each composite index adds write overhead — every INSERT, UPDATE, or DELETE must update the index. Wider indexes consume more disk and memory. Too many indexes slow writes and increase WAL volume. The leftmost prefix rule means you can't use the index for arbitrary column combinations.

## Example

```sql
-- Create a composite index for a common query pattern
CREATE INDEX idx_orders_customer_status ON orders (customer_id, status, created_at DESC);

-- This query uses all three columns of the index
SELECT id, total FROM orders
WHERE customer_id = 42 AND status = 'shipped'
ORDER BY created_at DESC
LIMIT 10;

-- This query uses the leftmost prefix (customer_id only)
SELECT count(*) FROM orders WHERE customer_id = 42;

-- This query CANNOT use the index efficiently (skips customer_id)
SELECT * FROM orders WHERE status = 'pending';
-- Needs a separate index on (status) or (status, created_at)
```

Check index usage with `EXPLAIN`:
```sql
EXPLAIN SELECT id FROM orders WHERE customer_id = 42 AND status = 'shipped';
-- Should show "Index Scan using idx_orders_customer_status"
```

## Related terms

Indexing covers B-tree and hash indexes at the single-column level. Covering index is a composite index that includes all columns needed by a query. Secondary indexes are non-primary indexes, and composite indexes are a type of secondary index.
