---
title: Hash Partitioning
description: Hash partitioning assigns data to shards by hashing a key and using the hash result to pick a partition.
questions:
  - What is Hash Partitioning?
  - When is Hash Partitioning used?
  - What are the trade-offs of Hash Partitioning?
---

## Definition

Hash partitioning assigns data to shards by hashing a key and using the hash result to pick a partition.

## Core concept

If data is uniformly hashed, it distributes data evenly. Good for equality-based queries (exact key lookup).

## Use cases

Many NoSQL (Cassandra) use consistent hashing.

## Trade-offs

Range queries on the key aren’t contiguous, so less efficient. Adding nodes requires rehashing or consistent hashing.

## References

Hash partitioning common in distributed cache design.
