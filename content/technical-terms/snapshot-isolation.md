---
title: Snapshot Isolation
description: Snapshot isolation is a transaction isolation level where each transaction operates on a snapshot of the database as of the start of the transaction.…
questions:
  - What is Snapshot Isolation?
  - When is Snapshot Isolation used?
  - What are the trade-offs of Snapshot Isolation?
---

## Definition

Snapshot isolation is a transaction isolation level where each transaction operates on a snapshot of the database as of the start of the transaction[[\[21\]](https://en.wikipedia.org/wiki/Snapshot_isolation "Snapshot isolation - Wikipedia")](https://en.wikipedia.org/wiki/Snapshot_isolation "Snapshot isolation - Wikipedia"). Transactions see a consistent view of data that doesn’t change during the transaction. A transaction under snapshot isolation can commit only if its writes don’t conflict with concurrent writes.

## Core concept

Readers don’t block writers and vice versa. Each transaction sees the last committed state at its start time. Writes use versioning: on commit, if two transactions have modified the same row, one will abort (to prevent write-write conflict). This avoids many deadlocks of stricter locks.

## Use cases

Common in modern databases (PostgreSQL’s default), providing high concurrency. Good for read-heavy workloads where you want consistency within a transaction but still allow concurrent updates.

## Trade-offs

Snapshot isolation is not fully serializable. It can still exhibit write skew anomalies. It provides a strong, but not strict, guarantee. It uses more storage (versions) to support multi-version concurrency (see MVCC).

## Example

Two transactions T1 and T2 both read a row and try to update it. Under snapshot, whichever commits first will succeed; the second will abort because its write would conflict.

## References

“Snapshot isolation… all reads in a transaction see a consistent snapshot of the DB (values at start), and a transaction commits only if no updates conflict with concurrent writes”[[\[21\]](https://en.wikipedia.org/wiki/Snapshot_isolation "Snapshot isolation - Wikipedia")](https://en.wikipedia.org/wiki/Snapshot_isolation "Snapshot isolation - Wikipedia").
