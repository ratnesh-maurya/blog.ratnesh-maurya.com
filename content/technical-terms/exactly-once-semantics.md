---
title: Exactly-Once Semantics
description: 'Guarantees that an operation (like processing a message) is performed only once, despite retries and failures.'
questions:
  - What is Exactly-Once Semantics?
  - When is Exactly-Once Semantics used?
  - What are the trade-offs of Exactly-Once Semantics?
---

## Definition

Guarantees that an operation (like processing a message) is performed only once, despite retries and failures.

## Core concept

Combines idempotency, deduplication, and atomic commit to ensure no duplicates or misses.

## Use cases

Financial transactions, critical event handling.

## Trade-offs

More complex (stateful dedup store, distributed transactions) and often requires idempotent design.
