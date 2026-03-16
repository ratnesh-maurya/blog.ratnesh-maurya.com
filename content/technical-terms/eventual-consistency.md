---
title: Eventual Consistency
description: Eventual consistency guarantees that if no new updates are made, all replicas of a data item will converge to the same value over time, trading immediate consistency for higher availability and lower latency.
questions:
  - What is Eventual Consistency?
  - When is Eventual Consistency used?
  - What are the trade-offs of Eventual Consistency?
---

## Definition

Eventual consistency is a consistency model where replicas of data may temporarily diverge after a write, but will converge to the same value once all updates have propagated — assuming no further writes occur.

## How it works

In a distributed system with multiple replicas, a write is initially applied to one node and then asynchronously replicated to the others. During this replication window (typically milliseconds to seconds), different nodes may return different values for the same key.

When a client writes `balance = 500` to Node A, Nodes B and C still return the old value until they receive the replication message. Once all replicas process the update, they all agree — consistency is "eventual," not immediate.

Conflict resolution is critical when multiple replicas accept concurrent writes to the same key. Common strategies: **last-write-wins** (LWW) uses timestamps to pick the most recent write (simple but can lose updates), **vector clocks** track causal relationships between updates, and **CRDTs** (Conflict-free Replicated Data Types) are data structures that automatically merge concurrent updates without conflicts (e.g., counters, sets, maps).

The replication lag — the time between a write on one node and its visibility on another — determines how "eventual" the consistency is. DynamoDB typically replicates within single-digit milliseconds. Cross-region replication can take 100-500ms.

## When to use it

- **Social media feeds** — A user's new post appearing 2 seconds later on another user's feed is acceptable. Availability matters more than immediate consistency.
- **Shopping carts** — Amazon DynamoDB (famously designed for eventual consistency) prioritizes cart availability. Merging two slightly different cart versions is better than showing an error.
- **DNS** — DNS records propagate across nameservers over minutes to hours. The system is eventually consistent by design.
- **CDN cache invalidation** — After updating content, CDN edge nodes serve stale versions until the cache expires or is purged.

## Trade-offs

**Gains:** Higher availability — writes succeed even if some replicas are down. Lower write latency — no need to wait for all replicas to acknowledge. Better partition tolerance — the system continues operating during network splits.

**Costs:** Readers may see stale data. Application logic must handle conflicts (what if two users update the same item simultaneously?). Testing is harder — race conditions that depend on replication timing are difficult to reproduce. Some operations (banking, inventory) cannot tolerate stale reads.

## Example

```
Client writes key="stock", value=50 to Node A (region us-east-1)
  Node A: stock = 50 ✓
  Node B (eu-west-1): stock = 100 (old value, replication in flight)
  Node C (ap-southeast-1): stock = 100 (old value)

  ... 200ms later ...

  Node B: stock = 50 ✓ (replication arrived)
  Node C: stock = 50 ✓ (replication arrived)

If a client reads from Node C during the 200ms window,
it sees stock = 100 (stale). This is the "eventual" part.
```

## Related terms

Strong consistency guarantees that every read returns the most recent write — the opposite of eventual consistency. CAP theorem explains why choosing availability (AP systems) leads to eventual consistency during partitions. BASE (Basically Available, Soft state, Eventually consistent) is the consistency model that formalizes eventual consistency as an alternative to ACID.
