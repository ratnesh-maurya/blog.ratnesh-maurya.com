---
title: Composite Index
description: A composite index (multi-column index) indexes multiple columns together in one index. It creates a single B-tree keyed by the tuple of column…
questions:
  - What is Composite Index?
  - When is Composite Index used?
  - What are the trade-offs of Composite Index?
---

## Definition

A composite index (multi-column index) indexes multiple columns together in one index. It creates a single B-tree keyed by the tuple of column values.

## Core concept

If queries often filter on (col1, col2) together, a composite index (col1, col2) can satisfy both. The order matters: it can be used for queries on col1 or col1, col2, but not efficiently on col2 alone (unless DB supports index skip-scan).

## Use cases

Cover complex queries: e.g. WHERE department = 'X' AND salary > 1000. An index on (department, salary) helps.

## Trade-offs

More columns in index means larger index. Also, the leftmost prefix rule (if query doesn’t use the first column, index can’t be used).

## References

“When you create a composite index, MySQL creates a B-tree on the specified columns”[[\[4\]](https://planetscale.com/learn/courses/mysql-for-developers/indexes/covering-indexes "Covering indexes — MySQL for Developers — PlanetScale")](https://planetscale.com/learn/courses/mysql-for-developers/indexes/covering-indexes "Covering indexes — MySQL for Developers — PlanetScale").
