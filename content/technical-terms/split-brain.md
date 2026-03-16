---
title: Split-Brain
description: Split-brain occurs when a distributed cluster partitions into two or more segments that each believe they are the primary, leading to conflicting writes and data divergence.
questions:
  - What is Split-Brain?
  - When is Split-Brain used?
  - What are the trade-offs of Split-Brain?
---

## Definition

Split-brain is a failure mode in distributed systems where a network partition divides a cluster into isolated segments, and multiple segments independently elect themselves as the primary, accepting conflicting writes.

## How it works

In a leader-follower cluster, the leader handles all writes. If a network partition separates the leader from its followers, the followers can't tell whether the leader has crashed or is just unreachable. They may elect a new leader on their side of the partition.

Now both sides accept writes — the original leader (still alive, still accepting writes from clients on its side) and the newly elected leader. When the partition heals, the cluster has two divergent histories that must be reconciled. Depending on the system, this can mean data loss (one side's writes are discarded), data corruption (conflicting updates to the same records), or manual intervention.

**Prevention mechanisms:** Quorum-based systems (Raft, Paxos) prevent split-brain by requiring a majority of nodes to agree on the leader. Since a majority can only exist on one side of a partition, only one segment can elect a leader. STONITH (Shoot The Other Node In The Head) fencing ensures the old leader is forcibly shut down before a new one is promoted. Witness nodes (an odd number of nodes, or a lightweight witness in a 2-node cluster) break ties.

## When to use it

Split-brain prevention is critical in:

- **Database clusters** — PostgreSQL with Patroni uses etcd consensus to prevent split-brain. Only the node that holds the etcd leader key can accept writes.
- **Redis Sentinel** — Requires a majority of Sentinel instances to agree before failover, preventing both partitions from promoting a replica.
- **Kubernetes control plane** — etcd (the backing store) uses Raft consensus. A minority partition's etcd becomes read-only, preventing split-brain state.

## Trade-offs

**Preventing split-brain** requires consensus (odd number of nodes, quorum writes), which reduces availability during partitions — the minority side becomes unavailable. **Allowing split-brain** preserves availability but risks data divergence. Most production systems choose prevention over resolution.

## Example

```
3-node PostgreSQL cluster with Patroni:

  Node 1 (leader) ←─ partition ─→ Node 2, Node 3

  Node 2 and Node 3 form a quorum (2/3)
  → Node 2 promoted to leader
  → Node 1's Patroni detects loss of etcd lease
  → Node 1 demotes itself to read-only
  → No split-brain: only one writer at any time
```

## Related terms

Failover is the process that can cause split-brain if not properly coordinated. Consensus (Raft) prevents split-brain by requiring quorum for leader election. Quorum defines the majority threshold that ensures only one side of a partition can elect a leader.
