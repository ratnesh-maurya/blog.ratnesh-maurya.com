---
title: Secondary Indexes
description: A secondary index is any index on a table column that is not the primary key. It is stored separately from the table rows.
questions:
  - What is Secondary Indexes?
  - When is Secondary Indexes used?
  - What are the trade-offs of Secondary Indexes?
---

## Definition

A secondary index is any index on a table column that is not the primary key. It is stored separately from the table rows[[\[3\]](https://planetscale.com/learn/courses/mysql-for-developers/indexes/covering-indexes "Covering indexes — MySQL for Developers — PlanetScale")](https://planetscale.com/learn/courses/mysql-for-developers/indexes/covering-indexes "Covering indexes — MySQL for Developers — PlanetScale").

## Core concept

In many DBs, the primary key index (clustered index) is built into the table structure. A secondary index is an auxiliary data structure (often a B-tree) mapping the indexed column to row pointers (primary keys). For example, if users(id) is primary, an index on users(email) would be a secondary index.

## Use cases

Speeds up queries on non-PK columns. Useful when filtering or joining on those columns.

## Trade-offs

Every insert/update requires updating secondary indexes. They add overhead to writes and use extra space.

## Example

CREATE INDEX idx_users_email ON users(email); creates a secondary index on email.

## References

“A secondary index is a separate data structure that maintains a copy of part of the data”[[\[3\]](https://planetscale.com/learn/courses/mysql-for-developers/indexes/covering-indexes "Covering indexes — MySQL for Developers — PlanetScale")](https://planetscale.com/learn/courses/mysql-for-developers/indexes/covering-indexes "Covering indexes — MySQL for Developers — PlanetScale").
