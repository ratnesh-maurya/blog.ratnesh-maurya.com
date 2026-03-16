---
title: Optimistic Locking
description: Optimistic locking allows concurrent transactions to proceed without acquiring locks, detecting conflicts at commit time using version numbers or timestamps and retrying on collision.
questions:
  - What is Optimistic Locking?
  - When is Optimistic Locking used?
  - What are the trade-offs of Optimistic Locking?
---

## Definition

Optimistic locking is a concurrency control strategy where transactions proceed without acquiring locks, checking for conflicts only at commit time by verifying that the data hasn't been modified since it was read.

## How it works

Each row has a version column (integer or timestamp). When a transaction reads a row, it notes the current version. When it writes the update, it includes the version in the WHERE clause: `UPDATE ... SET ..., version = version + 1 WHERE id = ? AND version = ?`. If the version has changed (another transaction modified the row), the UPDATE affects zero rows, and the application knows a conflict occurred.

The application then retries — re-reads the current data, re-applies its changes, and tries the update again. This is called optimistic because it assumes conflicts are rare and doesn't block other transactions while working.

ORMs implement this automatically. In JPA/Hibernate, annotating a field with `@Version` enables optimistic locking. Django uses `F()` expressions or explicit version fields. In raw SQL, you add the version check to your UPDATE statement.

## When to use it

- **Web applications with read-heavy workloads** — Most users browse; few update simultaneously. An e-commerce product page gets 10,000 reads per edit. Locking every read would destroy throughput.
- **CMS and collaborative editing** — Two editors updating different sections of a document. Conflicts are rare but must be detected.
- **Shopping cart updates** — A user modifies their cart from two tabs. Optimistic locking detects the stale state and re-applies.
- **API PUT/PATCH operations** — Include an ETag (entity version) in the response header; require `If-Match` on updates to prevent lost updates.

## Trade-offs

**Gains:** No lock contention — concurrent readers and writers don't block each other. Higher throughput than pessimistic locking when conflicts are rare. No risk of deadlocks since no locks are held.

**Costs:** If conflicts are frequent (hot rows, high write contention), transactions retry repeatedly, wasting CPU and potentially causing livelock. Retry logic adds application complexity. The application must handle the "conflict detected" case gracefully (re-read, re-compute, retry or report to the user).

## Example

```sql
-- Read with version
SELECT id, name, balance, version FROM accounts WHERE id = 42;
-- Returns: id=42, name='Alice', balance=1000, version=5

-- Update with version check
UPDATE accounts
SET balance = 900, version = 6
WHERE id = 42 AND version = 5;

-- If another transaction changed the row, version is now 6,
-- this UPDATE matches 0 rows → conflict detected → retry
```

In Go with `database/sql`:

```go
result, err := db.Exec(
    "UPDATE accounts SET balance = $1, version = version + 1 WHERE id = $2 AND version = $3",
    newBalance, accountID, currentVersion,
)
rowsAffected, _ := result.RowsAffected()
if rowsAffected == 0 {
    // Conflict: re-read and retry
}
```

## Related terms

Pessimistic locking takes the opposite approach — locking rows before reading them. Deadlock is a risk of pessimistic locking that optimistic locking avoids entirely. MVCC (Multi-Version Concurrency Control) is the database mechanism that enables snapshot reads without locking, which complements optimistic locking.
