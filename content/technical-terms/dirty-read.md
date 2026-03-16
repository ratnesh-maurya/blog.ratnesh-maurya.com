---
title: Dirty Read
description: A dirty read occurs when a transaction reads data written by another transaction that has not yet committed, risking exposure to data that may be rolled back.
questions:
  - What is Dirty Read?
  - When is Dirty Read used?
  - What are the trade-offs of Dirty Read?
---

## Definition

A dirty read occurs when a transaction reads data written by another uncommitted transaction—if that transaction rolls back, the reader operated on data that never officially existed.

## How it works

Every database transaction goes through stages: begin, execute writes, then commit or abort. Between execution and commit, the written data is in a "dirty" state. Under the `READ UNCOMMITTED` isolation level, other transactions can see these dirty writes immediately.

Here's the timeline that causes trouble. Transaction T1 updates a row—say, sets a user's balance to $500. Transaction T2 reads that balance and uses it to approve a purchase. T1 then aborts, restoring the balance to $50. T2 approved a purchase based on a balance that was never real.

Most databases default to `READ COMMITTED` or higher, which prevents dirty reads by only exposing committed data to other transactions. PostgreSQL, for instance, treats `READ UNCOMMITTED` as equivalent to `READ COMMITTED`—it simply does not allow dirty reads at all. MySQL's InnoDB does support true `READ UNCOMMITTED`, but it's rarely used outside of specific diagnostic scenarios.

The mechanism that prevents dirty reads varies by engine. PostgreSQL uses MVCC (Multi-Version Concurrency Control): each transaction sees a snapshot of committed data. SQL Server uses shared locks on reads under `READ COMMITTED`, blocking until the writer commits or aborts.

## When to use it

Dirty reads are almost never desirable. The rare exceptions:

- **Monitoring dashboards**: A DBA running `SELECT count(*) FROM large_table` on a busy MySQL instance might use `READ UNCOMMITTED` to avoid taking locks, accepting approximate counts.
- **Long-running analytical queries**: On SQL Server, `WITH (NOLOCK)` hints avoid blocking behind heavy write transactions at the cost of reading uncommitted state.
- **Debugging**: Inspecting in-flight transactions during incident response.

In all these cases, the consumer understands and accepts that the data may be inconsistent.

## Trade-offs

**Gains**: Zero read-lock contention. Faster reads on write-heavy tables. No blocking behind long-running transactions.

**Costs**: Data integrity is gone. You can read values that will be rolled back, leading to incorrect calculations, broken invariants, and unreproducible bugs. Financial systems, inventory management, and anything requiring correctness must never allow dirty reads.

## Example

```sql
-- Session 1: begins a transfer but hasn't committed
BEGIN;
UPDATE accounts SET balance = balance - 200 WHERE id = 42;
-- balance is now $300 (was $500), but not committed

-- Session 2: reads with READ UNCOMMITTED
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SELECT balance FROM accounts WHERE id = 42;
-- Returns $300 — the dirty value

-- Session 1: aborts
ROLLBACK;
-- The real balance is still $500
-- Session 2's $300 was a dirty read
```

## Related terms

Dirty reads are the least severe isolation anomaly. Read skew and phantom reads are related anomalies that occur at higher isolation levels and involve different failure modes around consistency.
