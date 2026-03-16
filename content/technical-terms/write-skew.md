---
title: Write Skew
description: Write skew is a concurrency anomaly where two transactions read overlapping data, then write to non-overlapping rows, producing a state that violates an application invariant neither transaction broke individually.
questions:
  - What is Write Skew?
  - When does Write Skew occur?
  - What are the trade-offs of preventing Write Skew?
---

## Definition

Write skew is a concurrency anomaly where two transactions each read overlapping data and then write to different rows, producing an overall state that violates a business invariant — even though neither transaction's writes conflict at the row level.

## How it works

Write skew happens under snapshot isolation (the default in PostgreSQL's REPEATABLE READ). Each transaction sees a consistent snapshot of the database at the start. Both transactions read the same set of rows, make decisions based on what they read, and then write to different rows. Because the writes touch different rows, no write-write conflict is detected, and both transactions commit.

The classic example: a hospital requires at least one doctor on call at all times. Two doctors, Alice and Bob, are both on call. Each checks the on-call table, sees the other is on call, and marks themselves as off duty. Both transactions commit. Now no doctor is on call — a violated invariant.

This can't happen under serializable isolation, which detects the read-write dependency cycle and aborts one transaction. It also can't happen with pessimistic locking (SELECT ... FOR UPDATE on the rows being checked), because the second transaction would block until the first commits.

## When to use it

Write skew prevention matters when:

- **Invariants span multiple rows** — "at least one doctor on call," "total allocated budget doesn't exceed limit," "no double-booking of a meeting room"
- **Snapshot isolation is your default** — PostgreSQL, CockroachDB (in some modes), and Oracle use snapshot isolation where write skew is possible
- **High-value correctness** — financial systems, inventory management, scheduling systems where silent invariant violations cause real damage

## Trade-offs

**Preventing write skew** requires either serializable isolation (higher abort rate, lower throughput) or explicit locking on the rows you read (reduces concurrency on those rows). Both add contention.

**Allowing write skew** gives better throughput and fewer aborts, but your application must tolerate or detect the resulting inconsistencies after the fact.

## Example

```sql
-- Transaction 1 (Alice)
BEGIN;
SELECT count(*) FROM on_call WHERE on_duty = true;
-- Returns 2 (Alice and Bob)
UPDATE on_call SET on_duty = false WHERE doctor = 'Alice';
COMMIT;

-- Transaction 2 (Bob, concurrent)
BEGIN;
SELECT count(*) FROM on_call WHERE on_duty = true;
-- Also returns 2 (snapshot from before Alice's write)
UPDATE on_call SET on_duty = false WHERE doctor = 'Bob';
COMMIT;

-- Result: 0 doctors on call — invariant violated
```

Fix with `SELECT ... FOR UPDATE`:

```sql
BEGIN;
SELECT count(*) FROM on_call WHERE on_duty = true FOR UPDATE;
-- Now locks all on_duty rows; Bob's transaction blocks here
UPDATE on_call SET on_duty = false WHERE doctor = 'Alice';
COMMIT;
```

## Related terms

Dirty read and read skew are other isolation anomalies at lower isolation levels. Phantom read is similar but involves newly inserted rows rather than existing ones. Optimistic locking can detect write skew at commit time by checking version numbers.
