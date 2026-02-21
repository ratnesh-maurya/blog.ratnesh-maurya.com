---
title: Columnar vs Row Storage
description: Columnar storage stores data column-by-column (all values of one column together). Row-based storage stores data row-by-row (complete records…
questions:
  - What is Columnar vs Row Storage?
  - When is Columnar vs Row Storage used?
  - What are the trade-offs of Columnar vs Row Storage?
---

## Definition

Columnar storage stores data column-by-column (all values of one column together). Row-based storage stores data row-by-row (complete records together).

## Core concept

Columnar DBs compress and read column values efficiently, great for analytical queries scanning few columns across many rows. Row stores are better for transactional workloads with many small writes/reads of individual rows.

## Use cases

OLAP and data warehousing use columnar (e.g. Parquet, Redshift). OLTP use row-oriented (MySQL, Postgres).

## Trade-offs

Columnar reduces I/O for read queries on subsets of columns, but slower for point updates (writing a single row touches multiple column files).

## References

Data warehouse literature.
