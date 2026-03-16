---
title: MVCC (Multi-Version Concurrency Control)
description: MVCC allows multiple transactions to read and write data concurrently without blocking each other, by maintaining multiple versions of each row and giving each transaction a consistent snapshot.
questions:
  - What is MVCC (Multi-Version Concurrency Control)?
  - When is MVCC (Multi-Version Concurrency Control) used?
  - What are the trade-offs of MVCC (Multi-Version Concurrency Control)?
---

## Definition

MVCC (Multi-Version Concurrency Control) is a concurrency control method where the database keeps multiple versions of each row, allowing readers to see a consistent snapshot without blocking writers, and writers to proceed without blocking readers.

## How it works

Instead of locking rows to prevent concurrent access, MVCC creates a new version of a row on every update. Each transaction sees a consistent snapshot of the database — the state as of the transaction's start time. Old versions are retained until no transaction needs them.

In PostgreSQL, every row has hidden columns `xmin` (the transaction ID that created it) and `xmax` (the transaction ID that deleted or updated it). When Transaction 100 reads a row, it only sees versions where `xmin` is committed and less than 100, and `xmax` is either null or greater than 100. This means Transaction 100 never sees uncommitted changes from other transactions, and it sees a stable snapshot even if other transactions modify the same rows concurrently.

Writers create new row versions rather than overwriting. Transaction 200 updates a row by marking the old version's `xmax = 200` and inserting a new version with `xmin = 200`. Transaction 100, running concurrently, still sees the old version (its `xmax = 200` is invisible because 200 hasn't committed yet from 100's perspective).

Old versions accumulate and must be cleaned up. PostgreSQL's `VACUUM` process removes dead row versions that are no longer visible to any active transaction. In MySQL InnoDB, the undo log stores old versions and purges them after all referencing transactions complete.

## When to use it

- **Any OLTP database** — PostgreSQL, MySQL InnoDB, Oracle, and CockroachDB all use MVCC as their primary concurrency control. It's the default, not an opt-in feature.
- **Read-heavy workloads** — MVCC shines when many transactions read while few write. Readers never block writers, and writers never block readers.
- **Long-running analytical queries** — A reporting query can read a consistent snapshot of the data while OLTP transactions continue writing.
- **Snapshot isolation** — MVCC is the mechanism that implements snapshot isolation and repeatable read isolation levels.

## Trade-offs

**Gains:** Readers don't block writers. Writers don't block readers. Much higher concurrency than lock-based systems. Each transaction sees a consistent point-in-time view of the data.

**Costs:** Storage overhead from keeping multiple row versions. Dead rows (tuples) accumulate and require cleanup (VACUUM in PostgreSQL, purge in MySQL). Write-heavy workloads with frequent updates to the same rows generate significant dead tuple bloat. VACUUM can consume I/O and CPU, and if it falls behind, table bloat grows.

## Example

```sql
-- Transaction A starts
BEGIN; -- snapshot at this point
SELECT balance FROM accounts WHERE id = 1;
-- Returns 1000 (sees version with xmin < A's txid)

-- Transaction B (concurrent) updates the same row
BEGIN;
UPDATE accounts SET balance = 800 WHERE id = 1;
COMMIT; -- creates new version with xmin = B's txid

-- Transaction A reads again — still sees 1000
SELECT balance FROM accounts WHERE id = 1;
-- Returns 1000 (B's version is invisible — committed after A's snapshot)

COMMIT;
-- After both transactions complete, VACUUM can remove the old version
```

## Related terms

Snapshot isolation is the isolation level that MVCC enables — each transaction sees a frozen snapshot. Optimistic locking uses MVCC snapshots to detect conflicts at commit time. Compaction in LSM-trees serves a similar purpose to VACUUM — cleaning up old versions.
