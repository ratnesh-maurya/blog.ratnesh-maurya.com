---
title: Pessimistic Locking
description: Pessimistic locking is the strategy of locking data resources before accessing them to prevent conflicts. A transaction acquires locks on rows it will read or…
questions:
  - What is Pessimistic Locking?
  - When is Pessimistic Locking used?
  - What are the trade-offs of Pessimistic Locking?
---

## Definition

Pessimistic locking is the strategy of locking data resources before accessing them to prevent conflicts. A transaction acquires locks on rows it will read or write.

## Core concept

Locks ensure that no other transaction can modify (or sometimes read) the data until the lock is released. This prevents anomalies but can cause contention.

## Use cases

High-conflict environments (finance) where you avoid retries. Row-level locks (SELECT ... FOR UPDATE) in SQL are an example.

## Trade-offs

Can lead to reduced concurrency and possible deadlocks.

## Example

T1 does SELECT ... FOR UPDATE locking the row; T2 tries same row and must wait until T1 commits.

## References

Common DB theory (no direct cite).
