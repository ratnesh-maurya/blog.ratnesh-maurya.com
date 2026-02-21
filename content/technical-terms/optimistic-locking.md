---
title: Optimistic Locking
description: 'Optimistic locking is a concurrency control strategy where a transaction proceeds without locking resources, checking for conflicts only at commit. Typically…'
questions:
  - What is Optimistic Locking?
  - When is Optimistic Locking used?
  - What are the trade-offs of Optimistic Locking?
---

## Definition

Optimistic locking is a concurrency control strategy where a transaction proceeds without locking resources, checking for conflicts only at commit. Typically implemented via version checks.

## Core concept

When reading, the transaction notes a version (timestamp or version number) of the data. On write/commit, it verifies the version is unchanged. If it changed, the transaction aborts and retries. No locks are held during the transaction.

## Use cases

Web apps and ORMs often use optimistic locking for performance when conflicts are rare (e.g., many users read the same data but few update it).

## Trade-offs

Risk of transaction abort: more work on retry if conflicts occur. Best for low-contention scenarios.

## Example

A row has a version column. T1 reads version=1. T2 updates row and sets version=2. T1, on update, sees version changed and rolls back.

## References

Common knowledge in DB concurrency (no direct cite).
