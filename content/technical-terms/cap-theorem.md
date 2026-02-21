---
title: CAP Theorem
description: 'The CAP theorem (Brewer’s theorem) states that in the presence of a network partition, a distributed data store can only guarantee two of the following three:…'
questions:
  - What is CAP Theorem?
  - When is CAP Theorem used?
  - What are the trade-offs of CAP Theorem?
---

## Definition

The CAP theorem (Brewer’s theorem) states that in the presence of a network partition, a distributed data store can only guarantee two of the following three: Consistency, Availability, and Partition Tolerance.

Consistency (all nodes see the same data at the same time).

Availability (every request receives a response, either success or failure).

Partition Tolerance (system continues to operate despite network failures between nodes).

## Core concept

Under a network partition (P), you must choose between consistency and availability. For example, if a cluster splits, you can either allow writes on both sides (remain available but risk inconsistency) or refuse requests on some nodes (remain consistent but sacrifice availability).

## Use cases

This theorem guides database design choices. Traditional RDBMS (like single-node DBs) prioritize C/A (no partitions). Distributed NoSQL often choose P/A (partition-tolerant and available, at cost of consistency during partitions), or C/P (sacrificing availability under partitions).

## Trade-offs

CAP is about worst-case (partitions). Real systems try to maximize all three normally but must degrade gracefully. The theorem implies you cannot have a perfectly consistent and available system under partitions.

## Example

During a network split, a CP system like MongoDB (with primary/replica model and majority writes) might become unavailable on one side to avoid inconsistency; an AP system like Dynamo might allow writes on both sides and reconcile later.

## References

“CAP theorem states any distributed data store can provide at most two of: consistency, availability, partition tolerance”[[\[14\]](https://en.wikipedia.org/wiki/CAP_theorem "CAP theorem - Wikipedia")](https://en.wikipedia.org/wiki/CAP_theorem "CAP theorem - Wikipedia").
