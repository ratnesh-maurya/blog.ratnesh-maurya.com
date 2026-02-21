---
title: Read Skew
description: 'Read skew is an anomaly where a transaction reads outdated data in one table or column while reading updated related data in another, leading to inconsistency…'
questions:
  - What is Read Skew?
  - When is Read Skew used?
  - What are the trade-offs of Read Skew?
---

## Definition

Read skew is an anomaly where a transaction reads outdated data in one table or column while reading updated related data in another, leading to inconsistency across reads within the same transaction.

## Core concept

It happens when isolation level doesn’t enforce strict ordering of reads.

## Use cases

Eliminated by higher isolation (repeatable read or serializable).

## Example

In a bank DB, one transaction reads old balance but new transaction count in same transaction, leading to internal inconsistency.

## References

Known anomaly (less common term).
