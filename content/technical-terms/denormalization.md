---
title: Denormalization
description: 'Denormalization is the process of intentionally adding redundancy to a database schema to improve read/query performance. In a denormalized design, data…'
questions:
  - What is Denormalization?
  - When is Denormalization used?
  - What are the trade-offs of Denormalization?
---

## Definition

Denormalization is the process of intentionally adding redundancy to a database schema to improve read/query performance. In a denormalized design, data that would normally be kept in separate related tables (normalized form) is combined or duplicated, reducing the need for costly joins.

## Core concept

By storing pre-joined or redundant information, queries can run faster because the DB can read from a single table instead of performing multiple joins at runtime. For example, instead of separate orders and customers tables linked by a customer ID, you might add customer name and address directly to each order row.

## Use cases

Denormalization is useful in read-heavy systems (like reporting or OLAP) where join operations become a bottleneck. Data warehouses and analytics often use denormalized schemas (e.g., star schema) to speed up query performance. Caching aggregated or joined data as separate tables (materialized views) is a form of denormalization.

## Trade-offs

Denormalization improves read performance but sacrifices write performance and storage efficiency. Updates must be applied in multiple places to keep data consistent, increasing complexity. It can also lead to data anomalies if not managed carefully.

## Example

A web application might maintain a denormalized “recent_activity” table that stores a user’s recent posts along with user name and avatar URL, so each profile page lookup doesn’t have to join posts and users.

## References

Denormalization defined as adding redundant data to speed queries[[\[7\]](https://www.geeksforgeeks.org/dbms/denormalization-in-databases/ "Denormalization in Databases - GeeksforGeeks")](https://www.geeksforgeeks.org/dbms/denormalization-in-databases/ "Denormalization in Databases - GeeksforGeeks").
