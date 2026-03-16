---
title: Phantom Read
description: A phantom read occurs when a transaction re-executes a query with a range condition and gets a different set of rows because another transaction inserted or deleted matching rows in between.
questions:
  - What is Phantom Read?
  - When is Phantom Read used?
  - What are the trade-offs of Phantom Read?
---

## Definition

A phantom read occurs when a transaction executes a range query twice and gets different row sets because another committed transaction inserted or deleted rows matching the query's condition between the two executions.

## How it works

Phantom reads are specific to range queries—`WHERE dept = 'Sales'` or `WHERE price BETWEEN 10 AND 50`. The first execution returns a set of rows. A concurrent transaction then inserts a new row that matches the condition and commits. The second execution of the same query returns an additional row: the "phantom."

This differs from read skew, which involves reading inconsistent individual values. Phantom reads involve the set membership changing—rows appearing or disappearing.

The `REPEATABLE READ` isolation level in the SQL standard prevents non-repeatable reads (re-reading the same row gives the same value) but does not prevent phantoms. A new row can still appear because `REPEATABLE READ` locks or snapshots existing rows, not the gaps between them.

The `SERIALIZABLE` isolation level prevents phantoms. The implementation varies by database. PostgreSQL's Serializable Snapshot Isolation (SSI) detects dangerous patterns of read/write dependencies and aborts one of the conflicting transactions. InnoDB (MySQL) uses **gap locks** and **next-key locks** at `REPEATABLE READ` and above: it locks not just existing rows but the gaps between index entries, physically preventing inserts into the locked range.

The distinction matters: PostgreSQL at `REPEATABLE READ` actually prevents phantoms through MVCC snapshots (the transaction simply doesn't see rows committed after its snapshot started). MySQL at `REPEATABLE READ` prevents phantoms for locking reads (`SELECT ... FOR UPDATE`) via gap locks, but not for plain `SELECT` (which uses snapshot reads). Each engine's behavior is subtly different from the SQL standard's definitions.

## When to use it

Phantom reads matter in scenarios where set-level consistency is critical:

- **Booking systems**: A query checks "are any rooms available for March 15?" and gets 3 rooms. Between the check and the booking, another transaction books one of those rooms. The second query sees only 2—or a different set entirely.
- **Constraint enforcement in application logic**: Checking "does a user with this email exist?" before inserting. Without phantom protection, two concurrent transactions could both see "no" and both insert, creating a duplicate. (A unique constraint is the proper fix here, but the phantom is the underlying concurrency issue.)
- **Reporting with aggregates**: A report counting employees per department that runs two queries: total headcount and per-department breakdown. Phantoms can cause the totals to disagree.
- **Financial reconciliation**: Summing all transactions for a period, then listing them. A new transaction committed between the sum and the listing makes the numbers mismatch.

## Trade-offs

**Gains of preventing phantoms (SERIALIZABLE)**: Complete isolation. Transactions behave as if they ran sequentially. No application-level workarounds needed for set-level consistency.

**Costs**: Performance impact. Gap locks (MySQL) reduce concurrency on range operations—inserts into a locked range block until the lock-holder commits. SSI (PostgreSQL) allows more concurrency but aborts transactions that would violate serializability, requiring retry logic. Throughput can drop 10–30% compared to `REPEATABLE READ` under contention on the same ranges.

## Example

```sql
-- Transaction T1
BEGIN;
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
SELECT count(*) FROM employees WHERE dept = 'Sales';  -- returns 10

-- Transaction T2 (concurrent)
INSERT INTO employees (name, dept) VALUES ('Alice', 'Sales');
COMMIT;

-- Back in T1
SELECT count(*) FROM employees WHERE dept = 'Sales';  -- returns 11
-- The extra row is a phantom
COMMIT;

-- Prevention with SERIALIZABLE
BEGIN;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
SELECT count(*) FROM employees WHERE dept = 'Sales';  -- returns 10
-- T2's insert either blocks (MySQL gap lock) or
-- T1 sees snapshot (PostgreSQL SSI) — no phantom
SELECT count(*) FROM employees WHERE dept = 'Sales';  -- still returns 10
COMMIT;
```

## Related terms

Phantom reads sit at the top of the isolation anomaly hierarchy, above dirty reads (uncommitted data) and read skew (inconsistent snapshots of existing data). Understanding all three is necessary to choose the right isolation level for a given workload.
