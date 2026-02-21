---
title: Geo-Replication
description: Geo-replication is replicating data across geographically distributed data centers.
questions:
  - What is Geo-Replication?
  - When is Geo-Replication used?
  - What are the trade-offs of Geo-Replication?
---

## Definition

Geo-replication is replicating data across geographically distributed data centers.

## Core concept

Ensures data is available near where it’s needed globally and provides disaster recovery. Usually asynchronous to tolerate high latencies, leading to eventual consistency across regions.

## Use cases

Cloud storage (S3 cross-region), globally distributed databases (Cassandra in multi-DC mode, CockroachDB).

## Trade-offs

Increased latency for cross-region sync, potential staleness. But improves read locality and resilience.

## References

Networking and cloud best practices.
