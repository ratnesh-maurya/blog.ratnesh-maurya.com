---
title: CAP Theorem
description: The CAP theorem states that a distributed data store can guarantee at most two of three properties — Consistency, Availability, and Partition Tolerance — when a network partition occurs.
questions:
  - What is CAP Theorem?
  - When is CAP Theorem used?
  - What are the trade-offs of CAP Theorem?
---

## Definition

The CAP theorem (Brewer's theorem) states that in the presence of a network partition, a distributed system can guarantee at most two of three properties: Consistency, Availability, and Partition Tolerance.

## How it works

**Consistency (C)** — Every read returns the most recent write. All nodes see the same data at the same time. If you write a value to one node, any subsequent read from any node returns that value.

**Availability (A)** — Every request receives a response (success or failure), even if some nodes are down. The system never refuses to answer.

**Partition Tolerance (P)** — The system continues to operate despite network partitions (messages between nodes being lost or delayed). In any real distributed system, partitions can and do happen — P is not optional.

Since partitions are unavoidable in distributed systems, the real choice is between **CP** (consistent but may refuse requests during a partition) and **AP** (available but may return stale data during a partition).

**CP systems** prioritize consistency. During a partition, nodes that can't confirm they have the latest data refuse to serve reads. Examples: MongoDB (with majority read concern), HBase, etcd, ZooKeeper.

**AP systems** prioritize availability. During a partition, all nodes continue serving reads and accepting writes, but different nodes may return different values. Conflicts are resolved after the partition heals (eventual consistency). Examples: Cassandra, DynamoDB, CouchDB.

The theorem applies specifically during partitions. When the network is healthy, a well-designed system can provide all three properties simultaneously. The trade-off only forces a choice under failure conditions.

## When to use it

CAP is a decision framework for choosing databases and designing distributed systems:

- **Banking/financial systems** — Choose CP. Returning a stale account balance is unacceptable; it's better to reject a read than return wrong data.
- **Social media feeds** — Choose AP. A user seeing a slightly stale feed is acceptable; the feed being unavailable is not.
- **Configuration stores (etcd, ZooKeeper)** — Choose CP. Cluster coordination requires all nodes to agree on the current state.
- **Shopping carts** — Choose AP. A user should always be able to add items to their cart, even if different nodes have slightly different cart states.

## Trade-offs

**Choosing CP:** Guarantees correctness but reduces availability during partitions. Clients may see errors or timeouts. Requires consensus protocols (Raft, Paxos) which add latency to writes (because a majority of nodes must acknowledge).

**Choosing AP:** Guarantees users always get a response, but that response may be stale or inconsistent. Requires conflict resolution strategies (last-write-wins, vector clocks, CRDTs) which add application complexity.

**Common misconception:** CAP doesn't mean you pick two out of three upfront. Every distributed system must handle partitions (P is mandatory). The choice is: when a partition happens, do you sacrifice C or A?

## Example

A 3-node distributed key-value store during a network partition:

```
Node A (primary) ←──── partition ────→ Node B, Node C

Client writes key="balance", value=500 to Node A.

CP behavior: Node A cannot reach quorum (needs 2/3 nodes).
             Write is rejected. Client gets an error.
             → Consistent but unavailable.

AP behavior: Node A accepts the write locally.
             Node B and C still serve the old value (balance=400).
             After partition heals, conflict is resolved.
             → Available but temporarily inconsistent.
```

## Related terms

ACID provides transaction guarantees within a single database; CAP addresses guarantees across distributed nodes. BASE (Basically Available, Soft state, Eventually consistent) is the AP-side alternative to ACID. Consensus protocols (Raft, Paxos) are how CP systems achieve agreement across nodes. Eventual consistency is the consistency model used by AP systems.
