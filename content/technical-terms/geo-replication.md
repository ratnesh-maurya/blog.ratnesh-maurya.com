---
title: Geo-Replication
description: Geo-replication copies data across geographically distributed data centers to improve latency, availability, and disaster recovery.
questions:
  - What is Geo-Replication?
  - When is Geo-Replication used?
  - What are the trade-offs of Geo-Replication?
---

## Definition

Geo-replication is the practice of replicating data across geographically separated data centers so that copies exist in multiple regions simultaneously.

## How it works

Cross-region network latency is significant—US East to EU West is roughly 80–100ms round-trip. This makes synchronous replication impractical for most workloads, so geo-replication is typically **asynchronous**. A write commits locally first, then replicates to remote regions in the background.

**Active-passive** setups designate one region as primary for writes. All other regions receive replicated data and serve reads only. AWS RDS cross-region read replicas work this way. Failover promotes a replica to primary if the primary region goes down, but there is a window of data loss equal to the replication lag (typically seconds).

**Active-active** setups allow writes in any region. CockroachDB and Azure Cosmos DB support this model. The hard problem is conflict resolution—if two regions update the same row simultaneously, the system needs a deterministic rule. Cosmos DB uses Last Writer Wins (LWW) with timestamps. CockroachDB uses serializable transactions with global consensus, paying a latency cost for cross-region coordination. Cassandra uses vector clocks or LWW at the column level.

Some systems offer **region-pinning**: data is assigned to a home region for low-latency writes, with read replicas elsewhere. Google Spanner lets you configure placement policies that keep user data in specific geographies, satisfying GDPR requirements while still providing global reads.

## When to use it

- Serving a global user base from a single US region adds 200ms+ latency for Asian users. Geo-replicate to `ap-southeast-1` to cut read latency to under 20ms.
- Meeting regulatory requirements: EU user data must stay in EU data centers, but US services need read access for analytics.
- Disaster recovery: if `us-east-1` goes down (it has, multiple times), a replica in `us-west-2` can take over within minutes.
- S3 Cross-Region Replication for serving static assets from the nearest bucket to the user.

## Trade-offs

**Gains:** Lower read latency for global users, high availability across region-level failures, and compliance with data residency regulations.

**Costs:** Asynchronous replication means stale reads—a user who writes in US East and immediately reads from EU West may not see their own write. Cross-region bandwidth costs add up: replicating 1 TB/day across AWS regions costs roughly $20/day in data transfer fees. Active-active conflict resolution adds application complexity. And more replicas mean more storage cost—3 regions tripling your storage bill.

## Example

Configuring CockroachDB zone constraints for geo-pinned data:

```sql
ALTER TABLE users CONFIGURE ZONE USING
  num_replicas = 5,
  constraints = '{"+region=us-east-1": 2, "+region=eu-west-1": 2, "+region=ap-southeast-1": 1}',
  lease_preferences = '[[+region=us-east-1]]';
```

## Related terms

Geo-replication often triggers rebalancing when regions are added or removed. In event streaming architectures, exactly-once semantics become harder to guarantee across geo-replicated Kafka clusters.
