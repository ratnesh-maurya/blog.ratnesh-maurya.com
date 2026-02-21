---
title: Eventual Consistency
description: 'Eventual consistency is a weak consistency model where if no new updates are made, all replicas of data will eventually converge to the same…'
questions:
  - What is Eventual Consistency?
  - When is Eventual Consistency used?
  - What are the trade-offs of Eventual Consistency?
---

## Definition

Eventual consistency is a weak consistency model where if no new updates are made, all replicas of data will eventually converge to the same state.

## Core concept

Updates may arrive at replicas at different times, so reads might get stale data for a while. However, given enough time without updates, all copies will match. This model guarantees the system will become consistent, but not immediately.

## Use cases

Important in distributed, partition-tolerant systems (AP in CAP). E.g., DNS, Amazon’s Dynamo, Cassandra. It allows the system to remain available and partition-tolerant by allowing temporary divergence.

## Trade-offs

Inconsistent reads are possible. The application must tolerate reading stale data for some window. Suitable for non-critical data, or where stale reads won’t cause harm.

## Example

When updating a user’s profile, one server might show the new name instantly, while another may lag by a few seconds. Eventually, all servers reflect the update.

## References

“Eventual consistency… after some time with no updates, all data replicas will eventually converge to a consistent state”[[\[19\]](https://www.geeksforgeeks.org/system-design/eventual-consistency-in-distributive-systems-learn-system-design/ "Eventual Consistency in Distributed Systems | Learn …")](https://www.geeksforgeeks.org/system-design/eventual-consistency-in-distributive-systems-learn-system-design/ "Eventual Consistency in Distributed Systems | Learn …").
