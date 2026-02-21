---
title: Write Skew
description: 'Write skew is an anomaly where two concurrent transactions each read overlapping data and then write non-overlapping fields, resulting in an overall invalid…'
questions:
  - What is Write Skew?
  - When is Write Skew used?
  - What are the trade-offs of Write Skew?
---

## Definition

Write skew is an anomaly where two concurrent transactions each read overlapping data and then write non-overlapping fields, resulting in an overall invalid state despite no single column being overwritten.

## Core concept

Occurs under snapshot isolation. Example: two doctors scheduling themselves off on same day, checking each other’s availability and both writing an appointment because they didn’t see the other’s write at start.

## Use cases

Snapshot isolation can allow write skew. Serializable isolation prevents it.

## Example

Table of on-call doctors with boolean fields. Both T1 and T2 see the other is on-call, each marks themselves off. Both commit, now no doctor is on-call (invalid).

## References

Known concept in transaction anomalies.
