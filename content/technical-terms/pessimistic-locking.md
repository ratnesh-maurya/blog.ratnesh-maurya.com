---
title: Pessimistic Locking
description: Pessimistic locking acquires exclusive locks on data before accessing it, preventing concurrent modifications by blocking other transactions until the lock is released.
questions:
  - What is Pessimistic Locking?
  - When is Pessimistic Locking used?
  - What are the trade-offs of Pessimistic Locking?
---

## Definition

Pessimistic locking acquires exclusive locks on data rows before reading or writing them, preventing other transactions from modifying the same data until the lock is released at commit or rollback.

## How it works

When a transaction needs to read data that it may later update, it acquires a lock immediately using `SELECT ... FOR UPDATE` (or `FOR SHARE` for read-only locks). The database places a row-level exclusive lock on the selected rows. Any other transaction attempting to read-for-update or write those same rows is blocked until the first transaction completes.

The lock is held for the entire duration of the transaction — from the SELECT to the COMMIT or ROLLBACK. This guarantees that no other transaction can change the locked rows in between, eliminating race conditions. The downside is that blocked transactions must wait, reducing throughput under high contention.

Databases implement this with lock managers that track which rows are locked by which transaction. If two transactions try to lock each other's rows in opposite order, a deadlock occurs. Most databases detect deadlocks automatically (via a waits-for graph) and abort one transaction to break the cycle.

## When to use it

- **Financial transactions** — Transferring money between accounts: lock both accounts, check balances, perform the transfer, commit. Retrying on conflict (as with optimistic locking) is more expensive than waiting.
- **Inventory management** — Decrementing stock for an order: lock the inventory row, check quantity, decrement, commit. Prevents overselling.
- **Seat booking** — Lock the seat row, check availability, mark as booked. Prevents double-booking.
- **Any scenario with high write contention** on the same rows — pessimistic locking avoids the repeated retry loops that optimistic locking would cause.

## Trade-offs

**Gains:** Guarantees no conflicts — once you acquire the lock, you know no one else can modify the data. Eliminates retry logic. Simple mental model.

**Costs:** Reduced concurrency — other transactions block while waiting for locks. Risk of deadlocks when multiple transactions lock rows in different orders. Long-running transactions hold locks longer, amplifying contention. Not suitable for distributed systems where network partitions can cause locks to be held indefinitely.

## Example

```sql
-- Transaction 1: Transfer $100 from account A to account B
BEGIN;
SELECT balance FROM accounts WHERE id = 'A' FOR UPDATE;
-- Returns 500. Row is now locked.
SELECT balance FROM accounts WHERE id = 'B' FOR UPDATE;
-- Returns 200. Row is now locked.

UPDATE accounts SET balance = balance - 100 WHERE id = 'A';
UPDATE accounts SET balance = balance + 100 WHERE id = 'B';
COMMIT;
-- Both locks released.

-- Transaction 2 (concurrent): also tries to debit account A
BEGIN;
SELECT balance FROM accounts WHERE id = 'A' FOR UPDATE;
-- BLOCKS here until Transaction 1 commits
-- Then sees balance = 400 (post-debit), proceeds safely
```

## Related terms

Optimistic locking takes the opposite approach — no locks, detect conflicts at commit time using version numbers. Deadlock is the main risk of pessimistic locking when lock ordering isn't enforced. Write skew is an anomaly that pessimistic locking can prevent by locking the rows involved in the invariant check.
