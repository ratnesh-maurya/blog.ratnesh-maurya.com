---
title: Compaction
description: 'Compaction is the process of merging and recycling data files to reclaim space and improve read performance, especially in Log-Structured Merge (LSM) tree…'
questions:
  - What is Compaction?
  - When is Compaction used?
  - What are the trade-offs of Compaction?
---

## Definition

Compaction is the process of merging and recycling data files to reclaim space and improve read performance, especially in Log-Structured Merge (LSM) tree systems.

## Core concept

In LSM-based stores (Cassandra, RocksDB, etc.), data is written to immutable files (SSTables). Over time, these files accumulate overlapping key ranges and duplicate/deleted entries. Compaction periodically merges older files, discards obsolete versions, and creates consolidated sorted files. This reduces storage bloat and read amplification.

## Use cases

Databases using LSM trees (Cassandra, HBase, Scylla, etc.) rely on compaction. It’s essential for garbage collecting deleted data and optimizing queries.

## Trade-offs

Compaction uses CPU, I/O, and memory; it can impact write throughput temporarily. Different strategies (size-tiered vs leveled) have different read/write amplification trade-offs. However, compaction is necessary to avoid unbounded storage growth.

## Example

Cassandra runs compaction tasks to merge SSTables. After many updates/deletes, a manual or automatic compaction would consolidate data so that reads only hit a few large sorted files.

## References

“Compaction is used for garbage collection and merge sort on data, necessary for an LSM-Tree system”[[\[29\]](https://www.alibabacloud.com/blog/596780 "An In-depth Discussion on the LSM Compaction Mechani…")](https://www.alibabacloud.com/blog/596780 "An In-depth Discussion on the LSM Compaction Mechani…"); introduced “to optimize read performance and space by recycling old data and merging multiple layers”[[\[30\]](https://www.alibabacloud.com/blog/596780 "An In-depth Discussion on the LSM Compaction Mechani…")](https://www.alibabacloud.com/blog/596780 "An In-depth Discussion on the LSM Compaction Mechani…").
