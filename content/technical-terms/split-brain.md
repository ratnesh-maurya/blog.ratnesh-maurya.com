---
title: Split-Brain
description: Split-brain is a failure scenario in clustered systems where network failures cause two (or more) segments of the cluster to believe they are the sole primary…
questions:
  - What is Split-Brain?
  - When is Split-Brain used?
  - What are the trade-offs of Split-Brain?
---

## Definition

Split-brain is a failure scenario in clustered systems where network failures cause two (or more) segments of the cluster to believe they are the sole primary system, leading to divergent data updates[[\[35\]](https://en.wikipedia.org/wiki/Split-brain_(computing "Split-brain (computing) - Wikipedia").

## Core concept

If cluster nodes lose communication (network partition) and there is no quorum mechanism, each side may independently accept writes. When connectivity returns, the data sets have “diverged” with conflicting changes.

## Use cases

Split-brain is a hazard in any HA cluster (databases, file systems, etc.). Systems often use heartbeats and quorum to avoid it. Without protection, risk of data corruption is high.

## Trade-offs

Avoiding split-brain often means sacrificing availability (one side stops accepting writes without quorum). Letting both sides go can preserve availability but then manual conflict resolution is needed after heal.

## Example

In an HA PostgreSQL cluster of 2 nodes without a witness: if the heartbeat fails, both might think the other is down and both become primary, causing different clients to write conflicting data.

## References

“Split-brain is a state of data inconsistencies from the maintenance of two separate datasets with overlap… servers not communicating”[[\[35\]](https://en.wikipedia.org/wiki/Split-brain_(computing "Split-brain (computing) - Wikipedia").
