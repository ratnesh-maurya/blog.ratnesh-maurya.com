---
title: Range Partitioning
description: Range partitioning divides data by ordered key ranges. Each shard holds a contiguous range of key values.
questions:
  - What is Range Partitioning?
  - When is Range Partitioning used?
  - What are the trade-offs of Range Partitioning?
---

## Definition

Range partitioning divides data by ordered key ranges. Each shard holds a contiguous range of key values.

## Core concept

Good for range queries: all values in a range reside together. For instance, shard1 holds keys 0-1000, shard2 1001-2000, etc.

## Use cases

Partitioning logs by date (Jan 2026 in one partition).

## Trade-offs

Can lead to hot shards if data skews. Splitting ranges as data grows requires resharding.

## References

Sharding tutorials.
