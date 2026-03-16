---
title: Rebalancing (Data Rebalancing)
description: Rebalancing is redistributing data across nodes or partitions to restore even load after cluster changes or skew.
questions:
  - What is Rebalancing (Data Rebalancing)?
  - When is Rebalancing (Data Rebalancing) used?
  - What are the trade-offs of Rebalancing (Data Rebalancing)?
---

## Definition

Rebalancing is the process of redistributing data across nodes or partitions in a distributed system to restore even load and resource utilization.

## How it works

When a cluster changes—a node joins, a node dies, or data skew develops—some nodes end up holding disproportionately more data or handling more requests than others. Rebalancing moves data from overloaded nodes to underloaded ones until the distribution is roughly even again.

There are several strategies. **Fixed partition count** assigns a set number of partitions at creation time (e.g., Kafka topics with 64 partitions). When a node joins, it takes ownership of some partitions from existing nodes. The data moves, but the partition boundaries stay fixed. **Dynamic partitioning** splits hot partitions when they exceed a size threshold and merges cold ones. HBase and MongoDB use this approach. **Consistent hashing with virtual nodes** (used by Cassandra and DynamoDB) assigns multiple token ranges per physical node. Adding a node means reassigning a subset of tokens, moving roughly `1/N` of the data rather than reshuffling everything.

During rebalancing, the system must continue serving reads and writes. Most systems handle this by keeping the old assignment active until the new node has a full copy, then atomically switching ownership. Kafka, for example, uses an ISR (in-sync replica) list—a new replica catches up from the leader before becoming eligible to serve reads.

## When to use it

- After scaling a Cassandra cluster from 6 to 9 nodes: data needs to redistribute so the new nodes carry their share.
- When a Kafka consumer group member crashes: partitions previously assigned to it must be reassigned to surviving consumers.
- When a hot key in DynamoDB causes a single partition to throttle: adaptive capacity splits that partition automatically.
- After a PostgreSQL Citus cluster adds a worker node: `rebalance_table_shards()` redistributes shards across the new topology.

## Trade-offs

**Gains:** Even load distribution, better throughput, improved fault tolerance after node failures, and the ability to scale horizontally.

**Costs:** Rebalancing generates significant network and disk I/O. During the move, both source and destination nodes carry extra load. If done too aggressively, it can degrade latency for user-facing queries. Kafka partition reassignment, for instance, can saturate inter-broker bandwidth if you move too many partitions at once—the `throttle` flag on `kafka-reassign-partitions.sh` exists for this reason.

## Example

Triggering a Kafka partition reassignment with throttling:

```bash
kafka-reassign-partitions.sh \
  --bootstrap-server broker1:9092 \
  --reassignment-json-file reassign.json \
  --execute \
  --throttle 50000000  # 50 MB/s limit
```

## Related terms

Rebalancing is closely tied to hash partitioning and range partitioning, since the partitioning strategy determines how data moves during a rebalance. It also relates to geo-replication, where cross-region data placement adds another dimension to rebalancing decisions.
