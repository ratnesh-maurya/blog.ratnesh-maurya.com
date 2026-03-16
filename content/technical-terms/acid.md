---
title: ACID
description: "ACID (Atomicity, Consistency, Isolation, Durability) defines four properties that guarantee database transactions are processed reliably, even during crashes, errors, or concurrent access."
questions:
  - What is ACID?
  - When is ACID used?
  - What are the trade-offs of ACID?
---

## Definition

ACID is an acronym for four properties — Atomicity, Consistency, Isolation, Durability — that guarantee database transactions are processed reliably and predictably.

## How it works

**Atomicity** ensures a transaction is all-or-nothing. If a bank transfer debits account A and credits account B, either both operations succeed or neither does. If the system crashes between the debit and credit, the transaction is rolled back entirely. Databases implement this using write-ahead logging (WAL): changes are written to a log before being applied, and the log is replayed or rolled back on recovery.

**Consistency** means a transaction moves the database from one valid state to another. All constraints (foreign keys, unique indexes, check constraints) are enforced. If a transaction would violate a constraint, it's aborted.

**Isolation** controls how concurrent transactions see each other's changes. At the strictest level (serializable), transactions behave as if they ran one after another. Weaker isolation levels (read committed, repeatable read) allow more concurrency at the cost of anomalies like dirty reads, phantom reads, or write skew.

**Durability** guarantees that once a transaction commits, its changes survive power failures and crashes. The database flushes the WAL to disk before acknowledging the commit. Replicated databases extend durability by writing to multiple nodes before confirming.

## When to use it

- **Financial transactions** — Transferring money, processing payments, updating account balances. A partial transfer is catastrophic.
- **E-commerce order processing** — Decrementing inventory, creating an order record, and charging a payment must all succeed together.
- **User registration** — Creating a user, a profile, and sending a welcome email notification should be atomic from the database's perspective.
- **Any system where data corruption is unacceptable** — Healthcare records, legal documents, audit logs.

## Trade-offs

**Gains:** Strong correctness guarantees. Developers can reason about transactions as indivisible units without worrying about partial failures or race conditions. Simplifies application logic significantly.

**Costs:** Strict ACID (especially serializable isolation) reduces throughput because transactions block each other. Write-ahead logging and fsync on every commit add disk I/O overhead. Distributed ACID (across multiple nodes) requires consensus protocols like two-phase commit, which adds latency and reduces availability during network partitions — directly conflicting with the CAP theorem.

Many NoSQL databases (Cassandra, DynamoDB) relax ACID in favor of BASE (Basically Available, Soft state, Eventually consistent) to achieve higher throughput and availability.

## Example

```sql
BEGIN;

UPDATE accounts SET balance = balance - 500 WHERE id = 'A';
-- Atomicity: if this succeeds but the next fails, both are rolled back

UPDATE accounts SET balance = balance + 500 WHERE id = 'B';
-- Consistency: CHECK (balance >= 0) constraint prevents overdraft

COMMIT;
-- Durability: changes are now on disk, survives a crash

-- If the server crashes between the two UPDATEs,
-- the WAL ensures the first UPDATE is rolled back.
-- Account A's balance is unchanged. No money disappears.
```

## Related terms

BASE is the alternative consistency model used by many distributed databases that trade strict consistency for availability. Write-ahead logging (WAL) is the mechanism most databases use to implement atomicity and durability. CAP theorem explains why distributed systems can't have full ACID compliance and high availability simultaneously during network partitions.
