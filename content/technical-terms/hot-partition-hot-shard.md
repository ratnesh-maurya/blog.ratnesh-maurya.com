---
title: Hot Partition (Hot Shard)
description: 'A hot partition (or hot shard/key) is a data partition that receives disproportionately high traffic, causing resource saturation.'
questions:
  - What is Hot Partition (Hot Shard)?
  - When is Hot Partition (Hot Shard) used?
  - What are the trade-offs of Hot Partition (Hot Shard)?
---

## Definition

A hot partition (or hot shard/key) is a data partition that receives disproportionately high traffic, causing resource saturation.

## Core concept

In a sharded system, if one shard/key sees most reads/writes, it becomes a bottleneck. That node may run out of CPU, memory, or I/O capacity, causing high latency or failures, while other shards are idle.

## Use cases

This often happens with poorly chosen partition keys or time-based partitions. E.g., in a time-series DB, the latest time partition may be “hot” as new data arrives. Or a social network user with many connections might create a hot key.

## Trade-offs

Hot partitions degrade performance and can lead to cascading failures if not mitigated (e.g. by adding more replicas or adjusting traffic).

## Example

If userID 1234 is extremely popular, all requests for that user hit the same partition, overwhelming it. Techniques like splitting keys, caching, or read-replicas can alleviate this.

## References

“Hot Shard/Partition: a shard’s resource saturation resulting in backlog of requests”[[\[34\]](https://medium.com/@_sidharth_m_/how-to-handle-hot-shard-problem-7f640a5444e0 "How to Handle Hot Shard Problem? | Medium")](https://medium.com/@_sidharth_m_/how-to-handle-hot-shard-problem-7f640a5444e0 "How to Handle Hot Shard Problem? | Medium").
