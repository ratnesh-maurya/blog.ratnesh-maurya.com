---
title: Dirty Read
description: 'A dirty read is when a transaction reads data written by another uncommitted transaction. If that other transaction rolls back, the reading transaction got…'
questions:
  - What is Dirty Read?
  - When is Dirty Read used?
  - What are the trade-offs of Dirty Read?
---

## Definition

A dirty read is when a transaction reads data written by another uncommitted transaction. If that other transaction rolls back, the reading transaction got invalid data.

## Core concept

Dirty reads violate isolation. Isolation levels above READ UNCOMMITTED prevent dirty reads.

## Use cases

Rarely acceptable. Sometimes non-critical data analytics might allow it for speed.

## Example

T1 does UPDATE accounts SET balance=100 WHERE id=1; but hasn’t committed. T2 reads balance=100 (dirty). If T1 aborts, T2 read was invalid.

## References

Standard transaction isolation concepts.
