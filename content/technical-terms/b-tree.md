---
title: B-tree
description: 'A B-tree is a self-balancing tree data structure that maintains sorted data and allows searches, sequential access, insertions, and deletions in logarithmic…'
questions:
  - What is B-tree?
  - When is B-tree used?
  - What are the trade-offs of B-tree?
---

## Definition

A B-tree is a self-balancing tree data structure that maintains sorted data and allows searches, sequential access, insertions, and deletions in logarithmic time.

## Core concept

Unlike a binary tree (2 children max), a B-tree node can have many children, keeping the tree short and wide. This optimizes disk/block accesses. Data is stored in sorted order in nodes (pages), minimizing the number of disk reads for range queries.

## Use cases

B-trees (or variants like B+ trees) are the default index structure in many RDBMS (MySQL InnoDB, Oracle, etc.) and file systems. They serve as clustered indexes and primary keys.

## Trade-offs

B-trees handle point queries and sequential scans well. However, they can suffer write-amplification on SSDs and are not as write-friendly as LSM trees in heavy write scenarios.

## Example

A B-tree of order m stores up to m children; searching involves descending from root to a leaf by binary searching keys at each node.

## References

“A B-tree is a self-balancing tree that maintains sorted data and allows searches, insertions, deletions in O(log n) time”[[\[46\]](https://en.wikipedia.org/wiki/B-tree "B-tree - Wikipedia")](https://en.wikipedia.org/wiki/B-tree "B-tree - Wikipedia").
