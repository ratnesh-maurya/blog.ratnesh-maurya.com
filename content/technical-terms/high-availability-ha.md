---
title: High Availability (HA)
description: High availability means a system is continuously operational with minimal downtime, typically measured as 99.9% to 99.999% uptime through redundancy, automatic failover, and distributed architecture.
questions:
  - What is High Availability (HA)?
  - When is High Availability (HA) used?
  - What are the trade-offs of High Availability (HA)?
---

## Definition

High availability (HA) is a system design approach that ensures continuous operation and minimal downtime, typically targeting 99.9% uptime (8.7 hours downtime/year) or higher.

## How it works

HA eliminates single points of failure by duplicating critical components. If one component fails, a redundant copy takes over automatically. This applies at every layer of the stack:

**Compute** — Run multiple instances of each service across different servers or availability zones. A load balancer routes traffic only to healthy instances. If one instance crashes, the load balancer removes it from the pool within seconds.

**Storage** — Databases replicate data to standby nodes. PostgreSQL streaming replication keeps a hot standby within milliseconds of the primary. If the primary fails, the standby is promoted automatically (failover). AWS RDS Multi-AZ does this transparently.

**Network** — Redundant network paths, DNS failover (Route 53 health checks), and anycast routing ensure clients can reach the service even if an entire data center goes offline.

The key metric is uptime percentage, measured in "nines":

| Uptime | Downtime/year | Downtime/month |
|--------|--------------|----------------|
| 99.9% (three nines) | 8h 45m | 43m |
| 99.99% (four nines) | 52m | 4.3m |
| 99.999% (five nines) | 5m 15s | 26s |

Each additional nine roughly requires 10x the engineering effort and infrastructure cost.

## When to use it

- **Payment processing** — Stripe, Square, and bank APIs target four or five nines. Downtime directly equals lost revenue.
- **Healthcare systems** — Patient monitoring and electronic health records require continuous availability.
- **SaaS platforms** — SLAs in enterprise contracts typically guarantee 99.9% or 99.95% uptime with financial penalties for breaches.
- **DNS and authentication** — If your auth service is down, every other service is effectively down too.

## Trade-offs

**Gains:** Users experience near-zero service interruptions. Business continuity during hardware failures, software bugs, and even data center outages. Meets contractual SLA obligations.

**Costs:** Running redundant infrastructure doubles (or triples) compute and storage costs. Failover mechanisms add operational complexity — you need health checks, promotion logic, and split-brain prevention. Testing HA requires chaos engineering (deliberately killing components), which itself carries risk. Distributed consistency becomes harder: replication lag means the standby may be slightly behind the primary at failover time.

## Example

A PostgreSQL HA setup with Patroni:

```yaml
# Patroni config for a 3-node PostgreSQL cluster
scope: mydb-cluster
name: node1

postgresql:
  listen: 0.0.0.0:5432
  data_dir: /var/lib/postgresql/data
  parameters:
    max_connections: 200
    wal_level: replica
    max_wal_senders: 5
    hot_standby: "on"

bootstrap:
  dcs:
    ttl: 30
    loop_wait: 10
    retry_timeout: 10
    maximum_lag_on_failover: 1048576  # 1MB max replication lag for promotion
```

Patroni monitors all three nodes, elects a leader, and automatically promotes a replica to primary if the leader fails — typically within 10-30 seconds.

## Related terms

Failover is the mechanism that switches traffic from a failed primary to a standby. Load balancing distributes traffic across HA nodes. Split-brain is the failure mode where two nodes both believe they're the primary — HA systems must prevent this.
