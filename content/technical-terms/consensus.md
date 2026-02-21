---
title: Consensus
description: Consensus refers to the process whereby a group of distributed nodes agree on a single value or decision. It is critical in systems that need consistency…
questions:
  - What is Consensus?
  - When is Consensus used?
  - What are the trade-offs of Consensus?
---

## Definition

Consensus refers to the process whereby a group of distributed nodes agree on a single value or decision. It is critical in systems that need consistency despite failures or asynchronous communication.

## Core concept

Consensus algorithms (Paxos, Raft) ensure that, for example, only one value is chosen among proposals, even if some nodes fail. This ensures that all nodes eventually end up in the same state. In a DB, consensus can be used for leader election or commit protocols (e.g. using Paxos for a distributed commit).

## Use cases

Consensus is at the heart of any replicated system needing fault-tolerance. For instance, selecting a new master in ZooKeeper or committing a transaction in a distributed database.

## Trade-offs

Consensus can be complex to implement (ensuring safety and liveness). It can add communication overhead (multiple rounds). However, it provides strong consistency guarantees.

## Example

Raft consensus might be used to elect a leader and commit log entries in a distributed SQL cluster.

## References

GeeksforGeeks: “Distributed consensus… multiple nodes agree on a single value or course of action despite failures. It is crucial for consistency and reliability in decentralized environments”[[\[13\]](https://www.geeksforgeeks.org/computer-organization-architecture/distributed-consensus-in-distributed-systems/ "Distributed Consensus in Distributed Systems - Geeks…")](https://www.geeksforgeeks.org/computer-organization-architecture/distributed-consensus-in-distributed-systems/ "Distributed Consensus in Distributed Systems - Geeks…").
