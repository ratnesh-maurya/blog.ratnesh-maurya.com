---
title: Materialized Views
description: 'A materialized view is a database object that stores the result of a query as a physical table. Unlike a regular (virtual) view, it contains actual…'
questions:
  - What is Materialized Views?
  - When is Materialized Views used?
  - What are the trade-offs of Materialized Views?
---

## Definition

A materialized view is a database object that stores the result of a query as a physical table[[\[43\]](https://aws.amazon.com/what-is/materialized-view/ "What is a Materialized View? - Materialized View Exp…")](https://aws.amazon.com/what-is/materialized-view/ "What is a Materialized View? - Materialized View Exp…"). Unlike a regular (virtual) view, it contains actual data.

## Core concept

On creation, the view’s underlying query is executed and the results are stored. The DB can index this data. Materialized views must be refreshed (either periodically or on demand) to stay up-to-date with source tables.

## Use cases

Data warehousing and analytics: complex joins/aggregations are precomputed for fast reads. Reporting queries can run against the materialized view instead of the raw tables.

## Trade-offs

Cost of storage and refresh: if underlying data changes frequently, the view must be updated often (full or incremental refresh). Stale data risk exists if refresh lags.

## Example

If you have large orders and customers tables, you could create a materialized view sales_summary that joins them and aggregates by month. Queries on sales_summary are then very fast.

## References

“A materialized view is a duplicate data table created by combining data from multiple existing tables for faster data retrieval”[[\[43\]](https://aws.amazon.com/what-is/materialized-view/ "What is a Materialized View? - Materialized View Exp…")](https://aws.amazon.com/what-is/materialized-view/ "What is a Materialized View? - Materialized View Exp…").
