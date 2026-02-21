---
title: Idempotency
description: 'Idempotency means an operation can be applied multiple times without changing the result beyond the initial application. In distributed systems, it ensures…'
questions:
  - What is Idempotency?
  - When is Idempotency used?
  - What are the trade-offs of Idempotency?
---

## Definition

Idempotency means an operation can be applied multiple times without changing the result beyond the initial application. In distributed systems, it ensures retries don’t duplicate work.

## Core concept

HTTP PUT is idempotent (setting value to X is same if done once or many times). Using unique request IDs or checks can achieve it.

## Use cases

Exactly-once messaging, reliable REST APIs.

## Trade-offs

Requires storage of seen requests or unique constraints.
