---
title: Logical vs Physical Replication
description: Logical replication replicates database changes at a logical level (e.g. SQL statements or row change events). Physical replication copies the exact data files…
questions:
  - What is Logical vs Physical Replication?
  - When is Logical vs Physical Replication used?
  - What are the trade-offs of Logical vs Physical Replication?
---

## Definition

Logical replication replicates database changes at a logical level (e.g. SQL statements or row change events). Physical replication copies the exact data files or binary log (WAL) at the block/byte level.

## Core concept

Physical replication (e.g. streaming WAL) creates a hot standby that is byte-for-byte identical. Logical replication can allow different schema on subscriber, selective tables, and is usually more flexible.

## Use cases

PostgreSQL: WAL shipping is physical (exact copy); logical replication streams SQL changes to replicate a subset or to different schema.

## References

Database docs (no specific cite in our scraped sources).
