---
title: BASE
description: 'BASE is an acronym contrasting ACID for distributed systems: Basically Available, Soft state, Eventually consistent. It describes a model where availability is…'
questions:
  - What is BASE?
  - When is BASE used?
  - What are the trade-offs of BASE?
---

## Definition

BASE is an acronym contrasting ACID for distributed systems: Basically Available, Soft state, Eventually consistent. It describes a model where availability is prioritized over strict consistency.

Basically Available: The system guarantees availability (possibly in a degraded manner).

Soft state: The state of the system may change over time, even without input, due to eventual consistency.

Eventual consistency: The system will become consistent over time, assuming no new updates.

## Core concept

BASE systems allow temporary inconsistencies to achieve higher availability and partition tolerance. Writes do not fail (even under partitions); replicas asynchronously synchronize.

## Use cases

Many NoSQL databases (Cassandra, Dynamo, Riak) follow BASE. If an Amazon product database is highly distributed, it may allow reading slightly stale data for the sake of high availability.

## Trade-offs

Accepts eventual consistency (reads may return stale data). There may be conflicts that need resolution. ACID guarantees are relaxed, so transaction isolation and atomicity are weaker.

## Example

Updating a user profile might not propagate immediately to all replicas. Queries to some replicas return old info, but eventually all become the same.

## References

“BASE stands for Basically Available, Soft state, Eventually consistent”[[\[16\]](https://neo4j.com/blog/graph-database/acid-vs-base-consistency-models-explained/ "Data Consistency Models: ACID vs. BASE Databases Exp…")](https://neo4j.com/blog/graph-database/acid-vs-base-consistency-models-explained/ "Data Consistency Models: ACID vs. BASE Databases Exp…"); AWS notes that BASE systems “prioritize availability over consistency”[[\[15\]](https://aws.amazon.com/compare/the-difference-between-acid-and-base-database/ "ACID vs BASE Databases - Difference Between Database…")](https://aws.amazon.com/compare/the-difference-between-acid-and-base-database/ "ACID vs BASE Databases - Difference Between Database…").
