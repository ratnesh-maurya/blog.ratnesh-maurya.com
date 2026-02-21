---
title: Phantom Read
description: A phantom read occurs when a transaction re-reads rows matching a condition and finds new rows that were inserted or deleted by another transaction after the…
questions:
  - What is Phantom Read?
  - When is Phantom Read used?
  - What are the trade-offs of Phantom Read?
---

## Definition

A phantom read occurs when a transaction re-reads rows matching a condition and finds new rows that were inserted or deleted by another transaction after the initial read.

## Core concept

In other words, the set of rows returned changes (some “phantom” row appears or disappears) due to concurrent inserts/deletes by others.

## Use cases

Phantom reads are prevented in the Serializable isolation level.

## Example

T1 runs SELECT * FROM employees WHERE dept='Sales' and gets 10 rows. T2 inserts a new Sales employee and commits. T1 runs same SELECT again and sees 11 rows. The extra row is a phantom.

## References

Standard DB isolation definitions.
