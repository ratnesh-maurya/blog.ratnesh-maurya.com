---
title: Resharding
description: 'Resharding is changing the number or configuration of shards (data partitions) in a sharded database, moving data between shards accordingly.'
questions:
  - What is Resharding?
  - When is Resharding used?
  - What are the trade-offs of Resharding?
---

## Definition

Resharding is changing the number or configuration of shards (data partitions) in a sharded database, moving data between shards accordingly.

## Core concept

Initially, a system may start with a few shards. As data grows or load increases, more shards are needed. Resharding adds shards and redistributes data (and queries) to them. It’s essentially rebalancing with a focus on splits.

## Use cases

Any sharded system needing capacity planning. For instance, PlanetScale describes adding shards as data grows[[\[32\]](https://planetscale.com/blog/database-sharding "Database Sharding — PlanetScale")](https://planetscale.com/blog/database-sharding "Database Sharding — PlanetScale").

## Trade-offs

Resharding can be complex and requires migrating data without downtime. Some systems use consistent hashing to minimize data movement when resharding.

## Example

In a MySQL sharded cluster, going from 2 to 3 shards is resharding. Tools like Vitess (as in PlanetScale) handle moving rows to the new shard.

## References

PlanetScale: “As data grows, we can add more shards… a process known as resharding”[[\[32\]](https://planetscale.com/blog/database-sharding "Database Sharding — PlanetScale")](https://planetscale.com/blog/database-sharding "Database Sharding — PlanetScale").
