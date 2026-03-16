---
title: Failover
description: Failover is the automatic or manual switching of operations from a failed primary system to a standby replica, ensuring service continuity with minimal downtime.
questions:
  - What is Failover?
  - When is Failover used?
  - What are the trade-offs of Failover?
---

## Definition

Failover is the process of switching operations from a failed primary system to a secondary (standby) system so that service continues with minimal interruption.

## How it works

A failover setup requires at least two components: a **primary** (active) node and a **standby** (passive) node. The standby continuously receives updates from the primary — through streaming replication for databases, or state synchronization for application servers — so it's ready to take over at any moment.

A **health check mechanism** monitors the primary. This could be a simple TCP probe, an HTTP endpoint (`/healthz`), or a consensus-based system like Patroni or etcd. When the primary fails health checks (misses N consecutive probes), the failover system triggers promotion.

**Automatic failover** promotes the standby without human intervention. AWS RDS Multi-AZ, PostgreSQL with Patroni, and Redis Sentinel all support this. The DNS record or load balancer is updated to point to the new primary. Clients reconnect automatically (with a brief interruption, typically 10-30 seconds).

**Manual failover** requires an operator to verify the failure and trigger the switch. This is safer (avoids false positives) but slower. Production databases in regulated industries sometimes mandate manual failover to prevent accidental split-brain.

The critical risk during failover is **split-brain**: both nodes believing they're the primary and accepting writes. Fencing mechanisms (STONITH — "Shoot The Other Node In The Head") ensure the old primary is truly dead before the standby is promoted.

## When to use it

- **Database clusters** — PostgreSQL, MySQL, MongoDB replica sets all use failover to maintain write availability when the primary goes down.
- **Application servers** — Kubernetes restarts failed pods and reschedules them on healthy nodes — a form of automated failover.
- **DNS failover** — Route 53 health checks detect a failed region and route traffic to the DR region.
- **Message brokers** — Kafka controller failover elects a new controller broker when the current one crashes.

## Trade-offs

**Gains:** Near-continuous service availability. Meets SLA uptime commitments (99.99% requires failover to complete in under 4.3 minutes per month). Protects against hardware failures, software crashes, and network issues.

**Costs:** The standby consumes resources (compute, storage, network bandwidth for replication) without serving production traffic. Replication lag means the standby may be slightly behind — transactions committed on the primary but not yet replicated are lost during failover. Failover detection has a latency window (health check interval x failure threshold), during which the service is down.

## Example

PostgreSQL failover with `pg_promote`:

```sql
-- On the standby, after detecting primary failure:
SELECT pg_promote();
-- Standby becomes the new primary and starts accepting writes

-- Application connection string with failover support:
-- host=primary,standby dbname=mydb target_session_attrs=read-write
```

AWS RDS Multi-AZ failover is automatic:
```
Primary (us-east-1a) fails
  → RDS detects failure (health check)
  → Standby (us-east-1b) is promoted
  → DNS endpoint updates to point to new primary
  → Total failover time: 60-120 seconds
```

## Related terms

High availability (HA) is the design goal that failover enables. Split-brain is the failure mode where two nodes both accept writes after an incomplete failover. Leader-follower replication is the replication topology that maintains the standby for failover.
