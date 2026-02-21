---
title: Deadlock
description: 'A deadlock occurs when two or more transactions block each other indefinitely, each holding a resource the other needs.'
questions:
  - What is Deadlock?
  - When is Deadlock used?
  - What are the trade-offs of Deadlock?
---

## Definition

A deadlock occurs when two or more transactions block each other indefinitely, each holding a resource the other needs.

## Core concept

Imagine T1 locks row A and wants row B, while T2 locks row B and wants A. Neither can proceed, causing a circular wait.

## Use cases

Deadlocks can happen in any system with locking and concurrency. DBMS detect deadlocks (e.g., by waits-for graph) and resolve by aborting one transaction.

## Trade-offs

Solutions include lock timeouts, lock ordering rules, or avoidance techniques. Deadlocks reduce throughput; detecting and rolling back the “victim” frees resources.

## Example

In SQL Server, if two sessions lock rows in opposite order, the engine will detect a cycle and kill one transaction (the “deadlock victim”)[[\[48\]](https://www.geeksforgeeks.org/dbms/deadlock-in-dbms/ "Deadlock in DBMS - GeeksforGeeks")](https://www.geeksforgeeks.org/dbms/deadlock-in-dbms/ "Deadlock in DBMS - GeeksforGeeks").

## References

“A deadlock occurs… when two or more transactions block each other indefinitely by each holding a resource the other needs”[[\[48\]](https://www.geeksforgeeks.org/dbms/deadlock-in-dbms/ "Deadlock in DBMS - GeeksforGeeks")](https://www.geeksforgeeks.org/dbms/deadlock-in-dbms/ "Deadlock in DBMS - GeeksforGeeks").
