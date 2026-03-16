---
title: Strong Consistency
description: Strong consistency guarantees that every read returns the result of the most recent write, so all clients see the same data at the same time regardless of which node they query.
questions:
  - What is Strong Consistency?
  - When is Strong Consistency used?
  - What are the trade-offs of Strong Consistency?
---

## Definition

Strong consistency (also called linearizability) guarantees that every read returns the value of the most recent completed write, making the system behave as if there is only one copy of the data.

## How it works

In a strongly consistent system, after a write completes, every subsequent read from any node returns that written value. There is no window where different clients see different states.

Achieving this in a distributed system requires coordination. The most common approach is **consensus-based replication**: a write is acknowledged to the client only after a majority of replicas have stored it. Reads must either go to the leader node or read from a quorum of replicas to guarantee seeing the latest value.

In single-node databases (PostgreSQL on one server), strong consistency is the default — there's only one copy of the data, so reads always see the latest writes. The challenge is maintaining this guarantee when data is replicated across multiple nodes for fault tolerance.

Systems like etcd, ZooKeeper, and CockroachDB (with serializable isolation) provide strong consistency. They use Raft or Paxos consensus to ensure all committed writes are visible to all subsequent reads. The cost is higher write latency (must wait for quorum) and reduced availability during network partitions (minority partitions become read-only or unavailable).

## When to use it

- **Financial systems** — A bank balance must reflect all completed transactions immediately. Reading a stale balance could allow overdrafts.
- **Distributed locks** — A lock service must guarantee that if one client holds a lock, no other client can acquire it, regardless of which node they talk to.
- **Leader election** — All nodes must agree on who the current leader is. A stale read could cause split-brain.
- **Inventory management** — If a product has 1 unit left, two concurrent purchases must not both succeed.

## Trade-offs

**Gains:** Simplifies application logic — developers don't need to handle stale reads, conflict resolution, or eventual convergence. Every client sees the same state at the same time. No surprises.

**Costs:** Higher write latency — writes must wait for quorum acknowledgment (network round-trip to majority of replicas). Reduced availability — during a network partition, minority partitions cannot serve reads or accept writes (this is the CAP theorem trade-off). Lower throughput compared to eventually consistent systems.

## Example

```
5-node CockroachDB cluster with strong consistency:

Client writes: UPDATE accounts SET balance = 500 WHERE id = 1;
  → Leader replicates to 2 followers (quorum = 3/5)
  → All 3 acknowledge
  → Write is committed and client receives OK

Client reads from ANY node: SELECT balance WHERE id = 1;
  → Returns 500 (guaranteed — read goes through Raft log)
  → No stale data, no matter which node handles the read

During a partition (nodes 4 and 5 isolated):
  → Nodes 1-3 continue operating (they have quorum)
  → Nodes 4-5 refuse reads and writes (can't confirm latest state)
  → Availability is sacrificed for consistency
```

## Related terms

Eventual consistency is the alternative — replicas converge over time but may temporarily disagree. CAP theorem explains that strong consistency requires sacrificing availability during partitions. Consensus (Raft, Paxos) is the mechanism that implements strong consistency across distributed nodes. Quorum defines how many nodes must agree for a read or write to be considered valid.
