---
title: Leader–Follower Replication
description: 'Leader–Follower (also called master-slave) replication is a strategy where one node (the leader) receives all write operations, and one or more follower…'
questions:
  - What is Leader–Follower Replication?
  - When is Leader–Follower Replication used?
  - What are the trade-offs of Leader–Follower Replication?
---

## Definition

Leader–Follower (also called master-slave) replication is a strategy where one node (the leader) receives all write operations, and one or more follower replicas replicate the leader’s data[[\[10\]](https://bluegrid.io/glossary/software-development/data-replication-in-databases/ "Data Replication in Databases - BlueGrid.io : BlueGr…")](https://bluegrid.io/glossary/software-development/data-replication-in-databases/ "Data Replication in Databases - BlueGrid.io : BlueGr…"). Only the leader is writable; followers are read-only copies.

## Core concept

In this model, the leader commits writes to its log, and followers read that log and apply changes. Each follower remains a consistent copy (eventually) of the leader. For example, in a relational cluster, all INSERT/UPDATE/DELETE happen on the leader, and SELECTs can be on followers.

## Use cases

Very common in SQL databases (PostgreSQL, MySQL, Microsoft SQL) and distributed systems. Ensures a single source of truth with straightforward conflict avoidance.

## Trade-offs

Leader-follower provides strong consistency on the leader, but followers can lag (eventual consistency). Write throughput is limited by a single leader’s capacity. If the leader fails, a follower must be promoted (failover), requiring consensus/leader election logic.

## Example

In a PostgreSQL cluster, one server is primary (leader), and it streams WAL logs to replicas (followers). Followers apply these logs to stay up to date[[\[10\]](https://bluegrid.io/glossary/software-development/data-replication-in-databases/ "Data Replication in Databases - BlueGrid.io : BlueGr…")](https://bluegrid.io/glossary/software-development/data-replication-in-databases/ "Data Replication in Databases - BlueGrid.io : BlueGr…").

## References

Definition from BlueGrid: “Leader-follower: a single leader accepts writes, while followers replicate from the leader’s log”[[\[10\]](https://bluegrid.io/glossary/software-development/data-replication-in-databases/ "Data Replication in Databases - BlueGrid.io : BlueGr…")](https://bluegrid.io/glossary/software-development/data-replication-in-databases/ "Data Replication in Databases - BlueGrid.io : BlueGr…").
