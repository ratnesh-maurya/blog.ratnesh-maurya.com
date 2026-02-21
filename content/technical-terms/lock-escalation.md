---
title: Lock Escalation
description: Lock escalation is the process of converting many fine-grained locks (like row or page locks) into a coarser lock (like a table lock) to reduce lock management…
questions:
  - What is Lock Escalation?
  - When is Lock Escalation used?
  - What are the trade-offs of Lock Escalation?
---

## Definition

Lock escalation is the process of converting many fine-grained locks (like row or page locks) into a coarser lock (like a table lock) to reduce lock management overhead[[\[49\]](https://learn.microsoft.com/en-us/troubleshoot/sql/database-engine/performance/resolve-blocking-problems-caused-lock-escalation "Resolve blocking problem caused by lock escalation -…")](https://learn.microsoft.com/en-us/troubleshoot/sql/database-engine/performance/resolve-blocking-problems-caused-lock-escalation "Resolve blocking problem caused by lock escalation -…").

## Core concept

If a transaction holds thousands of locks on a table, the DBMS may escalate to a single table-level lock. This reduces memory for lock tracking but makes the transaction more restrictive (blocking others on the whole table).

## Use cases

Common in SQL Server and others to manage lock memory. If a large batch update locks many rows, it might be more efficient to hold one table lock.

## Trade-offs

Escalation can hurt concurrency (many rows locked become one big lock). Sometimes it causes unexpected blocking. The DB often triggers escalation only when limits are reached.

## Example

A loop updating 100,000 rows may accumulate page locks; the server might escalate to one table lock to manage resources[[\[49\]](https://learn.microsoft.com/en-us/troubleshoot/sql/database-engine/performance/resolve-blocking-problems-caused-lock-escalation "Resolve blocking problem caused by lock escalation -…")](https://learn.microsoft.com/en-us/troubleshoot/sql/database-engine/performance/resolve-blocking-problems-caused-lock-escalation "Resolve blocking problem caused by lock escalation -…").

## References

“Lock escalation is the process of converting many fine-grained locks (such as row or page locks) to table locks”[[\[49\]](https://learn.microsoft.com/en-us/troubleshoot/sql/database-engine/performance/resolve-blocking-problems-caused-lock-escalation "Resolve blocking problem caused by lock escalation -…")](https://learn.microsoft.com/en-us/troubleshoot/sql/database-engine/performance/resolve-blocking-problems-caused-lock-escalation "Resolve blocking problem caused by lock escalation -…").
