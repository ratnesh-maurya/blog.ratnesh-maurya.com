---
title: Consensus
description: Consensus is the process by which distributed nodes agree on a single value or decision, even when some nodes fail, using algorithms like Raft and Paxos.
questions:
  - What is Consensus?
  - When is Consensus used?
  - What are the trade-offs of Consensus?
---

## Definition

Consensus is the problem of getting multiple nodes in a distributed system to agree on a single value or sequence of values, even when some nodes crash or messages are delayed.

## How it works

In a distributed system, nodes communicate over unreliable networks. Consensus protocols ensure that all functioning nodes agree on the same decisions in the same order, despite failures.

**Raft** (used by etcd, CockroachDB, TiKV) is the most widely deployed consensus algorithm today. It elects a **leader** node that receives all writes, replicates them to **follower** nodes, and commits once a majority (quorum) acknowledges. If the leader crashes, followers detect the absence via heartbeat timeouts and hold an election to choose a new leader. The guarantee: every committed entry is durable on a majority of nodes and will appear in the same order on every node.

**Paxos** (used by Google Chubby, older systems) solves the same problem but is harder to implement and understand. Multi-Paxos extends it to agree on a sequence of values.

Both algorithms tolerate `f` failures in a cluster of `2f + 1` nodes. A 3-node cluster tolerates 1 failure; a 5-node cluster tolerates 2. Writes require a majority acknowledgment, so a 5-node cluster needs 3 responses before confirming a write.

The key insight: consensus is possible despite crash failures (nodes stopping) but impossible in asynchronous networks with Byzantine failures (nodes lying) without additional assumptions. This is the FLP impossibility result — practical systems work around it with timeouts and leader election.

## When to use it

- **Distributed databases** — CockroachDB and TiDB use Raft to replicate writes across nodes, ensuring strong consistency.
- **Configuration stores** — etcd and ZooKeeper provide consensus-backed key-value storage for cluster configuration, leader election, and distributed locking.
- **Blockchain** — Proof-of-Work and Proof-of-Stake are consensus mechanisms for Byzantine fault tolerance (where nodes may be malicious).
- **Distributed locks** — A lock service backed by consensus (etcd, ZooKeeper) ensures only one holder at a time across the cluster.

## Trade-offs

**Gains:** Strong consistency — all nodes agree on the same state. Fault tolerance — the system continues operating as long as a majority of nodes are alive. Provides a foundation for linearizable reads and writes.

**Costs:** Write latency increases with node count and network distance (must wait for quorum acknowledgment). A majority must be reachable — losing more than half the nodes makes the cluster read-only or unavailable. Consensus is a CP choice in CAP theorem terms: during a network partition, minority partitions become unavailable.

## Example

A 5-node Raft cluster handling a write:

```
Client → Leader (Node 1)
  Leader appends entry to its log
  Leader sends AppendEntries RPC to Nodes 2, 3, 4, 5
  Nodes 2, 3 acknowledge (quorum = 3 including leader)
  Leader commits the entry and responds to client
  Nodes 4, 5 receive the entry asynchronously

If Node 1 (leader) crashes:
  Nodes 2-5 detect missing heartbeats (election timeout)
  Node 3 starts an election, gets votes from 2 and 4
  Node 3 becomes the new leader
  All committed entries are preserved (they're on a majority)
```

## Related terms

CAP theorem frames the fundamental trade-off consensus makes (consistency over availability during partitions). Quorum defines the majority threshold for consensus decisions. Two-phase commit (2PC) solves a different problem (atomic commits across databases) but also requires agreement among participants. Strong consistency is the guarantee that consensus provides.
