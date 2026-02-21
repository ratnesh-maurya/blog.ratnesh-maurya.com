---
title: Bloom Filter
description: A Bloom filter is a space-efficient probabilistic data structure to test whether an element is in a set. It can tell “possibly in set” or “definitely not…
questions:
  - What is Bloom Filter?
  - When is Bloom Filter used?
  - What are the trade-offs of Bloom Filter?
---

## Definition

A Bloom filter is a space-efficient probabilistic data structure to test whether an element is in a set. It can tell “possibly in set” or “definitely not in set,” allowing false positives but no false negatives.

## Core concept

A Bloom filter uses a bit array and several hash functions. To add an element, it hashes it and sets bits. To test membership, it checks those bits. If any is 0, the item is definitely not present. If all are 1, the item is possibly present (could be a false positive due to collisions).

## Use cases

Databases use Bloom filters to avoid unnecessary reads. For example, Cassandra uses Bloom filters to check if an SSTable might contain a key. If the filter says “no,” it skips disk I/O for that table. Web caches might use Bloom filters to quickly rule out misses.

## Trade-offs

Very memory-efficient for large sets, but risk of false positives (leading to wasted reads). False positive rate grows with more elements or too small a filter.

## Example

A DB wants to check if key K exists in a storage file. It first queries the Bloom filter. If result is “definitely not,” skip the file.

## References

“A Bloom filter is a space-efficient probabilistic data structure… used to test whether an element is a member of a set. False positives are possible, false negatives are not”[[\[44\]](https://en.wikipedia.org/wiki/Bloom_filter "Bloom filter - Wikipedia")](https://en.wikipedia.org/wiki/Bloom_filter "Bloom filter - Wikipedia").
