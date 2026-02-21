---
title: Data Skew
description: Data skew is an uneven distribution of data (or workload) across partitions or nodes. Some partitions get more data/traffic than others.
questions:
  - What is Data Skew?
  - When is Data Skew used?
  - What are the trade-offs of Data Skew?
---

## Definition

Data skew is an uneven distribution of data (or workload) across partitions or nodes. Some partitions get more data/traffic than others.

## Core concept

In parallel processing or sharding, skewed partition keys result in hotspots. E.g., one database shard stores 90% of keys.

## Use cases

Important in distributed databases and analytics. Skew can slow down operations (some workers have much more to do).

## Trade-offs

Mitigation can include re-partitioning or using consistent hashing.

## Example

In a MapReduce job, if one reducer gets most keys, it slows the whole job.

## References

Data engineering concept.
