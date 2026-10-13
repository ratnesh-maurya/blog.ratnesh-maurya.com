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

Instead of locking rows to prevent concurrent access, MVCC creates a new version of a row on every update. Each transaction (or, at weaker isolation levels, each statement) reads from a snapshot: the set of transactions that had committed when the snapshot was taken. In PostgreSQL's default READ COMMITTED level, every statement takes a fresh snapshot; under REPEATABLE READ and SERIALIZABLE, one snapshot (taken at the transaction's first query) covers the whole transaction. Old versions are retained until no snapshot needs them.

In PostgreSQL, every row has hidden columns `xmin` (the transaction ID that created it) and `xmax` (the transaction ID that deleted or updated it). When Transaction 100 reads a row, it sees a version only if `xmin` belongs to a transaction that had committed when 100's snapshot was taken (or is 100 itself), and `xmax` is empty or belongs to a transaction that had not committed at that point (still running, started later, or aborted). Commit status at snapshot time decides visibility, not simply whether one ID is smaller than another. This means Transaction 100 never sees uncommitted changes from other transactions, and it sees a stable snapshot even if other transactions modify the same rows concurrently.

Writers create new row versions rather than overwriting. Transaction 200 updates a row by marking the old version's `xmax = 200` and inserting a new version with `xmin = 200`. Transaction 100, running concurrently, still sees the old version (its `xmax = 200` is ignored because 200 had not committed when 100's snapshot was taken).

Old versions accumulate and must be cleaned up. PostgreSQL's `VACUUM` process (usually run by autovacuum) removes dead row versions that are no longer visible to any active transaction. In MySQL InnoDB, the row is updated in place and old versions are rebuilt from the undo log; a purge thread discards undo records once no open read view needs them. In both cases, the oldest open transaction sets the limit: a single long-running transaction keeps every newer dead version alive.

MVCC removes reader-writer blocking, not writer-writer conflicts. Two transactions updating the same row still conflict: the second waits for the first to commit or roll back, and under REPEATABLE READ or SERIALIZABLE in PostgreSQL it then fails with a serialization error if the first committed.

## When to use it

- **Any OLTP database** — PostgreSQL, MySQL InnoDB, Oracle, and CockroachDB all use MVCC as their primary concurrency control. It's the default, not an opt-in feature.
- **Read-heavy workloads** — MVCC shines when many transactions read while few write. Readers never block writers, and writers never block readers.
- **Long-running analytical queries** — A reporting query can read a consistent snapshot of the data while OLTP transactions continue writing.
- **Snapshot isolation** — MVCC is the mechanism that implements snapshot isolation and repeatable read isolation levels. Snapshot isolation alone still allows write skew; PostgreSQL's SERIALIZABLE level adds checks on top of MVCC to prevent it.

## Trade-offs

**Gains:** Readers don't block writers. Writers don't block readers. Much higher concurrency than lock-based systems. Each transaction sees a consistent point-in-time view of the data.

**Costs:** Storage overhead from keeping multiple row versions. Dead rows (tuples) accumulate and require cleanup (VACUUM in PostgreSQL, purge in MySQL). Write-heavy workloads with frequent updates to the same rows generate significant dead tuple bloat. VACUUM can consume I/O and CPU, and if it falls behind, table bloat grows. Long-running or idle-in-transaction sessions block cleanup entirely. Writers still block writers on the same row. Snapshot isolation does not prevent write skew: two transactions can each read the same rows, write to different rows, and together break an invariant that neither broke alone.

## Example

```sql
-- Transaction A starts (REPEATABLE READ: one snapshot for the whole transaction)
BEGIN ISOLATION LEVEL REPEATABLE READ;
SELECT balance FROM accounts WHERE id = 1; -- snapshot taken here
-- Returns 1000 (the version committed as of A's snapshot)

-- Transaction B (concurrent) updates the same row
BEGIN;
UPDATE accounts SET balance = 800 WHERE id = 1;
COMMIT; -- creates new version with xmin = B's txid

-- Transaction A reads again — still sees 1000
SELECT balance FROM accounts WHERE id = 1;
-- Returns 1000 (B's version is invisible — committed after A's snapshot)
-- Under the default READ COMMITTED, this second read would return 800

COMMIT;
-- After both transactions complete, VACUUM can remove the old version
```

## Related terms

Snapshot isolation is the isolation level that MVCC enables — each transaction sees a frozen snapshot. Write skew is the anomaly snapshot isolation still allows. Optimistic locking applies a similar idea at the application level, checking a version number at write time instead of blocking. Compaction in LSM-trees serves a similar purpose to VACUUM — cleaning up old versions.
