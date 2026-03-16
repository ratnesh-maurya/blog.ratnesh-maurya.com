---
title: Deadlock
description: A deadlock occurs when two or more transactions permanently block each other, each holding a lock the other needs, creating a circular dependency that can only be resolved by aborting one transaction.
questions:
  - What is Deadlock?
  - When does Deadlock occur?
  - What are the trade-offs of Deadlock prevention?
---

## Definition

A deadlock occurs when two or more transactions block each other indefinitely, each holding a resource (lock) that the other needs to proceed, forming a circular wait.

## How it works

Deadlocks require four conditions simultaneously (Coffman conditions): **mutual exclusion** (resources can't be shared), **hold and wait** (a transaction holds one lock while waiting for another), **no preemption** (locks can't be forcibly taken), and **circular wait** (A waits for B, B waits for A).

In a database, the classic scenario: Transaction T1 locks row X and then tries to lock row Y. Concurrently, Transaction T2 locks row Y and tries to lock row X. Both transactions wait for each other forever — neither can proceed.

Databases detect deadlocks using a **waits-for graph**. Each transaction is a node; an edge from T1 to T2 means T1 is waiting for a lock held by T2. If the graph contains a cycle, a deadlock exists. The database engine selects a **victim** transaction (usually the one that has done the least work) and aborts it, releasing its locks so the other transaction can proceed.

PostgreSQL checks for deadlocks every `deadlock_timeout` (default 1 second). MySQL InnoDB detects deadlocks immediately when a wait-for cycle forms. The victim transaction receives a deadlock error and must be retried by the application.

## When to use it

Deadlocks are a failure mode, not a design choice. They matter when:

- **Multiple transactions update the same set of rows in different orders** — a transfer between accounts A and B, while another transfer goes from B to A.
- **Long-running transactions** hold locks for extended periods, increasing the window for circular waits.
- **Bulk operations** lock many rows, increasing the chance of overlapping with other transactions.
- **Application code acquires locks in non-deterministic order** — the most common root cause.

## Trade-offs

**Prevention strategies have costs:**

- **Lock ordering** (always lock rows in a consistent order, e.g., by primary key) eliminates deadlocks but requires discipline across all code paths.
- **Lock timeouts** abort a transaction if it waits too long for a lock, but can cause unnecessary aborts under high contention.
- **Optimistic locking** (version checks instead of row locks) avoids deadlocks entirely but shifts the cost to retry logic.
- **Reducing transaction scope** (smaller transactions that lock fewer rows for less time) lowers deadlock probability but may require rethinking application logic.

## Example

```sql
-- Session 1
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;  -- locks row 1
-- ... waits ...
UPDATE accounts SET balance = balance + 100 WHERE id = 2;  -- wants row 2 → BLOCKED

-- Session 2 (concurrent)
BEGIN;
UPDATE accounts SET balance = balance - 50 WHERE id = 2;   -- locks row 2
-- ... waits ...
UPDATE accounts SET balance = balance + 50 WHERE id = 1;   -- wants row 1 → DEADLOCK

-- PostgreSQL detects the cycle and aborts one session:
-- ERROR: deadlock detected
-- DETAIL: Process 1234 waits for ShareLock on transaction 5678;
--         blocked by process 5678.
--         Process 5678 waits for ShareLock on transaction 1234;
--         blocked by process 1234.
```

Fix: always lock accounts in ascending ID order:
```sql
-- Both sessions lock id=1 first, then id=2 — no cycle possible
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
```

## Related terms

Pessimistic locking acquires locks upfront, which can cause deadlocks if lock ordering isn't enforced. Optimistic locking avoids deadlocks by not holding locks at all. Lock escalation can increase deadlock risk by upgrading row locks to table locks.
