---
title: LSM Tree
description: A Log-Structured Merge-tree (LSM tree) is a data structure optimized for high write volumes. It buffers writes in memory and periodically merges them to…
questions:
  - What is LSM Tree?
  - When is LSM Tree used?
  - What are the trade-offs of LSM Tree?
---

## Definition

A Log-Structured Merge-tree (LSM tree) is a data structure optimized for high write volumes[[\[45\]](https://en.wikipedia.org/wiki/Log-structured_merge-tree "Log-structured merge-tree - Wikipedia")](https://en.wikipedia.org/wiki/Log-structured_merge-tree "Log-structured merge-tree - Wikipedia"). It buffers writes in memory and periodically merges them to disk in large batches.

## Core concept

An LSM tree has multiple levels: a small in-memory tree (level 0) and larger on-disk trees (level 1+). Writes are first logged (WAL) and inserted into the in-memory component. When it fills, it flushes to disk as a sorted file (SSTable). Background compaction merges overlapping files across levels.

## Use cases

NoSQL stores (Cassandra, RocksDB, HBase) use LSM to achieve high write throughput. It turns random writes into sequential I/O.

## Trade-offs

Read amplification (may have to check multiple levels) and compaction overhead. But significantly faster writes and cheaper disk usage patterns.

## Example

Write 1 million key-value pairs; instead of 1M random disk writes, an LSM will write them to memory and then to a few large files sequentially.

## References

“An LSM tree is a data structure that makes for efficient indexed access to files with high insert volume. It maintains data in two or more structures optimized for their storage; data is synchronized in batches”[[\[45\]](https://en.wikipedia.org/wiki/Log-structured_merge-tree "Log-structured merge-tree - Wikipedia")](https://en.wikipedia.org/wiki/Log-structured_merge-tree "Log-structured merge-tree - Wikipedia").
