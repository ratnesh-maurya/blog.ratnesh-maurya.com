---
title: Read Replicas
description: A read replica is a read-only copy of a database instance. The primary database handles writes; read replicas asynchronously replicate data from the primary…
questions:
  - What is Read Replicas?
  - When is Read Replicas used?
  - What are the trade-offs of Read Replicas?
---

## Definition

A read replica is a read-only copy of a database instance[[\[9\]](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html "Working with DB instance read replicas - Amazon Rela…")](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html "Working with DB instance read replicas - Amazon Rela…"). The primary database handles writes; read replicas asynchronously replicate data from the primary and serve read queries.

## Core concept

Read replicas distribute read load. When an application needs to scale beyond one server’s capacity, it can direct SELECT queries to replicas, offloading work from the primary.

## Use cases

High-traffic systems with many read queries (web apps, reporting) use read replicas. For instance, a social network might route timeline fetches to replicas while writes (posting) go to primary.

## Trade-offs

Replication adds eventual consistency trade-offs: replicas lag slightly behind the primary, so a recent write might not immediately show up on a replica. Also, replicas must periodically synchronize with the primary, which adds network and I/O overhead. But read throughput and availability improve.

## Example

AWS RDS lets you create a read replica. The docs state: “A read replica is a read-only copy of a DB instance. You can reduce load on the primary by routing queries to the read replica, elastically scaling beyond the capacity of a single DB instance for read-heavy workloads”[[\[9\]](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html "Working with DB instance read replicas - Amazon Rela…")](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html "Working with DB instance read replicas - Amazon Rela…").

## References

AWS RDS docs on read replicas[[\[9\]](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html "Working with DB instance read replicas - Amazon Rela…")](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html "Working with DB instance read replicas - Amazon Rela…").
