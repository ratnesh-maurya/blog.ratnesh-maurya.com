---
title: Read Skew
description: Read skew is a concurrency anomaly where a transaction sees inconsistent data because it reads different rows or tables at different points in time during concurrent modifications.
questions:
  - What is Read Skew?
  - When is Read Skew used?
  - What are the trade-offs of Read Skew?
---

## Definition

Read skew is a concurrency anomaly where a transaction reads related data at different points in time, seeing a mix of old and new values that creates an inconsistent view.

## How it works

Read skew happens under the `READ COMMITTED` isolation level, which only guarantees you won't see uncommitted data—it does not guarantee a consistent snapshot across multiple reads within one transaction.

Consider a banking system with two accounts that must sum to $1,000. Transaction T1 transfers $100 from Account A to Account B. Transaction T2, running concurrently, reads Account A before the transfer ($500), then reads Account B after the transfer ($600). T2 sees a total of $1,100—an impossible state. Neither read was dirty (both were committed values), but the two reads reflect different moments in time.

This is different from a dirty read: the data T2 reads is committed and valid. The problem is temporal inconsistency—T2's reads span a boundary where T1's commit happened between them.

MVCC-based databases prevent read skew at the `REPEATABLE READ` level by assigning each transaction a snapshot at its start. PostgreSQL's `REPEATABLE READ` gives you a frozen point-in-time view: all reads in the transaction see data as it existed at the transaction's start, regardless of concurrent commits. MySQL/InnoDB calls this "consistent read" and provides it by default for plain `SELECT` statements even at `READ COMMITTED`, but not across multiple statements in a transaction.

## When to use it

Read skew matters when your transaction reads multiple related rows and expects them to be mutually consistent:

- **Financial systems**: Account balances, ledger entries, and running totals that must reconcile.
- **Inventory checks**: Reading stock levels across multiple warehouses where a reallocation might be in progress.
- **Backup operations**: A logical backup reading table-by-table can get an inconsistent snapshot if tables are being modified concurrently. PostgreSQL's `pg_dump` uses a `REPEATABLE READ` transaction for this reason.
- **Report generation**: Any report that joins across tables where concurrent writes could produce contradictory figures.

## Trade-offs

**Gains of preventing read skew (using REPEATABLE READ)**: Consistent snapshots. Reports and backups reflect a single point in time. Application logic doesn't need defensive checks for cross-read consistency.

**Costs**: Longer-lived snapshots consume more resources. PostgreSQL must retain old row versions (and delay vacuum) as long as a `REPEATABLE READ` transaction is open. In InnoDB, long-running snapshot transactions inflate the undo log. Some workloads see higher abort rates under `REPEATABLE READ` due to serialization conflicts.

## Example

```sql
-- READ COMMITTED: vulnerable to read skew
BEGIN;
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

SELECT balance FROM accounts WHERE id = 1;  -- reads $500
-- T1 commits: moved $100 from account 1 to account 2
SELECT balance FROM accounts WHERE id = 2;  -- reads $600
-- Total appears as $1100 (should be $1000) — read skew

COMMIT;

-- Fix: use REPEATABLE READ
BEGIN;
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;

SELECT balance FROM accounts WHERE id = 1;  -- reads $500 (snapshot)
-- T1 commits, but this transaction doesn't see it
SELECT balance FROM accounts WHERE id = 2;  -- reads $500 (snapshot)
-- Total is correctly $1000

COMMIT;
```

## Related terms

Read skew is less severe than phantom reads (which involve new rows appearing) and more subtle than dirty reads (which involve uncommitted data). All three are concurrency anomalies addressed by progressively stricter isolation levels.
