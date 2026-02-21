---
title: Covering Index
description: 'A covering index is a (secondary or composite) index that includes all columns needed for a query. The index “covers” the query, so the database can…'
questions:
  - What is Covering Index?
  - When is Covering Index used?
  - What are the trade-offs of Covering Index?
---

## Definition

A covering index is a (secondary or composite) index that includes all columns needed for a query. The index “covers” the query, so the database can retrieve all data from the index itself without accessing the table (clustered index).

## Core concept

If an index contains every column in a SELECT query (both filtering and returned columns), then the DB engine can find results purely in the index (often a B-tree leaf node) and avoid the extra lookup to the table rows, which speeds up reads.

## Use cases

Performance tuning: if a query selects only certain columns, adding them to the index (as included columns or by extending the composite key) can eliminate table access.

## Trade-offs

The index becomes wider (bigger). It’s only useful for specific queries. But it can significantly reduce read I/O.

## Example

If we often run SELECT last_name, first_name FROM users WHERE email = ?, an index on (email, last_name, first_name) is covering: it has the filter column (email) and both output columns, so the DB reads from the index alone[[\[5\]](https://planetscale.com/learn/courses/mysql-for-developers/indexes/covering-indexes "Covering indexes — MySQL for Developers — PlanetScale")](https://planetscale.com/learn/courses/mysql-for-developers/indexes/covering-indexes "Covering indexes — MySQL for Developers — PlanetScale").

## References

“A covering index is a regular index that provides all the data required for a query without accessing the actual table”[[\[5\]](https://planetscale.com/learn/courses/mysql-for-developers/indexes/covering-indexes "Covering indexes — MySQL for Developers — PlanetScale")](https://planetscale.com/learn/courses/mysql-for-developers/indexes/covering-indexes "Covering indexes — MySQL for Developers — PlanetScale").
