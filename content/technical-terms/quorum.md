---
title: Quorum
description: 'In distributed systems, a quorum is the minimum number of votes (or nodes) that must agree to perform an operation. It is a technique to ensure consistency…'
questions:
  - What is Quorum?
  - When is Quorum used?
  - What are the trade-offs of Quorum?
---

## Definition

In distributed systems, a quorum is the minimum number of votes (or nodes) that must agree to perform an operation. It is a technique to ensure consistency during reads and writes. For example, in a system of N nodes, one might require at least ⌈N/2⌉ nodes to agree (a majority quorum) to commit a change.

## Core concept

Quorums avoid split-brain problems by making sure a majority (or other threshold) participates. For instance, in a replicated state machine, a write might be considered committed once a majority of replicas acknowledge it. A read might require contacting a majority to ensure it sees the latest data.

## Use cases

Quorum-based reads/writes appear in consensus algorithms (Paxos, Raft) and in distributed databases (Cassandra, etc.). Cassandra uses write_quorum to require a majority of replicas to acknowledge a write, and read_quorum for reads.

## Trade-offs

Higher quorums mean stronger consistency (since majority overlaps) but higher latency (must wait for more nodes). Lower quorums increase availability but risk serving stale data.

## Example

In a 5-node cluster, a majority quorum is 3. If 3 nodes agree on a value, it’s safe.

## References

Definition from Wikipedia: “A quorum is the minimum number of votes a distributed transaction must obtain to perform an operation”[[\[12\]](https://en.wikipedia.org/wiki/Quorum_(distributed_computing "Quorum (distributed computing) - Wikipedia").
