---
title: Vertical Scaling
description: Vertical scaling (scale-up) increases the capacity of a single machine by adding CPU, RAM, or faster storage, trading simplicity for a hardware ceiling.
questions:
  - What is Vertical Scaling?
  - When is Vertical Scaling used?
  - What are the trade-offs of Vertical Scaling?
---

## Definition

Vertical scaling (scale-up) increases a system's capacity by upgrading the hardware of a single machine — more CPU cores, more RAM, faster SSDs, or a more powerful GPU.

## How it works

Instead of distributing work across multiple machines, vertical scaling makes one machine more powerful. The application code doesn't change — the same single-server process simply has more resources to work with. You stop the server, swap it to a larger instance type (e.g., AWS `r6g.xlarge` to `r6g.4xlarge`), and restart.

Databases benefit significantly from vertical scaling because many operations are inherently single-node: transactions, joins, and complex queries are simpler when all data is on one machine. PostgreSQL on a 64-core, 512GB RAM server can handle millions of rows and thousands of concurrent connections without the complexity of sharding.

Cloud providers make vertical scaling straightforward: resize an EC2 instance, upgrade an RDS instance class, or scale up an Azure VM. The downtime is typically a few minutes for a restart. Some managed databases (Aurora, Cloud SQL) support vertical scaling with near-zero downtime.

## When to use it

- **Single-database applications** — If your PostgreSQL instance is hitting CPU limits, moving from 8 to 32 cores is far simpler than introducing read replicas or sharding.
- **Monolithic applications early in their lifecycle** — Startups with a single server can buy years of headroom by upgrading to a larger instance before investing in distributed architecture.
- **Latency-sensitive workloads** — A single powerful machine avoids the network latency of cross-node communication in distributed systems.
- **Memory-bound workloads** — In-memory databases (Redis, Memcached) scale vertically by adding RAM. A 256GB Redis instance can cache a lot of data.

## Trade-offs

**Gains:** Zero application changes — no sharding, no distributed transactions, no consensus protocols. Simpler operations (one machine to monitor, back up, and patch). Strong consistency by default (no replication lag). Lower latency (no network hops).

**Costs:** Hardware has a ceiling. The largest AWS EC2 instance (`u-24tb1.metal`) has 24TB RAM — beyond that, there's no bigger machine. A single node is a single point of failure unless combined with replication. Vertical scaling often requires downtime for the resize. Cost scaling is non-linear: a 2x bigger instance often costs more than 2x the price.

## Example

Upgrading an AWS RDS PostgreSQL instance:

```bash
aws rds modify-db-instance \
  --db-instance-identifier mydb \
  --db-instance-class db.r6g.4xlarge \
  --apply-immediately

# Before: db.r6g.xlarge  (4 vCPU, 32 GB RAM) — $0.48/hr
# After:  db.r6g.4xlarge (16 vCPU, 128 GB RAM) — $1.92/hr
# 4x the resources, 4x the cost, zero code changes
```

## Related terms

Horizontal scaling takes the opposite approach — adding more machines rather than upgrading one. Load balancing distributes work in horizontally scaled systems. High availability (HA) addresses the single-point-of-failure risk of vertical scaling through replication and failover.
