---
title: Quorum
description: 'A quorum is the minimum number of replicas that must acknowledge a read or write before it counts. Choosing quorums so that W + R > N makes every read overlap the latest acknowledged write, without waiting for every node.'
questions:
  - What is Quorum?
  - When is Quorum used?
  - What are the trade-offs of Quorum?
---

## Definition

A quorum is the minimum number of nodes that must respond to an operation before the system treats it as successful. Instead of waiting for every replica, reads and writes wait for "enough" of them, chosen so that any two quorums share at least one node.

## How it works

Take data stored on `N` replicas. A write must be acknowledged by `W` of them and a read must hear back from `R` of them. If **W + R > N**, the nodes that took the write and the nodes asked by the read must share at least one node, so the read sees the newest acknowledged value and picks it by version or timestamp. With `N = 3`, the common choice is `W = 2`, `R = 2`.

The most common threshold is a **majority quorum**: `floor(N/2) + 1` nodes. Any two majorities of the same group always intersect. In Raft, a candidate needs votes from a majority to become leader, so two leaders cannot win the same term, and a log entry is committed once a majority has stored it. In Paxos, a value is chosen once a majority of acceptors accepts it. A 5-node cluster needs 3 and tolerates 2 failures; a 4-node cluster also needs 3, so it tolerates only 1, which is why clusters usually have an odd size.

Dynamo-style databases (from Amazon's Dynamo paper; Cassandra and Riak follow it) let you tune `W` and `R` per request. Cassandra calls these consistency levels: `ONE`, `QUORUM`, `LOCAL_QUORUM`, `ALL`.

A **sloppy quorum** relaxes the rule: when home replicas are unreachable, other nodes accept the write and pass it on once the home replica returns (**hinted handoff**). Writes stay available, but the write and a later read may land on different nodes, so W + R > N no longer guarantees overlap.

## When to use it

- **Replicated databases** that need recent writes visible without waiting on every replica.
- **Leader election and consensus**: Raft, Paxos and coordination services such as etcd and ZooKeeper commit decisions with majority quorums.
- **Avoiding split-brain**: only the side of a partition that holds a majority can make progress.
- **Tunable consistency**: fast `ONE` reads for analytics, `QUORUM` reads for data that must be current.

## Trade-offs

**Gains:** Reads can see the latest acknowledged write while some replicas are slow or down. Latency depends on the fastest `W` (or `R`) replicas to respond, not on the slowest one. Two partitions cannot both accept conflicting decisions.

**Costs:** Larger quorums mean more round trips and lower availability; with `W = N`, one dead replica blocks writes. W + R > N on its own does **not** give linearizability: a write that reaches fewer than `W` nodes fails but is not rolled back where it landed, a read running alongside a write can see the new value while a later read sees the old one, and concurrent writes to the same key still need conflict resolution (Cassandra uses last-write-wins timestamps). Sloppy quorums weaken the guarantee further.

## Example

A worked example in Cassandra with three replicas per row (`N = 3`). `QUORUM` is `floor(3/2) + 1 = 2`, so writes and reads at `QUORUM` give 2 + 2 > 3:

```sql
CREATE KEYSPACE shop
  WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 3};

-- cqlsh: wait for 2 of 3 replicas on every request
CONSISTENCY QUORUM;

INSERT INTO shop.carts (user_id, items) VALUES (42, ['book']);
SELECT items FROM shop.carts WHERE user_id = 42;

-- ONE + ONE = 2, not > 3: faster, but reads may be stale
CONSISTENCY ONE;
```

With one replica down, `QUORUM` requests still succeed; with two down, they fail, while `ONE` keeps answering with possibly stale data.

## Related terms

Consensus algorithms such as Raft and Paxos are built on majority quorums, and split-brain is the failure they prevent. Strong consistency needs more than overlapping quorums; eventual consistency is what low settings like `ONE` give you. The CAP theorem explains why a quorum system, during a partition, must choose between answering and staying consistent. Leader-follower replication sends every write through one leader instead.
